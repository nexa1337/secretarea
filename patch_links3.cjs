const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(/preInstalled\./g, 'preInstalled?.');

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Patched preInstalled. to preInstalled?.");
