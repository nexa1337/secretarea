import re

with open('pages/Profile.tsx', 'r') as f:
    content = f.read()

replacement = """                    <div className="px-4 sm:px-10 relative z-10 mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div 
                                className="-mt-12 sm:-mt-16 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 dark:border-[#060a11] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg overflow-hidden shrink-0"
                                style={{ backgroundColor: bgColor }}
                            >
                                {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : initial.toUpperCase()}
                            </div>
                            <div className="pt-2 sm:pt-4 flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{user.displayName || user.email.split('@')[0]}</h1>
                                {profileData?.bio && (
                                    <p className="mt-1 text-slate-600 dark:text-slate-400 max-w-xl text-sm leading-relaxed">{profileData.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>"""

# Ensure we remove the old layout
content = re.sub(
    r'<div className="px-4 sm:px-10 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 relative z-10 mb-8 sm:mb-12">.*?<div className="pb-2 sm:pb-4 flex-1">\s*<h1 className="text-2xl sm:text-3xl font-bold">\{user\.displayName \|\| user\.email\.split\(\'@\'\)\[0\]\}</h1>\s*\{profileData\?\.bio && \(\s*<p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl text-sm leading-relaxed">\{profileData\.bio\}</p>\s*\)\}\s*</div>\s*</div>',
    replacement,
    content,
    flags=re.DOTALL
)

with open('pages/Profile.tsx', 'w') as f:
    f.write(content)
