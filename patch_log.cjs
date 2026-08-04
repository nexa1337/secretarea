const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('setPopularRepackIds(Array.from(new Set(ids)));', 'setPopularRepackIds(Array.from(new Set(ids))); console.log("popularRepackIds:", ids);');
fs.writeFileSync(file, content);
