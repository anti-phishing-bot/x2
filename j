const cp=require("child_process");
for(const n of ["c0","c1","d1"]) cp.execSync("wget -q https://purge.jsdelivr.net/gh/anti-phishing-bot/x2@main/"+n);
