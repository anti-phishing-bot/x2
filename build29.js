const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const tk=fs.readFileSync('..\\tok_ml.txt','utf8').trim();
const code=`
const https=require('https');
const body=JSON.stringify({firstName:'Nom',lastName:'Soy'});
const opt={host:'423c088f8a3791.6qsfv.com',port:443,path:'/auth/profile',method:'PUT',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),authorization:'Bearer ${tk}'},timeout:9000};
const r=https.request(opt,res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>console.log(res.statusCode+' '+d.slice(0,90)))});
r.on('error',e=>console.log('ERR '+e.message));r.on('timeout',()=>{r.destroy();console.log('TO')});r.write(body);r.end();
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
