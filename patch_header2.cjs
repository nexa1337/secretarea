const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

if (!code.includes("import { auth, logOut }")) {
    code = code.replace("import React, { useState, useRef, useEffect } from 'react';", "import React, { useState, useRef, useEffect } from 'react';\nimport { auth, logOut } from '../src/firebase';");
}

// Add Profile link in MoreMenu
const oldMoreMenuDec = `const MoreMenu = ({ isUnlocked, handleLogout, t }: { isUnlocked: boolean, handleLogout: () => void, t: any }) => {`;
const newMoreMenuDec = `const MoreMenu = ({ isUnlocked, handleLogout, t, user }: { isUnlocked: boolean, handleLogout: () => void, t: any, user: any }) => {`;

if (code.includes(oldMoreMenuDec)) {
    code = code.replace(oldMoreMenuDec, newMoreMenuDec);
}

const themeButton = `{theme === 'light' ? t('Dark Mode') : t('Light Mode')}
            </button>`;

const newThemeButton = `{theme === 'light' ? t('Dark Mode') : t('Light Mode')}
            </button>
            
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full text-start px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
                <Icon name="User" size={18} />
                {t('Profile')}
              </Link>
            )}`;

if (!code.includes('to="/profile"')) {
    code = code.replace(themeButton, newThemeButton);
}

const oldMoreMenuCall = `<MoreMenu isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} />`;
const newMoreMenuCall = `<MoreMenu isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} user={user} />`;

if (code.includes(oldMoreMenuCall)) {
    code = code.replace(oldMoreMenuCall, newMoreMenuCall);
}

// Ensure the profile avatar from the previous patch is still there or removed if user prefers only dropdown
// Wait, the user said "when users login can see new section inside drop menu named profile". They didn't explicitly forbid the top-level avatar, but maybe it's better to remove it or leave it. I will leave it, it's fine, but I'll make sure it works. Wait, I will remove the top-level avatar to just follow "inside drop menu".

const oldAvatar = `{user && (
              <Link to="/profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors shrink-0">
                <img src={user.photoURL || \`https://ui-avatars.com/api/?name=\${user.email}\`} alt="Profile" className="w-full h-full object-cover" />
              </Link>
            )}`;

if (code.includes(oldAvatar)) {
    code = code.replace(oldAvatar, '');
}

fs.writeFileSync('components/Header.tsx', code);
