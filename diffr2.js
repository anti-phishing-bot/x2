const fs=require('fs');
for(const f of ['zz9.svg','aad.svg']){ const s=fs.readFileSync(f,'utf8'); console.log(f, JSON.stringify(s.slice(0,60))); }
const a=fs.readFileSync('zz9.svg','utf8'), b=fs.readFileSync('aad.svg','utf8');
const ia=a.indexOf("<!ENTITY active '"), ib=b.indexOf("<!ENTITY active '");
console.log('idx', ia, ib);
let sa=0; while(a[ia+16+sa]===' ') sa++; let sb=0; while(b[ib+16+sb]===' ') sb++;
console.log('spaces', sa, sb);
