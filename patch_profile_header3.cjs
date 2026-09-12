const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const anchor = `                {/* Username & Bio */}
                <div className="px-8 md:px-12 mb-10 flex flex-col items-start text-start mt-16">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{user.displayName || profileData.username || user.email?.split('@')[0]}</h1>
                    {profileData.username && <p className="text-[#29aaea] font-medium mt-1">@{profileData.username}</p>}
                    {profileData.bio && <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl text-sm leading-relaxed">{profileData.bio}</p>}
                </div>`;

const replacement = `                {/* Username & Bio */}
                <div className="px-8 md:px-12 mb-10 flex flex-col items-start text-start mt-16 relative">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.displayName || profileData.username || user.email?.split('@')[0]}</h1>
                    {profileData.username && (
                        <div 
                            className="flex items-center gap-2 mt-2 cursor-pointer group bg-slate-100 dark:bg-[#111623] hover:bg-slate-200 dark:hover:bg-[#1a2333] px-3 py-1.5 rounded-lg transition-all border border-slate-200 dark:border-slate-800/50"
                            onClick={() => {
                                navigator.clipboard.writeText('@' + profileData.username);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            title="Copy username"
                        >
                            <span className="text-[#29aaea] font-bold text-sm tracking-wide">@{profileData.username}</span>
                            <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                {copied ? (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </span>
                        </div>
                    )}
                    {profileData.bio && <p className="text-slate-600 dark:text-slate-400 mt-5 max-w-2xl text-[15px] leading-relaxed border-l-2 border-[#29aaea]/30 pl-4 py-1">{profileData.bio}</p>}
                </div>`;

if(code.includes(anchor)) {
    code = code.replace(anchor, replacement);
    fs.writeFileSync('pages/Profile.tsx', code);
    console.log("Successfully patched profile header");
} else {
    console.log("Anchor not found.");
}
