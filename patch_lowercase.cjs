const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'popularRepackIds.includes(String(item.id))', 
  'popularRepackIds.map(id => String(id).toLowerCase()).includes(String(item.id).toLowerCase())'
);

fs.writeFileSync(file, content);
console.log('patched');
