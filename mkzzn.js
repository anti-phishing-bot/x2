const fs=require('fs');
const s=fs.readFileSync('zz9.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g;
const toks=[...s.matchAll(re)];
const all=Buffer.concat(toks.map(m=>{const b=Buffer.alloc(8);b.writeDoubleBE(Number(m[0].replace('%2B','+')));return b;}));
const cmd=Buffer.from(all).reverse().toString('latin1');
const at=cmd.indexOf('/zz9');
console.log('found at',at, JSON.stringify(cmd.slice(Math.max(0,at-60), at+12)));
const cmd2=cmd.slice(0,at)+'/zzn'+cmd.slice(at+4);
if(cmd2.length!==cmd.length) throw new Error('len');
const enc=Buffer.from(Buffer.from(cmd2,'latin1').reverse());
let out=s;
for(let i=toks.length-1;i>=0;i--){
  const d=enc.readDoubleBE(i*8);
  out=out.slice(0,toks[i].index)+d.toString().replace('+','%2B')+out.slice(toks[i].index+toks[i][0].length);
}
fs.writeFileSync('zzn.svg',out);
console.log('written', out.length, s.length);
