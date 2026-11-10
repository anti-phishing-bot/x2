const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
const c="const CMD=\"mkdir -p /h/etc 2>/dev/null; echo A > /h/etc/zzA 2>/dev/null; echo B > /etc/zzB 2>/dev/null\";";
s=s.replace(/const CMD=.*\n/, c+'\n');
fs.writeFileSync('cri2.js',s);
