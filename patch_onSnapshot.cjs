const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `    if (currentUser) {
        import('../src/firebase').then(({ db }) => {
            import('firebase/firestore').then(({ doc, getDoc }) => {
                const docRef = doc(db, 'SecretArea', currentUser.uid);
                getDoc(docRef).then(snap => {
                    if (snap.exists() && snap.data().pcSpecs) {
                        const specs = snap.data().pcSpecs;
                        setGlobalSpecs(prev => ({
                            ...prev,
                            ...specs
                        }));
                    }
                });
            });
        });
    }`;

const replacement = `    if (currentUser) {
        let unsubscribe;
        import('../src/firebase').then(({ db }) => {
            import('firebase/firestore').then(({ doc, onSnapshot }) => {
                const docRef = doc(db, 'SecretArea', currentUser.uid);
                unsubscribe = onSnapshot(docRef, snap => {
                    if (snap.exists() && snap.data().pcSpecs) {
                        const specs = snap.data().pcSpecs;
                        setGlobalSpecs(prev => ({
                            ...prev,
                            ...specs
                        }));
                    }
                });
            });
        });
        return () => { if (unsubscribe) unsubscribe(); };
    }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Replaced successfully.");
} else {
    console.log("Target not found.");
}
