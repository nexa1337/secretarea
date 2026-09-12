const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const missingEmailFix = `
                            if (!data.email && currentUser.email) {
                                import('firebase/firestore').then(({updateDoc}) => updateDoc(docRef, { email: currentUser.email }).catch(console.error));
                                data.email = currentUser.email;
                            }
`;

code = code.replace(
    "if (currentUser.email === 'marouananouar02@gmail.com' && data.role !== 'admin') {",
    missingEmailFix + "                            if (currentUser.email === 'marouananouar02@gmail.com' && data.role !== 'admin') {"
);

fs.writeFileSync('pages/Profile.tsx', code);
