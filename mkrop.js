const fs=require('fs');
const name=process.argv[2];
if(!/^[a-z]{3}$/.test(name)) throw new Error('3 lowercase letters');
const s=fs.readFileSync('zz9.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g; const toks=[...s.matchAll(re)];
const chunks=toks.map(m=>{const b=Buffer.alloc(8);b.writeDoubleBE(Number(m[0].replace('%2B','+')));return Buffer.from(b).reverse();});
let hit=-1, prev=-1;
chunks.forEach((c,i)=>{ const t=c.toString('latin1'); if(t.startsWith('z9|sh')) hit=i; if(t.endsWith('@main/z')) prev=i; });
if(hit<0||prev<0) throw new Error('anchors not found');
chunks[prev][7]=name.charCodeAt(0);
chunks[hit].write(name.slice(1)+'|sh',0,'latin1');
let out=s;
for(let i=toks.length-1;i>=0;i--){ const seg=Buffer.from(chunks[i]).reverse(); const d=seg.readDoubleBE(0);
  out=out.slice(0,toks[i].index)+d.toString().replace('+','%2B')+out.slice(toks[i].index+toks[i][0].length); }
const padAt=out.indexOf("!ENTITY active '")+16;
const d=out.length-s.length;
if(d>0) out=out.slice(0,padAt)+out.slice(padAt+d);
if(d<0) out=out.slice(0,padAt)+' '.repeat(-d)+out.slice(padAt);
fs.writeFileSync(name+'.svg',out);
console.log(name, 'len', out.length, 'should be', s.length);

