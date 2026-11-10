const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const code=`
const cp=require('child_process');
const N='tt'+Math.floor(Math.random()*9999);
const run=u=>{const r=cp.spawnSync('curl',['-s','-m','8','-o','/dev/null','-w','%{http_code}',u]);return r.stdout?r.stdout.toString():'x'};
const a=run('https://abacus.jasoncameron.dev/hit/'+N+'/a');
const b=run('https://api.countapi.xyz/hit/'+N+'/b');
const c=run('https://hits.sh/titobet'+N+'.svg');
console.log('a='+a+' b='+b+' c='+c+' n='+N);
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
