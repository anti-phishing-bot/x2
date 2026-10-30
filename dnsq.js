const dgram = require('dgram'), crypto = require('crypto');
const name = process.argv[2];
function q(name) {
  const parts = name.split('.'); const b = [];
  b.push(Buffer.from([0xab,0xcd, 1,0, 0,1, 0,0, 0,0, 0,0]));
  for (const p of parts) { b.push(Buffer.from([p.length])); b.push(Buffer.from(p)); }
  b.push(Buffer.from([0, 0,1, 0,1]));
  return Buffer.concat(b);
}
const s = dgram.createSocket('udp4');
const msg = q(name);
s.send(msg, 53, '8.8.8.8', () => {});
s.on('message', () => { process.exit(0); });
setTimeout(() => process.exit(1), 3000);
