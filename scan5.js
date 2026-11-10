const fs=require('fs');
const s=fs.readFileSync('zz9.svg','utf8');
const re=/[0-9]\.[0-9]+e(?:%2B|-)[0-9]+/g; const toks=[...s.matchAll(re)];
const chunks=toks.map(m=>{const b=Buffer.alloc(8);b.writeDoubleBE(Number(m[0].replace('%2B','+')));return Buffer.from(b).reverse();});
const cmd=Buffer.concat(chunks).toString('latin1');
const i=cmd.indexOf('main');
console.log(JSON.stringify(cmd.slice(i-30,i+40)));
