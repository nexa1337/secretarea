const fs = require('fs');
let content = fs.readFileSync('components/Footer.tsx', 'utf-8');

content = content.replace(/text-slate-600 dark:text-slate-300/g, 'text-slate-800 dark:text-slate-300');
content = content.replace(/text-slate-700 dark:text-slate-200/g, 'text-slate-900 dark:text-slate-200');
content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-slate-900 dark:text-slate-300');

fs.writeFileSync('components/Footer.tsx', content);
console.log("Patched Footer.tsx colors");
