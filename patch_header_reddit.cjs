const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetStr = `            </a>
            <button 
                onClick={(e) => { e.preventDefault(); setShowDonateModal(true); }}`;

const replacementStr = `            </a>
            <a id="subreddit-btn" href={REDDIT_LINK} target="_blank" rel="noreferrer" className="relative z-[100] cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#FF4500] hover:bg-[#E03D00] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Reddit" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" />
                <span className="relative z-10 flex items-center gap-2">
                   Reddit
               </span>
            </a>
            <button 
                onClick={(e) => { e.preventDefault(); setShowDonateModal(true); }}`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched Reddit header button");
