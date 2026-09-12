const fs = require('fs');
let code = fs.readFileSync('pages/CategoryDetail.tsx', 'utf8');

const importStatement = `import { auth, db } from '../src/firebase';\nimport { doc, getDoc, updateDoc } from 'firebase/firestore';\n`;

// Only add if not present
if (!code.includes("from '../src/firebase'")) {
    code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + importStatement);
}

const trackingLogic = `
  const trackProjectInteraction = async (project: any, interactionType: 'view' | 'like' | 'favorite' | 'download' = 'view') => {
    if (!auth.currentUser) return;
    const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
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
                let newView = false;
                if (existingIndex !== -1) {
                    recentGames.splice(existingIndex, 1);
                } else {
                    newView = true;
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

            await updateDoc(docRef, { 
                recentGames, likedGames, favoriteGames, libraryGames, 
                points, gamesViewed, contentLiked 
            });
        }
    } catch (err) {
        console.error("Error tracking view", err);
    }
  };
`;

code = code.replace(
    "const CategoryDetail: React.FC = () => {",
    "const CategoryDetail: React.FC = () => {\n" + trackingLogic
);

// Inject tracking into NexaProject click
code = code.replace(
    "onClick={() => setActiveNexaProject(project)}",
    "onClick={() => { setActiveNexaProject(project); trackProjectInteraction(project, 'view'); }}"
);

// Inject tracking into openLightbox
code = code.replace(
    "const openLightbox = (project: Project, index: number = 0) => {",
    "const openLightbox = (project: Project, index: number = 0) => {\n    trackProjectInteraction(project, 'view');"
);

// Add Like/Favorite buttons to Lightbox
const newLightboxToolbar = `
                <div className="absolute top-4 start-4 flex items-center gap-4 z-50">
                    <button 
                      onClick={(e) => { e.stopPropagation(); trackProjectInteraction(activeProject, 'like'); }}
                      className="text-white hover:text-rose-500 hover:scale-110 transition-all bg-black/50 p-3 rounded-full backdrop-blur-md"
                      title="Like"
                    >
                      <Icon name="Heart" size={24} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); trackProjectInteraction(activeProject, 'favorite'); }}
                      className="text-white hover:text-yellow-500 hover:scale-110 transition-all bg-black/50 p-3 rounded-full backdrop-blur-md"
                      title="Favorite"
                    >
                      <Icon name="Star" size={24} />
                    </button>
                </div>
                <button 
                  onClick={closeLightbox}
`;
code = code.replace(
    "                <button \n                  onClick={closeLightbox}",
    newLightboxToolbar
);

fs.writeFileSync('pages/CategoryDetail.tsx', code);
