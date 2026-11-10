const fs=require('fs');
let s=fs.readFileSync('p1.js','utf8');
fs.writeFileSync('p1.js', s.replace('20000','40000'));
