const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetTerminalBg = `{/* Background Image inside terminal */}`;
const replacementTerminalBg = `{/* Background Image inside terminal */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img src="https://images2.alphacoders.com/135/1355120.jpeg" alt="Terminal Background" className="w-full h-full object-cover opacity-20 dark:opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/60 backdrop-blur-[1px]"></div>
                </div>`;

content = content.replace(targetTerminalBg, replacementTerminalBg);

const targetHackerLoader = `const [showHackerLoader, setShowHackerLoader] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true');`;
const replacementHackerLoader = `const [showHackerLoader, setShowHackerLoader] = useState(false);`;

content = content.replace(targetHackerLoader, replacementHackerLoader);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched terminal");
