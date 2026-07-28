const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetMainTerminalBg = `                <div className="flex flex-col relative overflow-hidden w-full h-[450px]">
                      `;
const replacementMainTerminalBg = `                <div className="flex flex-col relative overflow-hidden w-full h-[450px]">
                      {/* Background Image inside terminal */}
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <img src="https://images2.alphacoders.com/135/1355120.jpeg" alt="Terminal Background" className="w-full h-full object-cover opacity-20 dark:opacity-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/60 backdrop-blur-[1px]"></div>
                      </div>
                      `;

content = content.replace(targetMainTerminalBg, replacementMainTerminalBg);
fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched main terminal bg");
