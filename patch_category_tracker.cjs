const fs = require('fs');
let code = fs.readFileSync('pages/CategoryDetail.tsx', 'utf8');

const newTracking = `  const trackProjectInteraction = async (project: any, interactionType: 'view' | 'like' | 'favorite' | 'download' = 'view') => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
    try {
        const { setDoc } = await import('firebase/firestore');
        const docSnap = await getDoc(docRef);
        
        let data = docSnap.exists() ? docSnap.data() : {
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName || 'Unknown',
            createdAt: new Date().toISOString(),
            role: auth.currentUser.email === 'marouananouar02@gmail.com' ? 'admin' : 'visitor',
            points: 0,
            gamesViewed: 0,
            contentLiked: 0,
            recentGames: [],
            likedGames: [],
            favoriteGames: [],
            libraryGames: []
        };
        
        let recentGames = data.recentGames || [];
        let likedGames = data.likedGames || [];
        let favoriteGames = data.favoriteGames || [];
        let libraryGames = data.libraryGames || [];
        let points = data.points || 0;
        let gamesViewed = data.gamesViewed || 0;
        let contentLiked = data.contentLiked || 0;
        
        const pId = project.id || project.title || project.name;
        const pName = project.title || project.name;
        const pImg = project.image || project.images?.[0] || '';
        const pCategory = project.category || 'Game';
        
        if (interactionType === 'view') {
            const existingIndex = recentGames.findIndex((g: any) => g.id === pId);
            if (existingIndex !== -1) {
                recentGames.splice(existingIndex, 1);
            } else {
                gamesViewed += 1;
                points += 5; // +5 for viewing
            }
            recentGames.unshift({ id: pId, name: pName, image: pImg, timestamp: new Date().toISOString() });
            if (recentGames.length > 50) recentGames = recentGames.slice(0, 50);
        }
        else if (interactionType === 'like') {
            const existingIndex = likedGames.findIndex((g: any) => g.id === pId);
            if (existingIndex === -1) {
                likedGames.unshift({ id: pId, name: pName, image: pImg, timestamp: new Date().toISOString() });
                contentLiked += 1;
                points += 5; // +5 for like
            } else {
                likedGames.splice(existingIndex, 1);
                contentLiked = Math.max(0, contentLiked - 1);
                points = Math.max(0, points - 5);
            }
        }
        else if (interactionType === 'favorite') {
            const existingIndex = favoriteGames.findIndex((g: any) => g.id === pId);
            if (existingIndex === -1) {
                favoriteGames.unshift({ id: pId, name: pName, image: pImg, timestamp: new Date().toISOString() });
                points += 2; // +2 for favorite
            } else {
                favoriteGames.splice(existingIndex, 1);
                points = Math.max(0, points - 2);
            }
        }

        await setDoc(docRef, { 
            ...data,
            email: data.email || auth.currentUser.email,
            recentGames, likedGames, favoriteGames, libraryGames, 
            points, gamesViewed, contentLiked 
        }, { merge: true });
        
    } catch (err) {
        console.error("Error tracking view", err);
    }
  };`;

code = code.replace(/const trackProjectInteraction = async \([\s\S]*?catch \(err\) \{\n        console.error\("Error tracking view", err\);\n    \}\n  \};/, newTracking);

fs.writeFileSync('pages/CategoryDetail.tsx', code);
