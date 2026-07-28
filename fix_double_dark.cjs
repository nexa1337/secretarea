const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(/dark:text-slate-\d+\s+dark:text-slate-(\d+)/g, 'dark:text-slate-$1');
content = content.replace(/dark:text-\[\#[a-fA-F0-9]+\]\s+dark:text-slate-(\d+)/g, 'dark:text-slate-$1');
content = content.replace(/dark:text-slate-\d+\s+dark:text-\[\#[a-fA-F0-9]+\]/g, 'dark:text-slate-400');
content = content.replace(/text-slate-\d+\s+text-slate-(\d+)/g, 'text-slate-$1');

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Fixed double dark/text modifiers");
