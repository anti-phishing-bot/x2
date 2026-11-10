const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const L=JSON.stringify(Array.from({length:40},(_,i)=>6075+i));
t=t.replace(/const L=\[[^\]]*\];/, 'const L='+L+';');
t=t.replace("const v=s.charCodeAt(i)&255;","const v=s.charCodeAt(i)&255;");
t=t.replace("if(s.length<4){ s+='E' }","if(s.length<4){ s+='E' }; console.log('LEN='+s.length+' H='+require('os').hostname());");
t=t.replace("if(s2.includes('ERR')) mark(5511);","if(e2){mark(5512);}else{mark(5513); if(s2.includes('LEN='))mark(5514); if(s2.includes('H='))mark(5515);}");
fs.writeFileSync('p1.js',t);console.log('ok');
