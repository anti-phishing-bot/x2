const fs=require('fs');
const s=fs.readFileSync('zz9.svg','utf8');
console.log('p1.js occurrences:', (s.match(/p1\.js/g)||[]).length);
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g; let m; const out=[];
while((m=re.exec(s))){ const t=m[0].replace('%2B','+'); const b=Buffer.alloc(8); b.writeDoubleBE(Number(t)); const str=b.toString('latin1'); if(/^[\x20-\x7e]{4,}/.test(str)) out.push(JSON.stringify(str)); }
console.log(out.join('\n'));
