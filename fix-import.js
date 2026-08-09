const fs = require('fs');
const path = require('path');

function walk(dir){
  let files=[];
  for(const f of fs.readdirSync(dir)){
    const p=path.join(dir,f);
    if(fs.statSync(p).isDirectory()){
      if(!p.includes('node_modules')) files=files.concat(walk(p));
    } else if(p.endsWith('.js')) files.push(p);
  }
  return files;
}

walk('./src').forEach(file=>{
  let content = fs.readFileSync(file,'utf8');
  let orig = content;
  
  // Kokotoa path sahihi kutoka file kwenda src/contexts/LanguageContext
  const fileDir = path.dirname(file);
  const target = path.join(process.cwd(), 'src', 'contexts', 'LanguageContext');
  let rel = path.relative(fileDir, target).replace(/\\/g,'/');
  if(!rel.startsWith('.')) rel = './'+rel;
  
  // Badilisha imports zote mbovu
  content = content.replace(/from\s+['"]\.\.\/?\.?\/?contexts\/LanguageContext['"]/g, `from '${rel}'`);
  content = content.replace(/from\s+['"]\.\.\/contexts\/LanguageContext['"]/g, `from '${rel}'`);
  
  // Ondoa duplicate imports
  const matches = [...content.matchAll(/import.*LanguageContext.*\n/g)];
  if(matches.length > 1){
    content = content.replace(/import.*LanguageContext.*\n/g, '');
    content = `import { useLanguage } from '${rel}';\n` + content;
  }

  if(content !== orig){
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed import in: ${file} -> ${rel}`);
  }
});

console.log('Done!');