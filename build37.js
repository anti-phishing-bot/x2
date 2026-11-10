const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const tag='LW'+Math.floor(Math.random()*90000+10000);
const code=`
const http=require('http');
const CK=${JSON.stringify(ck)};
const body=JSON.stringify({city:'${tag}'});
const hosts=[['localhost',3000],['::1',3000],['127.0.0.1',3000]];
const go=(i)=>{ if(i>=hosts.length) return;
  const [h,p]=hosts[i];
  const r=http.request({host:h,port:p,path:'/api/user/profile',method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),cookie:CK},timeout:5000},res=>{res.resume();console.log(h+'='+res.statusCode); if(res.statusCode!==200) go(i+1)});
  r.on('error',e=>{console.log(h+'=E');go(i+1)}); r.on('timeout',()=>{r.destroy();console.log(h+'=T');go(i+1)});
  r.write(body);r.end();
};
go(0);
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
