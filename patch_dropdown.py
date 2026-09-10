import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

replacement = """                                 {['Playing', 'Plan to Play', 'Completed', 'On Hold', 'Dropped'].map((status) => (
                                     <button key={status} onClick={async () => {
                                         setShowFavoriteDropdown(false);
                                         if (!auth.currentUser) return;
                                         try {
                                             const { doc, getDoc, updateDoc } = await import('firebase/firestore');
                                             const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
                                             const docSnap = await getDoc(docRef);
                                             if (docSnap.exists()) {
                                                 const data = docSnap.data();
                                                 let library = data.libraryGames || [];
                                                 const existing = library.find((g: any) => g.id === item.id);
                                                 // Remove old if exists
                                                 library = library.filter((g: any) => g.id !== item.id);
                                                 
                                                 if (existing && existing.status === status) {
                                                     await updateDoc(docRef, { libraryGames: library });
                                                     alert(t('Removed from Library'));
                                                 } else {
                                                     library.push({
                                                         id: item.id,
                                                         name: item.name,
                                                         coverImage: item.coverImage,
                                                         status: status,
                                                         timestamp: new Date().toISOString()
                                                     });
                                                     await updateDoc(docRef, { libraryGames: library });
                                                     alert(t('Added to ') + t(status));
                                                 }
                                             }
                                         } catch(e) { console.error(e); }
                                     }} className="w-full text-start px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                                         {t(status)}
                                     </button>
                                 ))}"""

pattern = r"\{?\['Playing', 'Plan to Play', 'Completed', 'On Hold', 'Dropped'\]\.map\(\(status\) => \([\s\S]*?\}\s*className=\"w-full text-start px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300\">\s*\{t\(status\)\}\s*<\/button>\s*\)\)\}"
new_content = re.sub(pattern, replacement, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(new_content)
