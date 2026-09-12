const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const oldHeader = `                {/* Banner & Header */}
                <div className="relative mb-24 mt-2">
                    {/* Banner */}
                    <div className="aspect-[1983/793] max-h-[300px] md:max-h-[400px] rounded-xl w-full bg-[#070b14] overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800/50 flex items-center justify-center">
                        <img src={profileData?.banner || '/images/userprofile.png'} alt="Banner" className="w-full h-full object-contain md:object-cover" />
                    </div>
                    
                    {/* Avatar & Username */}
                    <div className="absolute -bottom-14 start-8 md:start-12 flex items-end gap-6">
                        <div className="w-[120px] h-[120px] rounded-full border-[6px] border-slate-50 dark:border-[#070b14] bg-[#29aaea] flex items-center justify-center text-[54px] font-semibold text-white overflow-hidden z-10 shadow-xl transition-colors duration-200">
                            {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : (user.displayName?.charAt(0) || profileData.username?.charAt(0) || user.email?.charAt(0).toUpperCase())}
                        </div>
                        <div className="mb-[18px]">
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{user.displayName || profileData.username || user.email?.split('@')[0]}</h1>
                            {profileData.username && <p className="text-slate-500 font-medium -mt-1">@{profileData.username}</p>}
                            {profileData.bio && <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-lg text-sm">{profileData.bio}</p>}
                        </div>
                    </div>
                </div>`;

const newHeader = `                {/* Banner & Header */}
                <div className="relative mb-16 mt-2">
                    {/* Banner */}
                    <div className="aspect-[1983/793] max-h-[300px] md:max-h-[400px] rounded-xl w-full bg-[#070b14] overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800/50 flex items-center justify-center">
                        <img src={profileData?.banner || '/images/userprofile.png'} alt="Banner" className="w-full h-full object-contain md:object-cover" />
                    </div>
                    
                    {/* Avatar */}
                    <div className="absolute -bottom-14 start-8 md:start-12">
                        <div className="w-[120px] h-[120px] rounded-full border-[6px] border-slate-50 dark:border-[#070b14] bg-[#29aaea] flex items-center justify-center text-[54px] font-semibold text-white overflow-hidden z-10 shadow-xl transition-colors duration-200">
                            {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : (user.displayName?.charAt(0) || profileData.username?.charAt(0) || user.email?.charAt(0).toUpperCase())}
                        </div>
                    </div>
                </div>

                {/* Username & Bio */}
                <div className="px-8 md:px-12 mb-10 flex flex-col items-start text-start mt-2">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{user.displayName || profileData.username || user.email?.split('@')[0]}</h1>
                    {profileData.username && <p className="text-[#29aaea] font-medium mt-1">@{profileData.username}</p>}
                    {profileData.bio && <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl text-sm leading-relaxed">{profileData.bio}</p>}
                </div>`;

if(code.includes(oldHeader)) {
    code = code.replace(oldHeader, newHeader);
    fs.writeFileSync('pages/Profile.tsx', code);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find the block to replace.");
}
