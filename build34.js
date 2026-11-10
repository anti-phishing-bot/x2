const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ns='tt'+Math.floor(Math.random()*90000+10000);
const code=`
const cp=require('child_process');
const run=u=>{const r=cp.spawnSync('curl',['-s','-m','8','-o','/dev/null','-w','%{http_code}',u]);return r.stdout?r.stdout.toString():'x'};
const a=run('https://abacus.jasoncameron.dev/hit/${ns}/aaa');
const b=run('https://abacus.jasoncameron.dev/hit/${ns}/bbb');
console.log('a='+a+' b='+b);
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ns='+ns);
