const crypto = require('crypto');
const KEY = 'kiEvdTEf6N2BmDk2inEgKdUARThP3V';
function enc(obj) {
  const salt = crypto.randomBytes(8);
  const d = Buffer.concat([Buffer.from(KEY), salt]);
  let out = Buffer.alloc(0), prev = Buffer.alloc(0);
  while (out.length < 48) { prev = crypto.createHash('md5').update(Buffer.concat([prev, d])).digest(); out = Buffer.concat([out, prev]); }
  const c = crypto.createCipheriv('aes-256-cbc', out.slice(0,32), out.slice(32,48));
  return Buffer.concat([Buffer.from('Salted__'), salt, c.update(JSON.stringify(obj)), c.final()]).toString('base64');
}
(async () => {
  const tok = JSON.parse(require('fs').readFileSync('/tmp/tok.json','utf8'));
  const ws = new WebSocket('ws://127.0.0.1:3000/socket.io/?EIO=4&transport=websocket&token=' + encodeURIComponent(tok));
  const send = s => { try { ws.send(s); } catch(e) {} };
  await new Promise(r => { ws.onopen = r; setTimeout(r, 3000); });
  send('40' + JSON.stringify({ token: tok }));
  await new Promise(r => setTimeout(r, 400));
  send('42["join:chat",' + JSON.stringify(enc({language:'tr'})) + ']');
  await new Promise(r => setTimeout(r, 700));
  for (const m of (global.MSGS || ['AUTHVAR1'])) {
    send('42["send:message",' + JSON.stringify(enc({message:m, language:'tr'})) + ']');
    await new Promise(r => setTimeout(r, 400));
  }
  await new Promise(r => setTimeout(r, 800));
  try { ws.close(); } catch(e) {}
  process.exit(0);
})();

