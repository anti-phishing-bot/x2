const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
s=s.split('0x72').join('0x7a');
fs.writeFileSync('cri2.js',s);
console.log((s.match(/0x7a/g)||[]).length+' occurrences');
