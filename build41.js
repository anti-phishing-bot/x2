const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const tk=fs.readFileSync('..\\tok_tt.txt','utf8').trim();
const tag='LB'+Math.floor(Math.random()*90000+10000);
const code=`
const https=require('https');
const body=JSON.stringify({city:'${tag}'});
const r=https.request({host:'lidyabet1230.com',port:443,path:'/api/user/profile',method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),authorization:'Bearer ${tk}','user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'},timeout:9000},res=>{res.resume();console.log(res.statusCode)});
r.on('error',e=>console.log('E'));r.on('timeout',()=>{r.destroy();console.log('T')});r.write(body);r.end();
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
