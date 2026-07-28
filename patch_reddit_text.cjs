const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetReddit = `                <span className="relative z-10 flex items-center gap-2">
                   Reddit
               </span>`;
const replacementReddit = `                <span className="relative z-10 flex items-center gap-2">
                   Join Community
               </span>`;

content = content.replace(targetReddit, replacementReddit);
fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched Reddit text");
