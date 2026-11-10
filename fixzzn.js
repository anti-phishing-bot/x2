const fs=require('fs');
let out=fs.readFileSync('zzn.svg','utf8');
const target=25410;
const padAt=out.indexOf("<!ENTITY active '")+16;
const dlt=out.length-target;
if(dlt<0){ out=out.slice(0,padAt)+' '.repeat(-dlt)+out.slice(padAt); }
else if(dlt>0){ let i=padAt; while(out[i]===' '&&dlt>0){out=out.slice(0,i)+out.slice(i+1);} }
fs.writeFileSync('zzn.svg',out);
console.log('newlen',out.length,'delta',dlt);
