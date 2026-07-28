const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// text-slate-700 dark:text-slate-300 -> text-slate-900 dark:text-slate-200
content = content.replace(/text-slate-700 dark:text-slate-300/g, 'text-slate-900 dark:text-slate-200');

// text-slate-700 dark:text-slate-400 -> text-slate-900 dark:text-slate-300
content = content.replace(/text-slate-700 dark:text-slate-400/g, 'text-slate-900 dark:text-slate-300');

// text-slate-600 dark:text-slate-300 -> text-slate-900 dark:text-slate-200
content = content.replace(/text-slate-600 dark:text-slate-300/g, 'text-slate-900 dark:text-slate-200');

// text-slate-600 dark:text-slate-400 -> text-slate-800 dark:text-slate-300
content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-slate-800 dark:text-slate-300');

// Any remaining text-slate-400 dark:text-slate-X that needs to be darker in light mode
content = content.replace(/text-slate-400 dark:text-slate-600/g, 'text-slate-700 dark:text-slate-400');
content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-slate-800 dark:text-slate-300');

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched text to be more black in light mode");
