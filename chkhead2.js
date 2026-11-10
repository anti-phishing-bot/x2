const fs=require('fs');
for(const f of ['zz9.svg','aae.svg']){ const s=fs.readFileSync(f,'utf8'); console.log(f, JSON.stringify(s.slice(0,30))); }
