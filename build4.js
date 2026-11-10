const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const S='x=ABC; c=$(printf %s "$x" | cut -c1); echo "[$c]"; y=$(cut -c1 /etc/hostname); echo "H=$y"; w=$(od -An -tu1 -N1 /etc/hostname); echo "O=$w"';
t=t.replace(/const S=.*\n/, 'const S='+JSON.stringify(S)+';\n');
t=t.replace("if(s2.includes('P=200'))mark(5550);if(s2.includes('C=200'))mark(5551);if(s2.includes('P='))mark(5552);","if(s2.includes('[A]'))mark(5560);if(s2.includes('H='))mark(5561);if(s2.includes('O='))mark(5562);");
fs.writeFileSync('p1.js',t);console.log('ok');
