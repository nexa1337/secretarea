const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const steamPassTarget = `<span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all select-none tracking-widest text-lg">••••••••</span>`;
const steamPassReplacement = `<span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-none tracking-widest text-lg mt-1">••••••••</span>`;

const masterPassTarget = `<span className="text-xs font-mono text-slate-900 dark:text-zinc-300 truncate flex-1 select-all select-none tracking-widest text-lg">••••••••</span>`;
const masterPassReplacement = `<span className="text-xs font-mono text-slate-900 dark:text-zinc-300 truncate flex-1 select-none tracking-widest text-lg mt-1">••••••••</span>`;

if (code.includes(steamPassTarget)) {
    code = code.replace(steamPassTarget, steamPassReplacement);
    console.log("Fixed SteamAccountsModal password css");
}

if (code.includes(masterPassTarget)) {
    code = code.replace(masterPassTarget, masterPassReplacement);
    console.log("Fixed MasterGiftModal password css");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
