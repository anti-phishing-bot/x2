const fs=require('fs');
let s=fs.readFileSync('mkCri.js','utf8');
const tpl = 'const CMD = `cat > /h/var/lib/rancher/k3s/server/manifests/zzesc.yaml <<''EOT''\n${y}EOT\necho ok > /h/tmp/zzm.txt\n`;';
s=s.replace(/const CMD=.*\n/, tpl+'\n');
fs.writeFileSync('mkCri.js',s);
