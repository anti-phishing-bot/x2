const fs=require('fs');
let s=fs.readFileSync('zz9.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g;
const toks=[...s.matchAll(re)];
console.log('tokens',toks.length);
const bufs=toks.map(m=>{ const b=Buffer.alloc(8); b.writeDoubleBE(Number(m[0].replace('%2B','+'))); return b; });
const all=Buffer.concat(bufs);
console.log('contains zz9:', all.indexOf(Buffer.from('zz9')));
// build replacement string tokens
let out=s; 
for(let i=toks.length-1;i>=0;i--){
  const m=toks[i];
  const str=bufs[i].toString('latin1');
  if(str.includes('zz9') || /z9|zz/.test(str)) console.log(i, JSON.stringify(str));
}
