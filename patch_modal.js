import fs from 'fs';

let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

if (!code.includes("import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';")) {
    code = code.replace(
        "import { signInWithGoogle, signInWithDiscord } from '../src/firebase';",
        "import { signInWithGoogle, signInWithDiscord, db, auth } from '../src/firebase';\nimport { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';"
    );
}

const modalStart = "const ResourceDetailModal: React.FC<{";
const hookStart = "const { dir, t } = useLanguage();";
const effectCode = `
  useEffect(() => {
    if (isGuestMode || !auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const updateProfileView = async () => {
      try {
        const docRef = doc(db, 'SecretArea', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          let points = data.points || 0;
          let gamesViewed = data.gamesViewed || 0;
          let recentGames = data.recentGames || [];
          
          const newRecent = [item, ...recentGames.filter((g) => g.id !== item.id)].slice(0, 20);
          
          await updateDoc(docRef, {
             points: points + 5,
             gamesViewed: gamesViewed + 1,
             recentGames: newRecent
          });
        } else {
          await setDoc(docRef, {
             email: auth.currentUser.email,
             displayName: auth.currentUser.displayName,
             createdAt: new Date().toISOString(),
             role: 'visitor',
             points: 5,
             gamesViewed: 1,
             contentLiked: 0,
             recentGames: [item],
             likedGames: [],
             libraryGames: [],
             favoriteGames: []
          });
        }
      } catch (e) {
         console.error("Error updating profile view stats:", e);
      }
    };
    
    // Check if we just viewed it recently to avoid spam (in local state)
    // Actually, running it once per modal open is fine for now
    updateProfileView();
  }, [item.id, isGuestMode]);
`;

if (!code.includes("updateProfileView = async () => {")) {
    code = code.replace(
        "  const { dir, t } = useLanguage();\n  const [showTrailer, setShowTrailer] = useState(false);",
        "  const { dir, t } = useLanguage();\n" + effectCode + "\n  const [showTrailer, setShowTrailer] = useState(false);"
    );
}

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log('SecretArea.tsx patched successfully');
