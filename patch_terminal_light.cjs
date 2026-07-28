const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// The terminal header text
content = content.replace(
    /text-slate-900 dark:text-slate-300 lowercase/g,
    'text-slate-300 lowercase'
);

// The terminal line text
content = content.replace(
    /text-slate-800 dark:text-slate-300/g,
    'text-slate-300'
);

// The progress bar status text
content = content.replace(
    /text-slate-900 dark:text-slate-200 uppercase/g,
    'text-slate-200 uppercase'
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched terminal light mode text");
