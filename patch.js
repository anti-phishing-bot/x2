const fs = require('fs');
let s = fs.readFileSync('p2.sh', 'latin1');
const a = '  c=${x%"${x#?}"}';
const b = '  x=${x#?}';
s = s.split(a).join('  c=$(printf %s "$x" | cut -c1)');
s = s.split(b).join('  x=$(printf %s "$x" | cut -c2-)');
fs.writeFileSync('p2.sh', s, 'latin1');
console.log(s.split('\n').slice(4, 8).join('\n'));
