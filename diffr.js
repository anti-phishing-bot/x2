const fs=require('fs');
const a=fs.readFileSync('zz9.svg'), b=fs.readFileSync('aad.svg');
console.log('lens',a.length,b.length);
let diffs=0, first=[];
for(let i=0;i<Math.min(a.length,b.length);i++){ if(a[i]!==b[i]){ diffs++; if(first.length<12) first.push([i,String.fromCharCode(a[i]),String.fromCharCode(b[i])]); } }
console.log('diffbytes',diffs, JSON.stringify(first));
const padA=a.indexOf("<!ENTITY active '")+16;
let spA=0; while(a[padA+spA]===0x20) spA++;
let spB=0; while(b[padA+spB]===0x20) spB++;
console.log('pad spaces a,b',spA,spB);
