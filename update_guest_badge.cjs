const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetHeader = `        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 relative z-[9999] pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full pb-1">`;

const replacementHeader = `        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 relative z-[9999] pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full pb-1">
               {isGuestMode && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="px-3 py-1.5 border rounded-lg flex items-center gap-2.5 shadow-lg whitespace-nowrap shrink-0 relative overflow-hidden bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.3)]"
                 >
                    <Icon name="UserCircle" size={14} className="opacity-80" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">GUEST MODE</span>
                 </motion.div>
               )}`;

code = code.replace(targetHeader, replacementHeader);
fs.writeFileSync('pages/SecretArea.tsx', code);
