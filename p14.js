const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
s=s.replace("const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/')]);","const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/'),Buffer.from([0x28,0x02])]);");
fs.writeFileSync('cri2.js',s);
console.log(s.includes('0x28,0x02'));
