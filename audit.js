const fs=require('fs'),path=require('path');
function walk(d){let r=[];for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory()){if(!p.includes('node_modules'))r=r.concat(walk(p))}else if(p.endsWith('.js')||p.endsWith('.tsx')||p.endsWith('.jsx'))r.push(p)}return r}
const files=walk('./src');
let hardcoded=[]; let defined=[];
try{ const sw=fs.readFileSync('./src/i18n/sw.js','utf8'); for(const x of sw.matchAll(/(\w+)\s*:/g)) defined.push(x[1]); }catch(e){}
let used=new Set();
for(const file of files){
  const c=fs.readFileSync(file,'utf8');
  for(const m of c.matchAll(/t\(['"]([^'"]+)['"]\)/g)) used.add(m[1]);
  for(const m of c.matchAll(/<Text[^>]*>([^<>{}]{4,})<\/Text>/g)){
    const txt=m[1].trim();
    if(txt && txt.length>3 && /[a-zA-Z]/.test(txt)) hardcoded.push(txt);
  }
}
console.log('--- KEYS ZILIZOPO ---'); console.log(defined.join(', '));
console.log('\n--- KEYS UNAZOTUMIA t() ---'); console.log([...used].join(', '));
console.log('\n--- HARDCODED (ndio maana app nzima haibadiliki) ---');
[...new Set(hardcoded)].slice(0,200).forEach(t=>console.log(t));
console.log('\nJumla hardcoded: '+[...new Set(hardcoded)].length);
const missing=[...used].filter(k=>!defined.includes(k));
console.log('\n--- MISSING KEYS ---'); console.log(missing.join(', '));