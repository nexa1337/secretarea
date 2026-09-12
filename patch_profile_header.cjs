const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

code = code.replace(
    `<div className="mb-[18px]">
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{profileData.displayName || user.email?.split('@')[0]}</h1>
                        </div>`,
    `<div className="mb-[18px]">
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{user.displayName || profileData.username || user.email?.split('@')[0]}</h1>
                            {profileData.username && <p className="text-slate-500 font-medium -mt-1">@{profileData.username}</p>}
                            {profileData.bio && <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-lg text-sm">{profileData.bio}</p>}
                        </div>`
);

code = code.replace(
    `{user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : (profileData.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase())}`,
    `{user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : (user.displayName?.charAt(0) || profileData.username?.charAt(0) || user.email?.charAt(0).toUpperCase())}`
);

fs.writeFileSync('pages/Profile.tsx', code);
