const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// Fix Footer Icons contrast in light mode to be even more prominent
content = content.replace(
  /text-slate-500 dark:text-slate-400 hover:text-white hover:bg-\[\#5865F2\]/g,
  'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#5865F2]'
);
content = content.replace(
  /text-slate-500 dark:text-slate-400 hover:text-white hover:bg-\[\#229ED9\]/g,
  'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#229ED9]'
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched footer icons darker");
