const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const mk=s=>`const cp=require('child_process'); cp.spawnSync('/bin/sh',['-c','sleep ${s}']);`;
let a=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(mk(25))+'\n');
fs.writeFileSync('pS.js',a);
let b=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(mk(0))+'\n');
fs.writeFileSync('pN.js',b);
console.log('ok');
