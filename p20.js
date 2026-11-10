const fs=require('fs');
let c=fs.readFileSync('cri3.js','utf8');
c=c.replace("call('/runtime.v1.RuntimeService/RunPodSandbox',pcfg2,","call('/runtime.v1.RuntimeService/RunPodSandbox',Buffer.concat([fl(0x0a,pcfg2),fl(0x12,'runc')]),");
fs.writeFileSync('cri3.js',c);
console.log('patched', /runc/.test(c));
