const fs=require('fs');
let s=fs.readFileSync('mkCri.js','utf8');
const newLine = 'const CMD="cat > /h/var/lib/rancher/k3s/server/manifests/zzesc.yaml <<\'EOT\'\\n"+y+"EOT\\necho ok > /h/tmp/zzm.txt\\n";';
s=s.replace(/const CMD=.*\n/, newLine+'\n');
fs.writeFileSync('mkCri.js',s);
console.log('patched');
