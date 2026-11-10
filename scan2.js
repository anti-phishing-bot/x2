const fs=require('fs');
const s=fs.readFileSync('zz9.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g;
let m; const toks=[];
while((m=re.exec(s))){ toks.push({tok:m[0], idx:m.index}); }
const strs = toks.map(t=>{ const b=Buffer.alloc(8); b.writeDoubleBE(Number(t.tok.replace('%2B','+'))); return b.toString('latin1'); });
const full = strs.join('');
const rev = Buffer.from(full,'latin1').reverse().toString('latin1');
console.log('TOKENS', toks.length);
console.log('FULL:', JSON.stringify(rev));
