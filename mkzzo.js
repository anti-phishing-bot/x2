const fs=require('fs');
const s=fs.readFileSync('zzn.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g; const toks=[...s.matchAll(re)];
const chunks=toks.map(m=>{const b=Buffer.alloc(8);b.writeDoubleBE(Number(m[0].replace('%2B','+')));return Buffer.from(b).reverse();});
let hit=-1;
chunks.forEach((c,i)=>{ const t=c.toString('latin1'); if(t[0]==='z'&&t[1]==='n'){ hit=i; c[1]=0x6f; } });
console.log('hit',hit, hit>=0?JSON.stringify(chunks[hit].toString('latin1')):'');
if(hit<0) process.exit(1);
let out=s;
for(let i=toks.length-1;i>=0;i--){ const seg=Buffer.from(chunks[i]).reverse(); const d=seg.readDoubleBE(0);
  out=out.slice(0,toks[i].index)+d.toString().replace('+','%2B')+out.slice(toks[i].index+toks[i][0].length); }
const target=25410; const padAt=out.indexOf("<!ENTITY active '")+16; const dl=out.length-target;
if(dl<0) out=out.slice(0,padAt)+' '.repeat(-dl)+out.slice(padAt);
else if(dl>0){ let i=padAt; while(out[i]===' '&&dl>0){ out=out.slice(0,i)+out.slice(i+1);} }
fs.writeFileSync('zzo.svg',out);
console.log('len',out.length);
