const fs=require('fs');
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
function grpc(body){const h=Buffer.alloc(5);h.writeUInt32BE(body.length,1);return Buffer.concat([h,body])}
fs.writeFileSync('lc.bin', grpc(Buffer.from([0x0a,0x00])));
console.log('lc', fs.statSync('lc.bin').size);
