#!/bin/bash
cat pages/SecretArea.tsx | sed -n '1,809p' > pages/SecretArea.tsx.tmp
cat << 'INNER_EOF' >> pages/SecretArea.tsx.tmp
     <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="relative w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#229ED9] hover:shadow-lg hover:shadow-[#229ED9]/20 transition-all border border-slate-200 dark:border-slate-800">
        <span className="absolute top-2 right-2 flex h-2 w-2 items-center justify-center z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 border border-white dark:border-slate-800"></span>
        </span>
        <Icon name="Telegram" size={20} />
     </a>
INNER_EOF
cat pages/SecretArea.tsx | sed -n '816,$p' >> pages/SecretArea.tsx.tmp
mv pages/SecretArea.tsx.tmp pages/SecretArea.tsx
