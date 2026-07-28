const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(/text-white dark:text-white rounded-full transition-colors flex items-center justify-center shrink-0 border border-slate-300 dark:border-transparent/g, 'text-slate-800 dark:text-white rounded-full transition-colors flex items-center justify-center shrink-0 border border-slate-300 dark:border-transparent');

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched open world pagination arrows");
