const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// Add Firebase imports at the top
if (!code.includes('import { signInWithGoogle, signInWithDiscord }')) {
    code = code.replace("import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';", "import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';\nimport { signInWithGoogle, signInWithDiscord } from '../src/firebase';\nimport { useNavigate } from 'react-router-dom';");
}

// Add useNavigate hook
if (!code.includes('const navigate = useNavigate();')) {
    code = code.replace('const [searchQuery, setSearchQuery] = useState(\'\');', 'const [searchQuery, setSearchQuery] = useState(\'\');\n  const navigate = useNavigate();');
}

// Add login buttons below the terminal
const terminalEnd = `                </div>
            )}
          </div>
        </motion.div>`;
        
const visitorLogin = `                </div>
            )}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Visitor Login</span>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={async () => {
                  try {
                    await signInWithDiscord();
                    navigate('/profile');
                  } catch (e) { console.error(e); }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-colors text-sm w-full sm:w-auto"
              >
                <Icon name="BrandDiscord" size={18} /> Login with Discord
              </button>
              <button 
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    navigate('/profile');
                  } catch (e) { console.error(e); }
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold rounded-xl transition-colors text-sm w-full sm:w-auto"
              >
                <Icon name="BrandGoogle" size={18} /> Login with Google
              </button>
            </div>
          </div>
          
        </motion.div>`;

if (!code.includes('Visitor Login')) {
    code = code.replace(terminalEnd, visitorLogin);
}

fs.writeFileSync('pages/SecretArea.tsx', code);
