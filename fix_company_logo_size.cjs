const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `          <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center p-2 relative group">
             {!imgError && profile.logoUrl ? (`;
const replacement1 = `          <div className="w-24 h-24 md:w-40 md:h-40 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden flex items-center justify-center p-2 md:p-4 relative group">
             {!imgError && profile.logoUrl ? (`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    console.log("Fixed company logo size");
} else {
    console.log("Could not find company logo target");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
