const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
s=s.replace("fl(0x12,'u9')","fl(0x12,'u'+Math.floor(Math.random()*1e9))");
s=s.replace("fl(0x0a,'zzfb')","fl(0x0a,'zz'+Math.floor(Math.random()*1e6))");
s=s.replace("fl(0x0a,'zzfc')","fl(0x0a,'zzc'+Math.floor(Math.random()*1e6))");
fs.writeFileSync('cri2.js',s);
console.log('randomized');
