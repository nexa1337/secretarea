const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(/item\.links\./g, 'item.links?.');
code = code.replace(/game\.links\./g, 'game.links?.');

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Patched item.links. to item.links?.");
