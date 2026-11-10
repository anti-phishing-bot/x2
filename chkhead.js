const fs=require('fs');
for(const f of ['zzn.svg','zzo.svg']){ const s=fs.readFileSync(f,'utf8'); console.log(f, JSON.stringify(s.slice(0,30))); }
