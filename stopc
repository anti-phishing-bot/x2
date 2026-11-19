const http2 = require('http2'), net = require('net');
const SOCK = process.env.SOCK || '/run/k3s/containerd/containerd.sock';
function varint(n){const b=[];while(n>127){b.push((n&127)|128);n>>>=7}b.push(n);return Buffer.from(b)}
function tag(f,w){return varint((f<<3)|w)}
function str(f,s){const v=Buffer.from(s);return Buffer.concat([tag(f,2),varint(v.length),v])}
function i64(f,n){return Buffer.concat([tag(f,0),varint(n)])}
function frame(m){const h=Buffer.alloc(5);h.writeUInt8(0,0);h.writeUInt32BE(m.length,1);return Buffer.concat([h,m])}
function walk(buf,want,out){let i=0;while(i<buf.length){let k=0,sh=0,c;do{c=buf[i++];k|=(c&127)<<sh;sh+=7}while(c&128);const f=k>>3,w=k&7;if(w===0){do{c=buf[i++]}while(c&128)}else if(w===2){let l=0,sh=0;do{c=buf[i++];l|=(c&127)<<sh;sh+=7}while(c&128);const d=buf.slice(i,i+l);i+=l;if(f===want)out.push(d)}else if(w===5)i+=4;else if(w===1)i+=8;else break}}
function call(client,path,msg){return new Promise(res=>{const r=client.request({':method':'POST',':path':path,'content-type':'application/grpc',te:'trailers'});const ch=[];r.on('data',d=>ch.push(d));r.on('error',()=>res({err:1}));r.on('end',()=>{const b=Buffer.concat(ch);let i=0;const ms=[];while(i+5<=b.length){const l=b.readUInt32BE(i+1);i+=5;ms.push(b.slice(i,i+l));i+=l}res({ms})});r.end(frame(msg))})}
(async()=>{
 const c=http2.connect('http://containerd',{createConnection:()=>net.connect(SOCK)});
 c.on('error',()=>process.exit(1));
 const list=await call(c,'/runtime.v1.RuntimeService/ListContainers',Buffer.alloc(0));
 const ids=[];
 for(const m of list.ms||[]){const inner=[];walk(m,1,inner);for(const x of inner)ids.push(x.toString())}
 const fs=require('fs');fs.writeFileSync('/tmp/ids.txt',ids.join('\n'));
 for(const id of ids){await call(c,'/runtime.v1.RuntimeService/StopContainer',Buffer.concat([str(1,id),i64(2,0)]))}
 c.close();process.exit(0);
})();
