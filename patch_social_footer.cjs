const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const regex = /(<a id="telegram-btn"[^>]*>[\s\S]*?<\/a>)/;

const newButton = `
     <a id="reddit-btn" href={REDDIT_LINK} target="_blank" rel="noreferrer" className="relative w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-800 dark:text-slate-300 hover:text-white hover:bg-[#FF4500] hover:shadow-lg hover:shadow-[#FF4500]/20 transition-all border border-slate-200 dark:border-slate-800">
        <Icon name="Reddit" size={22} />
     </a>`;

content = content.replace(regex, `$1${newButton}`);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched social footer");
