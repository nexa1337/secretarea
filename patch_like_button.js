import fs from 'fs';

let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `                      <button onClick={() => {
                          const el = document.getElementById('download');
                          const container = document.getElementById('modal-scroll-container');
                          if (el && container) {
                              const y = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 80;
                              container.scrollTo({ top: y, behavior: 'smooth' });
                          } else if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                          }
                      }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25">
                          {t('Download')} <Icon name="Download" size={20} className="rtl:rotate-180" />
                      </button>`;

const replacement = `                      <button onClick={() => {
                          const el = document.getElementById('download');
                          const container = document.getElementById('modal-scroll-container');
                          if (el && container) {
                              const y = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 80;
                              container.scrollTo({ top: y, behavior: 'smooth' });
                          } else if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                          }
                      }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25">
                          {t('Download')} <Icon name="Download" size={20} className="rtl:rotate-180" />
                      </button>

                      <button onClick={(e) => {
                          e.currentTarget.classList.add('text-rose-500', 'border-rose-500/30', 'bg-rose-500/10');
                          import('../src/firebase').then(({ auth, db }) => {
                              if (auth.currentUser) {
                                  import('firebase/firestore').then(({ doc, updateDoc, arrayUnion, increment }) => {
                                      const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
                                      const likedGame = {
                                          id: item.id || '',
                                          name: item.name || '',
                                          coverImage: item.coverImage || '',
                                          timestamp: new Date().toISOString()
                                      };
                                      updateDoc(docRef, {
                                          contentLiked: increment(1),
                                          points: increment(5),
                                          likedGames: arrayUnion(likedGame)
                                      }).catch(console.error);
                                  });
                              }
                          });
                      }} className="w-14 h-14 sm:w-auto sm:px-6 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl border border-transparent transition-all" title="Like">
                          <Icon name="Heart" size={20} />
                      </button>

                      <button onClick={(e) => {
                          e.currentTarget.classList.add('text-yellow-500', 'border-yellow-500/30', 'bg-yellow-500/10');
                          import('../src/firebase').then(({ auth, db }) => {
                              if (auth.currentUser) {
                                  import('firebase/firestore').then(({ doc, updateDoc, arrayUnion, increment }) => {
                                      const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
                                      const favGame = {
                                          id: item.id || '',
                                          name: item.name || '',
                                          coverImage: item.coverImage || '',
                                          timestamp: new Date().toISOString()
                                      };
                                      updateDoc(docRef, {
                                          points: increment(2),
                                          favoriteGames: arrayUnion(favGame)
                                      }).catch(console.error);
                                  });
                              }
                          });
                      }} className="w-14 h-14 sm:w-auto sm:px-6 shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl border border-transparent transition-all" title="Add to Favorites">
                          <Icon name="Bookmark" size={20} />
                      </button>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Patched successfully!");
} else {
    console.log("Could not find target block");
}
