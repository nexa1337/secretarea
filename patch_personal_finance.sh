#!/bin/bash
cat pages/PersonalFinance.tsx | sed -n '1,911p' > pages/PersonalFinance.tsx.tmp
cat << 'INNER_EOF' >> pages/PersonalFinance.tsx.tmp
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-amber-500/30 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-xl dark:shadow-2xl dark:shadow-amber-900/40"
                >
                    <button onClick={() => { setShowAuthModal(false); setPendingTab(null); }} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <Icon name="X" size={24} />
                    </button>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl mx-auto flex items-center justify-center text-amber-500 mb-4 border border-amber-200 dark:border-amber-500/30 shadow-sm dark:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Icon name="Lock" size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Restricted Area</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-3 leading-relaxed">
                            Only the <strong className="text-slate-900 dark:text-white">E-Wallet</strong> is free to view.<br/>
                            To access <strong>MIND</strong> or <strong>MARKET</strong>, please enter the admin secret key.
                            <br/><span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 block">(Hint: Nexa.1337)</span>
                        </p>
                    </div>
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div className="relative">
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="SECRET KEY" 
                                className={`w-full bg-slate-50 dark:bg-slate-900/50 border ${error ? 'border-red-500 animate-shake' : 'border-slate-200 dark:border-amber-900/50'} rounded-xl px-4 py-4 text-center text-slate-900 dark:text-white font-mono tracking-[0.2em] focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors`} 
                            />
                        </div>
                        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 dark:shadow-amber-600/20">
                            Unlock Access
                        </button>
                    </form>
                </motion.div>
INNER_EOF
cat pages/PersonalFinance.tsx | sed -n '944,$p' >> pages/PersonalFinance.tsx.tmp
mv pages/PersonalFinance.tsx.tmp pages/PersonalFinance.tsx

sed -i "s/if (password === 'Nexa.1337') {/if (password.toLowerCase() === 'nexa.1337' || password.toLowerCase() === 'nexa1337' || password === '1337') {/g" pages/PersonalFinance.tsx
