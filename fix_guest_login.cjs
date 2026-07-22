const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `      } else if (lowerCmd === '3' || lowerCmd === 'auth') {
        setTerminalMode('password');
      } else if (lowerCmd === 'clear') {`;

const replacement1 = `      } else if (lowerCmd === '3' || lowerCmd === 'auth') {
        setTerminalMode('password');
      } else if (lowerCmd === '5') {
        newHistory.push({ type: 'success', text: 'Guest Access Granted. Loading limited preview...' });
        setIsUnlocked(true);
        setIsGuestMode(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'guest');
        localStorage.setItem('nexa_guest_mode', 'true');
        fetchData();
        setFailedAttempts(0);
        setTerminalMode('normal');
      } else if (lowerCmd === 'clear') {`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    console.log("Fixed option 5");
} else {
    console.log("Could not find option 5 target");
}

const target2 = `                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.5 }}
                     className="text-center shrink-0"
                   >
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 select-none">N E X A INTERFACE</h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 select-none">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                         FORTRESS SECURITY LAYER
                      </p>
                   </motion.div>`;

const replacement2 = `                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.5 }}
                     className="text-center shrink-0 relative flex flex-col items-center justify-center"
                   >
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 select-none">N E X A INTERFACE</h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 select-none">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                         FORTRESS SECURITY LAYER
                      </p>
                      <button 
                        onClick={() => {
                            setIsUnlocked(true);
                            setIsGuestMode(true);
                            setShowHackerLoader(true);
                            setHackerProgress(0);
                            localStorage.setItem('secret_area_unlocked', 'guest');
                            localStorage.setItem('nexa_guest_mode', 'true');
                            fetchData();
                        }}
                        className="absolute right-0 top-0 bottom-0 my-auto h-8 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 bg-white/50 dark:bg-slate-900/50 md:backdrop-blur-sm"
                      >
                         <Icon name="UserCircle" size={14} />
                         Guest Mode
                      </button>
                      <button 
                        onClick={() => {
                            setIsUnlocked(true);
                            setIsGuestMode(true);
                            setShowHackerLoader(true);
                            setHackerProgress(0);
                            localStorage.setItem('secret_area_unlocked', 'guest');
                            localStorage.setItem('nexa_guest_mode', 'true');
                            fetchData();
                        }}
                        className="mt-4 h-8 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-lg transition-colors sm:hidden flex items-center justify-center gap-1.5 bg-white/50 dark:bg-slate-900/50 w-full"
                      >
                         <Icon name="UserCircle" size={14} />
                         Login as Guest
                      </button>
                   </motion.div>`;

if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
    console.log("Fixed guest mode button");
} else {
    console.log("Could not find N E X A INTERFACE target");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
