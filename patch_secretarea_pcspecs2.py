import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

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

content = re.sub(r"(const \[showGlobalFilter, setShowGlobalFilter\] = useState\(false\);)", r"\1" + "\n" + effect_addition, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
