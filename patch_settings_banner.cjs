const fs = require('fs');
let code = fs.readFileSync('pages/Settings.tsx', 'utf8');

code = code.replace(
    /<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">\{t\('Avatar URL'\) \|\| 'Avatar URL'\}<\/label>/g,
    `<label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Banner URL') || 'Banner URL'}</label>
                                    <input 
                                        type="text"
                                        value={banner}
                                        onChange={e => setBanner(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none mb-6"
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Avatar URL') || 'Avatar URL'}</label>`
);

fs.writeFileSync('pages/Settings.tsx', code);
