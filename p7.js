const fs=require('fs');
let s=fs.readFileSync('p1.js','utf8');
s=s.replace("te:'trailers',containerd-namespace:'k8s.io'","te:'trailers','containerd-namespace':'k8s.io'");
fs.writeFileSync('p1.js',s);
console.log(s.includes("'containerd-namespace'"));
