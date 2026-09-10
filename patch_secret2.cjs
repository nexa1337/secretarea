const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedResourceAction, setSelectedResourceAction] = useState<string | undefined>(undefined);`;

const inject = `  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedResourceAction, setSelectedResourceAction] = useState<string | undefined>(undefined);

  // Track user views and recent activity
  useEffect(() => {
    if (selectedResource) {
      import('../src/firebase').then(({ auth, db }) => {
        if (auth.currentUser) {
            import('firebase/firestore').then(({ doc, updateDoc, getDoc, setDoc }) => {
                const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
                getDoc(docRef).then(snap => {
                    if (snap.exists()) {
                        const recentGame = {
                            id: selectedResource.id || '',
                            name: selectedResource.name || '',
                            coverImage: selectedResource.coverImage || '',
                            timestamp: new Date().toISOString()
                        };
                        
                        let data = snap.data();
                        let recentGames = data.recentGames || [];
                        recentGames = recentGames.filter(g => g.id !== recentGame.id);
                        recentGames.unshift(recentGame);
                        if (recentGames.length > 20) recentGames.pop();

                        updateDoc(docRef, {
                            gamesViewed: (data.gamesViewed || 0) + 1,
                            points: (data.points || 0) + 5,
                            recentGames: recentGames
                        });
                    }
                }).catch(e => console.error(e));
            });
        }
      });
    }
  }, [selectedResource]);`;

if (code.includes(target)) {
    code = code.replace(target, inject);
    fs.writeFileSync('pages/SecretArea.tsx', code);
} else {
    console.log("Could not find target in SecretArea.tsx");
}
