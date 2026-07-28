const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
    /<span className="text-\[10px\] font-bold text-slate-300 uppercase tracking-widest">Input Answer<\/span>/g,
    '<span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Input Answer</span>'
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched Input Answer text");
