const fs = require('fs');
let code = fs.readFileSync('pages/Settings.tsx', 'utf8');

code = code.replace(
    `            await updateDoc(docRef, {
                username,
                bio,
                banner
            });`,
    `            await updateDoc(docRef, {
                username,
                bio,
                banner,
                photoURL
            });`
);

fs.writeFileSync('pages/Settings.tsx', code);
console.log("Successfully patched photoURL in Settings.tsx");
