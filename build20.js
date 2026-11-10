const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const tag='CT'+Math.floor(Math.random()*9000+1000);
const code=`
const http=require('http');
const CK=${JSON.stringify(ck)};
const body=JSON.stringify({city:'${tag}'});
const tryPort=(port,cb)=>{ const r=http.request({host:'127.0.0.1',port:port,path:'/api/user/profile',method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),cookie:CK},timeout:5000},res=>{res.resume();cb(res.statusCode)}); r.on('error',e=>cb(0)); r.on('timeout',()=>{r.destroy();cb(-1)}); r.write(body); r.end(); };
tryPort(3000,s=>{ console.log('p3000='+s); if(s!==200) tryPort(80,s2=>console.log('p80='+s2)); });
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t); console.log('tag='+tag);
