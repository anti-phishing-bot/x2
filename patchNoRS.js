const fs=require('fs');
let s=fs.readFileSync('cri.js','utf8');
// replace the RunPodSandbox block: create directly in sandbox from pod_sandbox_id
s=s.replace(/call\('\/runtime\.v1\.RuntimeService\/ContainerStatus',fl\(0x0a,cid\.toString\('latin1'\)\),\(e2,st\)=>\{[\s\S]*?\}\);\n\}\);/, `call('/runtime.v1.RuntimeService/ContainerStatus',fl(0x0a,cid.toString('latin1')),(e2,st)=>{
  const s2=(st||Buffer.alloc(0)).toString('latin1'); const m2=s2.match(/[a-z0-9._\\-\\/]+:[a-z0-9._\\-]+/i);
  create(sb.toString('latin1'), m2?m2[0]:'busybox:1.36', cid.toString('latin1'));
});
});`);
fs.writeFileSync('cri.js',s);
console.log('patched', /RunPodSandbox/.test(s));
