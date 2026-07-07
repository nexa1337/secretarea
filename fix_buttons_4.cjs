const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(
    /<a href=\{DISCORD_LINK\}[^>]*>[\s\S]*?<span className="relative z-10">Join Community<\/span>\s*<\/a>/,
    `<a id="join-community-btn" href={DISCORD_LINK} target="_blank" rel="noreferrer" className="relative z-[100] cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Discord" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
               <span className="relative z-10">Join Community</span>
            </a>`
);

code = code.replace(
    /<a href=\{TELEGRAM_LINK\}[^>]*>[\s\S]*?<Icon name="Telegram"[\s\S]*?Channel[\s\S]*?<\/a>/,
    `<a id="channel-btn" href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="relative z-[100] cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#229ED9] hover:bg-[#1D85B8] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Telegram" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
               <span className="relative z-10 flex items-center gap-2">
                   Channel
                   <span className="flex h-2 w-2 relative">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" style={{ animation: 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
                   </span>
               </span>
            </a>`
);

// One possible reason nothing is clickable is if the parent container of the WHOLE PAGE has pointer-events-none! 
// Let's check for <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
// Maybe it extends over everything? No, it's right-4 and top-24.

fs.writeFileSync('pages/SecretArea.tsx', code);
