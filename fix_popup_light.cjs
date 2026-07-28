const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// 1. Fix System Requirements text-slate-200 to text-slate-800 dark:text-slate-200
const sysReqOld = 'className="text-sm font-semibold text-slate-200 uppercase tracking-wider">{req.label}</span>';
const sysReqNew = 'className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{req.label}</span>';

if (content.includes(sysReqOld)) {
    content = content.replace(sysReqOld, sysReqNew);
    console.log("Fixed System Requirements label text color");
} else {
    console.log("sysReqOld not found");
}

// 2. Fix Recent Products text-slate-900 to text-white for version
const recentVersionOld = '<span className="font-mono font-bold text-slate-900 dark:text-slate-200 text-[10px] drop-shadow-md bg-black/40 px-1.5 rounded">';
const recentVersionNew = '<span className="font-mono font-bold text-white text-[10px] drop-shadow-md bg-black/40 px-1.5 rounded">';

if (content.includes(recentVersionOld)) {
    content = content.replace(recentVersionOld, recentVersionNew);
    console.log("Fixed Recent Products version text color");
} else {
    console.log("recentVersionOld not found");
}

fs.writeFileSync('pages/SecretArea.tsx', content);
