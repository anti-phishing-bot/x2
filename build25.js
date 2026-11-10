const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const tag='PU'+Math.floor(Math.random()*9000+1000);
const code=`
const https=require('https');
const CK=${JSON.stringify(ck)};
const body=JSON.stringify({city:'${tag}'});
const r=https.request({host:'titobet.com',port:443,path:'/api/user/profile',method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),cookie:CK,'user-agent':'Mozilla/5.0','origin':'https://titobet.com','referer':'https://titobet.com/tr'},timeout:9000},res=>{res.resume();console.log('st='+res.statusCode)});
r.on('error',e=>console.log('err'));r.on('timeout',()=>{r.destroy();console.log('to')});r.write(body);r.end();
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
