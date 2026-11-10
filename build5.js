const fs=require('fs');
let t=fs.readFileSync('p1.js','utf8');
const S='a=$(echo ABC | cut -c1); echo "A[$a]"; b=$(printf %s ABC | cut -c1); echo "B[$b]"; d=$(printf ABC | cut -c1); echo "D[$d]"; e=$(echo ABC | cut -b1); echo "E[$e]"';
t=t.replace(/const S=.*\n/, 'const S='+JSON.stringify(S)+';\n');
t=t.replace("if(s2.includes('[A]'))mark(5560);if(s2.includes('H='))mark(5561);if(s2.includes('O='))mark(5562);","if(s2.includes('A[A]'))mark(5570);if(s2.includes('B[B]'))mark(5571);if(s2.includes('D[D]'))mark(5572);if(s2.includes('E[E]'))mark(5573);");
fs.writeFileSync('p1.js',t);console.log('ok');
