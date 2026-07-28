const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
    /className="mt-4 text-\[9px\] md:text-xs text-slate-300 font-bold tracking-\[0.25em\] uppercase transition-colors duration-300"/g,
    'className="mt-4 text-[9px] md:text-xs text-slate-600 dark:text-slate-400 font-bold tracking-[0.25em] uppercase transition-colors duration-300"'
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched open world p tag");
