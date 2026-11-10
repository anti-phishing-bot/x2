const fs=require('fs');
let c=fs.readFileSync('cri3.js','utf8');
c=c.replace(/const cp=fl\(0x0a,'\/kubepods'\);[\s\S]*?const pc?=Buffer\.concat\(\[[^\]]*\];\n/, '');
fs.writeFileSync('cri3.js',c);
console.log(/linux|0x42/.test(c));
