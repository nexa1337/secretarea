const fs = require('fs');
let code = fs.readFileSync('pages/Settings.tsx', 'utf8');

code = code.replace(
    "const [bio, setBio] = useState('');",
    "const [bio, setBio] = useState('');\n    const [banner, setBanner] = useState('');"
);

code = code.replace(
    "setUsername(data.username || currentUser.email?.split('@')[0] || '');\n                        setBio(data.bio || '');",
    "setUsername(data.username || currentUser.email?.split('@')[0] || '');\n                        setBio(data.bio || '');\n                        setBanner(data.banner || '');"
);

code = code.replace(
    "username,\n                bio",
    "username,\n                bio,\n                banner"
);

code = code.replace(
    `                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Profile Picture URL') || 'Profile Picture URL'}</label>`,
    `                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Banner URL') || 'Banner URL'}</label>
                                    <input 
                                        type="text"
                                        value={banner}
                                        onChange={e => setBanner(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Profile Picture URL') || 'Profile Picture URL'}</label>`
);

fs.writeFileSync('pages/Settings.tsx', code);
