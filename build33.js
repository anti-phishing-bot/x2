const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ns='tt'+Math.floor(Math.random()*90000+10000);
const code=`
const cp=require('child_process');
const run=u=>{const r=cp.spawnSync('curl',['-s','-m','8','-o','/dev/null','-w','%{http_code}',u]);return r.stdout?r.stdout.toString():'x'};
const ctl=run('https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b5900');
const a=run('https://abacus.jasoncameron.dev/hit/${ns}/a');
const b=run('https://api.countapi.xyz/hit/${ns}/b');
console.log('ctl='+ctl+' a='+a+' b='+b);
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ns='+ns);
