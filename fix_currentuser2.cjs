const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// Undo bad replacement
content = content.replace(/auth\.auth\.currentUser/g, "auth.currentUser");
content = content.replace(/auth\.currentUser\.uid/g, "auth.currentUser?.uid");

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Fixed auth.auth");
