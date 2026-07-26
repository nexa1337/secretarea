const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// The wrapper in !isUnlocked
content = content.replace(
`        <div className={\`w-full flex justify-center relative z-10 \${showMathGame ? 'min-h-full items-center p-4 py-8' : 'w-full h-full max-h-[80vh] min-h-[500px] max-w-5xl rounded-[1rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-300/50 dark:border-slate-700/50'}\`}>`,
`        <div className={\`w-full flex justify-center relative z-10 \${showMathGame ? 'min-h-full items-center p-4 py-8' : 'w-full max-w-2xl flex flex-col items-center'}\`}>`
);

// The motion div for !showMathGame
content = content.replace(
`          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className={showMathGame ? "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-w-5xl relative z-10" : "w-full h-full relative z-10 flex flex-col"}
          >`,
`          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             className={showMathGame ? "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-w-5xl relative z-10" : "w-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl flex flex-col relative"}
          >`
);

content = content.replace(
`            ) : (
                <div className="flex flex-col relative overflow-hidden h-full w-full">
                   {/* Grid Background Effect */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
                   
                   <motion.div 
                     initial={{ scale: 0.95, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                     className="bg-black/5 dark:bg-black/40 md:backdrop-blur-md shadow-2xl overflow-hidden flex flex-col flex-1 relative group w-full h-full"
                   >
                      <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>`,
`            ) : (
                <div className="flex flex-col relative overflow-hidden w-full h-full max-h-[600px] min-h-[350px]">
                      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://www.kali.org/blog/about-the-xz-backdoor/images/xz-utils.jpg')" }} />`
);

content = content.replace(
`                      <div className="h-10 bg-[#2E3440] dark:bg-[#20242D] border-b border-[#4C566A] dark:border-[#3B4252] flex items-center px-4 justify-between relative z-10 shrink-0">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                        </div>
                        <div className="flex-1 text-center text-xs font-semibold text-[#E5E9F0] dark:text-[#E5E9F0] font-sans tracking-wider">
                          Secure Cloud
                        </div>
                        <div className="w-12 flex justify-end">
                          <Icon name="X" size={14} className="text-[#D8DEE9] hover:text-[#BF616A] cursor-pointer transition-colors" />
                        </div>
                      </div>`,
`                      <div className="h-10 bg-slate-100/50 dark:bg-[#0f172a]/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 flex items-center px-4 justify-between relative z-10 shrink-0">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4 flex items-center justify-center">
                                <FaWolfPackBattalion size={14} className="text-slate-800 dark:text-white relative z-10" />
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-300 lowercase tracking-widest font-mono">guest@nexa1337:~/root</div>
                        </div>
                        <div className="w-12"></div>
                      </div>`
);


content = content.replace(
`                      </div>
                   </motion.div>
                </div>
            )}
          </div>
        </motion.div>`,
`                      </div>
                </div>
            )}
          </div>
        </motion.div>`
);

fs.writeFileSync('pages/SecretArea.tsx', content);
