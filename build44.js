const fs=require('fs');
const S='for n in 6401 6403 6405 6407; do curl -s -m 8 -o /dev/null https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b$n; done';
let t=fs.readFileSync('p1.js','utf8');
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(S)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
