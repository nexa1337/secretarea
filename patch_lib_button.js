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
                      }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25">`;

const replacement = `                      <button onClick={() => {
                          const el = document.getElementById('download');
                          const container = document.getElementById('modal-scroll-container');
                          if (el && container) {
                              const y = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - 80;
                              container.scrollTo({ top: y, behavior: 'smooth' });
                          } else if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                          }
                          // Add to Library and grant points
                          import('../src/firebase').then(({ auth, db }) => {
                              if (auth.currentUser) {
                                  import('firebase/firestore').then(({ doc, updateDoc, arrayUnion, increment }) => {
                                      const docRef = doc(db, 'SecretArea', auth.currentUser.uid);
                                      const libGame = {
                                          id: item.id || '',
                                          name: item.name || '',
                                          coverImage: item.coverImage || '',
                                          timestamp: new Date().toISOString()
                                      };
                                      updateDoc(docRef, {
                                          points: increment(10),
                                          libraryGames: arrayUnion(libGame)
                                      }).catch(console.error);
                                  });
                              }
                          });
                      }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/25">`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Patched Library successfully!");
} else {
    console.log("Could not find Library target block");
}
