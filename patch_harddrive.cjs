const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('name="HardDrive"', 'name="Database"');
fs.writeFileSync(file, content);
console.log("Patched HardDrive");
