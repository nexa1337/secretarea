const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// Replace 'currentUser' with 'auth.currentUser' inside the popup button
content = content.replace(/item\.repackBy === 'Fitgirl' && currentUser/g, "item.repackBy === 'Fitgirl' && auth.currentUser");
content = content.replace(/currentUser\.photoURL/g, "auth.currentUser.photoURL");
content = content.replace(/currentUser\.displayName/g, "auth.currentUser.displayName");

// UploaderProfilePopup takes 'user' prop, so inside it, it's 'user.photoURL', but if I replaced all currentUser, I might have messed something up. 
// Let's just fix it carefully
fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Replaced currentUser");
