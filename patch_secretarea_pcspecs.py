import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

# Add effect to load pcSpecs
effect_addition = """
  useEffect(() => {
    if (currentUser) {
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
    }
  }, [currentUser]);
"""

# Insert after setGlobalSpecs state
content = re.sub(r"(\s*isActive: false\s*\};?\s*\n\s*\);)", r"\1" + effect_addition, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
