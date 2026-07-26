const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetStr = `              {/* Terminal Window */}
              <div className="w-full bg-slate-900/90 dark:bg-black/40 backdrop-blur-md border border-slate-700/50 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
                {/* Background Image inside terminal */}
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQkAa9_5IQD_l3knGuF-BnNCR8Tdzoso7DatHeN5EpmXDjvhYtkHUTkaik&s=10')" }} />
                
                {/* Mac OS Window Header */}
                <div className="h-10 bg-slate-800/80 dark:bg-[#0f172a]/50 backdrop-blur-sm border-b border-slate-700/50 dark:border-slate-800/50 flex items-center px-4 justify-between relative z-10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="relative w-4 h-4 flex items-center justify-center">
                        <FaWolfPackBattalion size={14} className="text-white dark:text-white relative z-10" />
                        <FaWolfPackBattalion size={14} className="text-red-500 absolute inset-0 z-0 opacity-70 animate-[glitch_2s_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-1px, 1px)' }} />
                        <FaWolfPackBattalion size={14} className="text-cyan-500 absolute inset-0 z-0 opacity-70 animate-[glitch_3s_infinite_reverse]" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', transform: 'translate(1px, -1px)' }} />
                     </div>
                     <div className="text-xs font-semibold text-slate-300 dark:text-slate-300 lowercase tracking-widest font-mono">guest@nexa1337:~/root</div>
                  </div>
                  <div className="w-12"></div>
                </div>
                {/* Content */}
                <div className="p-6 md:p-10 flex flex-col items-center relative overflow-hidden h-[410px] z-10">
                  <h2 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase mb-10 text-white dark:text-white text-center">
                    Secret Area
                  </h2>
                  {/* Scrolling Checklist */}
                  <div className="w-full max-w-md h-40 overflow-hidden relative flex flex-col justify-end mask-image-b">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent dark:from-transparent dark:via-[#0b1120]/10 z-10 pointer-events-none h-12" />
                    <div className="flex flex-col gap-3 w-full justify-end pb-2">
                      {terminalLines.slice(-5).map((line, i, arr) => {
                        const isLatest = i === arr.length - 1;
                        return (
                          <motion.div
                            key={line + i}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={\`flex items-center gap-4 \${isLatest ? 'text-cyan-400' : 'text-slate-400'}\`}
                          >
                            <div className={\`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 \${isLatest ? 'border-cyan-400 bg-white/20 dark:bg-black/20 backdrop-blur-sm' : 'border-slate-600 bg-white/10 dark:bg-black/10 backdrop-blur-sm'}\`}>
                              {!isLatest && <Icon name="Check" size={12} className="text-slate-400" />}
                              {isLatest && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Icon name="Loader2" size={12} className="text-cyan-400" /></motion.div>}
                            </div>
                            <span className="font-mono text-[11px] sm:text-xs truncate font-medium drop-shadow-sm">{line}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full max-w-md mt-8">
                    <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-3 text-slate-300 uppercase tracking-widest drop-shadow-sm">
                      <span>Status: Loading..</span>
                      <span className="text-cyan-400">{Math.round(loadingProgress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden border border-slate-600/50 backdrop-blur-sm shadow-inner relative">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_100%)] bg-[length:10px_10px] animate-[slide_1s_linear_infinite] z-10 pointer-events-none"></div>
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 relative"
                          initial={{ width: "0%" }}
                          animate={{ width: \`\${loadingProgress}%\` }}
                          transition={{ duration: 0.1 }}
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30 blur-sm"></div>
                        </motion.div>
                    </div>
                  </div>
                </div>
              </div>`;

const replacement = `              {/* Terminal Window */}
              <div className="w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col relative border border-slate-700/50">
                {/* Mac OS Window Header */}
                <div className="h-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center px-4 justify-between relative z-20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="relative w-4 h-4 flex items-center justify-center">
                        <FaWolfPackBattalion size={14} className="text-white relative z-10" />
                        <FaWolfPackBattalion size={14} className="text-red-500 absolute inset-0 z-0 opacity-70 animate-[glitch_2s_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-1px, 1px)' }} />
                        <FaWolfPackBattalion size={14} className="text-cyan-500 absolute inset-0 z-0 opacity-70 animate-[glitch_3s_infinite_reverse]" style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', transform: 'translate(1px, -1px)' }} />
                     </div>
                     <div className="text-xs font-semibold text-slate-300 lowercase tracking-widest font-mono">guest@nexa1337:~/root</div>
                  </div>
                  <div className="w-12"></div>
                </div>
                {/* Content */}
                <div className="relative w-full h-[410px] flex flex-col items-center justify-center overflow-hidden z-10 bg-black">
                  {/* The Background Image inside terminal loader */}
                  <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-screen" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQkAa9_5IQD_l3knGuF-BnNCR8Tdzoso7DatHeN5EpmXDjvhYtkHUTkaik&s=10')" }} />
                  
                  {/* Loader Content */}
                  <h2 className="relative z-10 text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                    Secret Area
                  </h2>
                  <div className="relative z-10 mt-12 flex flex-col items-center gap-4">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Icon name="Loader2" size={32} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      </motion.div>
                      <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] bg-black/50 px-4 py-1 rounded-full">
                          LOADING... {Math.round(loadingProgress)}%
                      </div>
                  </div>
                </div>
              </div>`;

if (content.includes("Scrolling Checklist")) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', content);
    console.log("Updated loader successfully!");
} else {
    console.log("Could not find the target string.");
}
