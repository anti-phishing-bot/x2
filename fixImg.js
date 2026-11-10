const fs=require('fs');let s=fs.readFileSync('cri.js','utf8');
s=s.replace("image:'IMG'","image:'busybox:1.36'");
fs.writeFileSync('cri.js',s);console.log('img patched');
