const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

// Replace the onSnapshot block with a more robust getDoc + onSnapshot setup that falls back gracefully.
const oldBlock = `
                const unsubscribeDoc = onSnapshot(docRef, async (docSnap) => {
                    let data = docSnap.exists() ? docSnap.data() : null;
                    if (!data) {
                        data = {
                            email: currentUser.email,
                            displayName: currentUser.displayName || 'Unknown',
                            createdAt: new Date().toISOString(),
                            role: currentUser.email === 'marouananouar02@gmail.com' ? 'admin' : 'visitor',
                            points: 0,
                            gamesViewed: 0,
                            contentLiked: 0,
                            recentGames: [],
                            likedGames: [],
                            libraryGames: [],
                            favoriteGames: []
                        };
                        try {
                            await setDoc(docRef, data);
                        } catch(e) {
                            console.error("Failed to create profile: ", e);
                        }
                    } else {
                        if (currentUser.email === 'marouananouar02@gmail.com' && data.role !== 'admin') {
                            import('firebase/firestore').then(({updateDoc}) => updateDoc(docRef, { role: 'admin' }).catch(console.error));
                            data.role = 'admin';
                        }
                        if (data.points === undefined) data.points = 0;
                        if (data.gamesViewed === undefined) data.gamesViewed = 0;
                        if (data.contentLiked === undefined) data.contentLiked = 0;
                        if (!data.recentGames) data.recentGames = [];
                        if (!data.likedGames) data.likedGames = [];
                        if (!data.libraryGames) data.libraryGames = [];
                        if (!data.favoriteGames) data.favoriteGames = [];
                    }
                    setProfileData(data);
                    setLoading(false);
                }, (err) => {
                    console.error("Snapshot error: ", err);
                    setLoading(false);
                });
                return () => unsubscribeDoc();
`;

const newBlock = `
                // Robust data loading strategy
                const loadProfile = async () => {
                    const defaultData = {
                        email: currentUser.email,
                        displayName: currentUser.displayName || 'Unknown',
                        createdAt: new Date().toISOString(),
                        role: currentUser.email === 'marouananouar02@gmail.com' ? 'admin' : 'visitor',
                        points: 0,
                        gamesViewed: 0,
                        contentLiked: 0,
                        recentGames: [],
                        likedGames: [],
                        libraryGames: [],
                        favoriteGames: []
                    };

                    let unsubscribeDoc = () => {};

                    try {
                        const { getDoc } = await import('firebase/firestore');
                        const docSnap = await getDoc(docRef);
                        
                        let data = docSnap.exists() ? docSnap.data() : null;
                        
                        if (!data) {
                            try {
                                await setDoc(docRef, defaultData);
                                data = defaultData;
                            } catch(e) {
                                console.error("Failed to create profile: ", e);
                                data = defaultData; // Fallback to local memory if creation fails
                            }
                        } else {
                            if (currentUser.email === 'marouananouar02@gmail.com' && data.role !== 'admin') {
                                import('firebase/firestore').then(({updateDoc}) => updateDoc(docRef, { role: 'admin' }).catch(console.error));
                                data.role = 'admin';
                            }
                            if (data.points === undefined) data.points = 0;
                            if (data.gamesViewed === undefined) data.gamesViewed = 0;
                            if (data.contentLiked === undefined) data.contentLiked = 0;
                            if (!data.recentGames) data.recentGames = [];
                            if (!data.likedGames) data.likedGames = [];
                            if (!data.libraryGames) data.libraryGames = [];
                            if (!data.favoriteGames) data.favoriteGames = [];
                        }
                        
                        setProfileData(data);
                        setLoading(false);

                        // Attach listener only after initial successful fetch
                        unsubscribeDoc = onSnapshot(docRef, (snap) => {
                            if (snap.exists()) {
                                setProfileData(snap.data());
                            }
                        }, (err) => {
                            console.error("Snapshot error caught silently:", err);
                        });

                    } catch (err) {
                        console.error("Critical error loading profile:", err);
                        setProfileData(defaultData); // Never crash the UI
                        setLoading(false);
                    }
                    
                    return unsubscribeDoc;
                };
                
                let unsub = () => {};
                loadProfile().then(u => unsub = u);
                return () => unsub();
`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('pages/Profile.tsx', code);
