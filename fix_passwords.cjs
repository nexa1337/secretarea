const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// Replace SteamAccountsModal password
const steamPassTarget = `<span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all">{acc.password}</span>`;
const steamPassReplacement = `<span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all select-none tracking-widest text-lg">••••••••</span>`;

// Replace MasterGiftModal password
const masterPassTarget = `<span className="text-xs font-mono text-slate-900 dark:text-zinc-300 truncate flex-1 select-all">{acc.password}</span>`;
const masterPassReplacement = `<span className="text-xs font-mono text-slate-900 dark:text-zinc-300 truncate flex-1 select-all select-none tracking-widest text-lg">••••••••</span>`;

if (code.includes(steamPassTarget)) {
    code = code.replace(steamPassTarget, steamPassReplacement);
    console.log("Fixed SteamAccountsModal password");
} else {
    console.log("Could not find SteamAccountsModal password");
}

if (code.includes(masterPassTarget)) {
    code = code.replace(masterPassTarget, masterPassReplacement);
    console.log("Fixed MasterGiftModal password");
} else {
    console.log("Could not find MasterGiftModal password");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
