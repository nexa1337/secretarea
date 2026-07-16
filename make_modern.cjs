const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const oldContainer = 'className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/20"';
const newContainer = 'className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-500/50"';

const oldImg = 'className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"';
const newImg = 'className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 saturate-100 group-hover:saturate-150"';

if (code.includes(oldContainer) && code.includes(oldImg)) {
    code = code.split(oldContainer).join(newContainer);
    code = code.split(oldImg).join(newImg);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Updated to modern without zoom");
} else {
    console.log("Could not find targets");
}
