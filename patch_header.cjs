const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

if (!code.includes('import { auth, logOut }')) {
    code = code.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { auth, logOut } from '../src/firebase';");
}

if (!code.includes('const [user, setUser]')) {
    code = code.replace("const [isUnlocked, setIsUnlocked]", "const [user, setUser] = useState<any>(null);\n  useEffect(() => {\n    const unsubscribe = auth.onAuthStateChanged(setUser);\n    return () => unsubscribe();\n  }, []);\n\n  const [isUnlocked, setIsUnlocked]");
}

// Add user avatar next to the language switcher
const headerActions = `<LanguageSwitcher />
            <MoreMenu isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} />`;
            
const newHeaderActions = `<LanguageSwitcher />
            {user && (
              <Link to="/profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors shrink-0">
                <img src={user.photoURL || \`https://ui-avatars.com/api/?name=\${user.email}\`} alt="Profile" className="w-full h-full object-cover" />
              </Link>
            )}
            <MoreMenu isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} />`;

if (!code.includes('Link to="/profile"')) {
    code = code.replace(headerActions, newHeaderActions);
}

fs.writeFileSync('components/Header.tsx', code);
