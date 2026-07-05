#!/bin/bash
cat pages/SecretArea.tsx | sed -n '1,4839p' > pages/SecretArea.tsx.tmp
cat << 'INNER_EOF' >> pages/SecretArea.tsx.tmp
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-[75%]">
            <button 
                onClick={() => setShowSteamModal(true)}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="BrandSteam" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Free Accounts
                    {steamAccounts.length > 0 && (
                        <span className="flex items-center justify-center bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-md border border-red-400">
                            {steamAccounts.length}
                        </span>
                    )}
                </span>
            </button>
            <button 
                onClick={() => setShowMasterGiftModal(true)}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="Gift" size={18} className="text-yellow-300 group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Master Gift
                    {masterGifts.length > 0 && (
                        <span className="flex items-center justify-center bg-yellow-400 text-yellow-900 text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-md border border-yellow-300">
                            {masterGifts.length}
                        </span>
                    )}
                </span>
            </button>
            <a href={DISCORD_LINK} target="_blank" rel="noreferrer" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Discord" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
               <span className="relative z-10">Join Community</span>
            </a>
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#229ED9] hover:bg-[#1D85B8] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Telegram" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
               <span className="relative z-10 flex items-center gap-1.5">
                   Channel
                   <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                   </span>
               </span>
            </a>
          </div>
INNER_EOF
cat pages/SecretArea.tsx | sed -n '4876,$p' >> pages/SecretArea.tsx.tmp
mv pages/SecretArea.tsx.tmp pages/SecretArea.tsx
