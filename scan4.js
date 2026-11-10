const fs=require('fs');
const s=fs.readFileSync('zz9.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g; const toks=[...s.matchAll(re)];
toks.forEach((m,i)=>{ const b=Buffer.alloc(8); b.writeDoubleBE(Number(m[0].replace('%2B','+'))); const t=b.toString('latin1'); if(/[\x20-\x7e]{2,}/.test(t)) console.log(i, JSON.stringify(t)); });
