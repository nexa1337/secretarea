const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const searchBarReplacement = `                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("User Management")}</h2>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{t("Total Users")}: {allUsers.length}</span>
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <input 
                                                type="text" 
                                                placeholder={t("Search users...") || "Search users..."}
                                                value={searchUserTerm}
                                                onChange={e => setSearchUserTerm(e.target.value)}
                                                className="w-full bg-white dark:bg-[#111623] border border-slate-200 dark:border-slate-800/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none transition-all"
                                            />
                                        </div>
                                    </div>`;

code = code.replace(
    `                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("User Management")}</h2>
                                        <span className="px-3 py-1 bg-slate-200 dark:bg-[#1a2333] text-sm font-medium rounded-lg text-slate-700 dark:text-[#8892b0]">{t("Total Users")}: {allUsers.length}</span>
                                    </div>`,
    searchBarReplacement
);

const avatarReplacement = `                                                                        <div className="w-8 h-8 rounded-full bg-[#29aaea] overflow-hidden flex items-center justify-center font-bold text-white shadow-sm border border-slate-200 dark:border-slate-800">
                                                                            {u.photoURL ? <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover" /> : (u.displayName?.charAt(0) || u.email?.charAt(0).toUpperCase())}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-slate-900 dark:text-white leading-tight">{u.displayName || 'Unknown'}</span>
                                                                            {u.username && <span className="text-xs text-slate-500 dark:text-slate-400">@{u.username}</span>}
                                                                        </div>`;

code = code.replace(
    `                                                                        <div className="w-8 h-8 rounded-full bg-[#29aaea] flex items-center justify-center font-bold text-white">
                                                                            {u.displayName?.charAt(0) || u.email?.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <span className="font-semibold text-slate-900 dark:text-white">{u.displayName || 'Unknown'}</span>`,
    avatarReplacement
);

fs.writeFileSync('pages/Profile.tsx', code);
console.log("Successfully patched admin search and avatar");
