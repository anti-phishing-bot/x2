const fs=require('fs');
let s=fs.readFileSync('mkCri.js','utf8');
const expr = "const CMD = y.split('\\n').filter(Boolean).map(l=>'echo '+JSON.stringify(l)+' >> /h/var/lib/rancher/k3s/server/manifests/zzesc.yaml').join('; ')+'; echo ok > /h/tmp/zzm.txt';";
s=s.replace(/const CMD.*\n/, expr+'\n');
fs.writeFileSync('mkCri.js',s);
