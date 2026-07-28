const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// Fix Top Bar Icons contrast in light mode to be even more prominent
content = content.replace(
  /bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300/g,
  'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched icons darker");
