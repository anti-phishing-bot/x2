const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const S='P=$(curl -s -m 8 -o /dev/null -w "%{http_code}" https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b5900); echo "P=$P"; Q=$(curl -s -m 8 -o /dev/null -w "%{http_code}" https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b5901); echo "Q=$Q"';
t=t.replace(/const S=.*\n/, 'const S='+JSON.stringify(S)+';\n');
t=t.replace(/const s2=out\?out\.toString\('latin1'\):'';.*?setTimeout\(next,300\)/s, "const s2=out?out.toString('latin1'):'';if(s2.includes('P=200'))mark(5580);if(s2.includes('Q=200'))mark(5581);if(s2.includes('P='))mark(5582);setTimeout(next,300)");
fs.writeFileSync('p1.js',t);console.log('built');
