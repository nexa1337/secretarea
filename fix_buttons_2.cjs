const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// Replace Free Accounts and Master Gift buttons container
code = code.replace(
    /<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-\[75%\][^>]*>[\s\S]*?<a href=\{DISCORD_LINK\}/,
    `<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-[75%] relative z-[90]">
            <button 
                id="btn-free-accounts"
                type="button"
                onClick={(e) => { e.preventDefault(); setShowSteamModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >
                <Icon name="BrandSteam" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Free Accounts
                    {steamAccounts && steamAccounts.length > 0 && (
                        <span className="flex items-center justify-center bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-md border border-red-400">
                            {steamAccounts.length}
                        </span>
                    )}
                </span>
            </button>
            <button 
                id="btn-master-gift"
                type="button"
                onClick={(e) => { e.preventDefault(); setShowMasterGiftModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >
                <Icon name="Gift" size={18} className="text-yellow-300 group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Master Gift
                    {masterGifts && masterGifts.length > 0 && (
                        <span className="flex items-center justify-center bg-yellow-400 text-yellow-900 text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-md border border-yellow-300">
                            {masterGifts.length}
                        </span>
                    )}
                </span>
            </button>
            <a href={DISCORD_LINK}`
);

// Replace upcoming platform buttons
code = code.replace(
    /<div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar[^>]*>[\s\S]*?<\/div>/,
    `<div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar relative z-[90]">
                {['PlayStation 5', 'Xbox S/X', 'Steam'].map((p) => (
                    <button
                        key={p}
                        type="button"
                        id={"btn-platform-" + p.replace(/\\s+/g, '-').toLowerCase()}
                        onClick={(e) => { e.preventDefault(); setUpcomingPlatform(p); }}
                        className={\`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer z-[100] \${
                            upcomingPlatform === p 
                            ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }\`}
                    >
                        {p}
                    </button>
                ))}
             </div>`
);

fs.writeFileSync('pages/SecretArea.tsx', code);
