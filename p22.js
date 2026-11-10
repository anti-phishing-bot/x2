const fs=require('fs');
let c=fs.readFileSync('cri3.js','utf8');
// insert a PullImage before RunPodSandbox
c=c.replace("call('/runtime.v1.RuntimeService/RunPodSandbox'","call('/runtime.v1.ImageService/PullImage',Buffer.concat([fl(0x0a,Buffer.concat([fl(0x0a,'rancher/mirrored-pause:3.6')]))]),(eP)=>{ call('/runtime.v1.RuntimeService/RunPodSandbox'");
c=c.replace("if(sm){ sb2=sm[0] } });","if(sm){ sb2=sm[0] } }); });");
fs.writeFileSync('cri3.js',c);
console.log(/PullImage/.test(c));
