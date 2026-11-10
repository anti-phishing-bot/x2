const fs=require('fs');
const s = "[ -s /tmp/w.txt ] && sleep 8 || sleep 1\nprintf '%s' 'PERSIST7' > /tmp/w.txt\n";
fs.writeFileSync('zz9', s, 'latin1');
console.log(JSON.stringify(fs.readFileSync('zz9','utf8')));
