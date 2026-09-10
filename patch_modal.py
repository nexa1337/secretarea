import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

replacement = """                     <div className="relative">
                         <button onClick={() => setShowFavoriteDropdown(!showFavoriteDropdown)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-all ${stash.includes(item.id) ? 'bg-primary-500 text-white border-primary-600' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                             <Icon name="Bookmark" size={16} className={stash.includes(item.id) ? 'fill-current' : ''} /> {stash.includes(item.id) ? t('Favorite') : t('Favorite')} <Icon name="ChevronDown" size={12} />
                         </button>
                         {showFavoriteDropdown && (
                             <div className="absolute top-full start-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden text-sm font-medium">
                                 <button onClick={(e) => { setShowFavoriteDropdown(false); toggleStash(item.id, e); }} className="w-full text-start px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                     <Icon name="Bookmark" size={14} className={stash.includes(item.id) ? 'fill-current' : ''} /> {stash.includes(item.id) ? t('Remove Favorite') : t('Just Favorite')}
                                 </button>
                                 <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
                                 {['Playing', 'Plan to Play', 'Completed', 'On Hold', 'Dropped'].map((status) => (
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
                                                 // Remove old if exists
                                                 library = library.filter((g: any) => g.id !== item.id);
                                                 // Add new status
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
                                         } catch(e) { console.error(e); }
                                     }} className="w-full text-start px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
                                         {t(status)}
                                     </button>
                                 ))}
                             </div>
                         )}
                     </div>"""

pattern = r'<button onClick=\{\(e\) => toggleStash\(item\.id, e\)\} className=\{`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-bold transition-all \$\{stash\.includes\(item\.id\) \? \'bg-primary-500 text-white border-primary-600\' : \'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700\'\}`\}>\s*<Icon name="Bookmark" size=\{16\} className=\{stash\.includes\(item\.id\) \? \'fill-current\' : \'\'\} /> \{stash\.includes\(item\.id\) \? t\(\'Remove from Favorites\'\) : t\(\'Add to Favorites\'\)\}\s*</button>'
new_content = re.sub(pattern, replacement, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(new_content)
