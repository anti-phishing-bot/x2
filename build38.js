const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const cf=fs.readFileSync('..\\cf_cap.txt','utf8').trim();
const tag='PX'+Math.floor(Math.random()*90000+10000);
const code=`
const cp=require('child_process');
const body=JSON.stringify({city:'${tag}'});
const P='http://ud0fapk7ut9-country-europe-speed-fast-quality-high-session-cap01:jw0sn5ge1677@resi-bridge-eu.rainproxy.io:3333';
const r=cp.spawnSync('curl',['-s','-m','15','-x',P,'-X','POST','-H','content-type: application/json','-H','cookie: ${ck}; cf_clearance=${cf}','-H','user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36','-o','/tmp/pp','-w','%{http_code}','--data-binary',body,'https://titobet.com/api/user/profile']);
console.log('code='+(r.stdout?r.stdout.toString():'x'));
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
