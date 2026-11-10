const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const code=`
const cp=require('child_process');
const L=[6300,6302,6304,6306];
for(const n of L){ try{cp.execSync('curl -s -m 8 -o /dev/null https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b'+n)}catch(e){} }
console.log('purged '+L.join(','));
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
