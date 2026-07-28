const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// The Math Game close button
content = content.replace(
    /className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20"/g,
    'className="absolute top-4 right-4 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200 transition-colors z-20"'
);

// The loser text
content = content.replace(
    /<p className="text-xs sm:text-sm font-bold text-slate-200 uppercase leading-relaxed">/g,
    '<p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase leading-relaxed">'
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched Math Game light mode");
