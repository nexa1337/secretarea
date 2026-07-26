const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
`                      <div 
                        className="flex-1 min-h-0 p-4 overflow-y-auto font-mono text-[12px] sm:text-[13px] custom-scrollbar relative z-10 text-[#D8DEE9]" 
                        style={{ 
                          backgroundImage: "linear-gradient(rgba(10, 10, 12, 0.45), rgba(10, 10, 12, 0.55)), url('https://guide-images.cdn.ifixit.com/igi/yIjDodkoTxh26KQx.full')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundColor: '#121212',
                          textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.7)'
                        }}
                        onClick={() => document.getElementById('terminal-input')?.focus()}
                      >`,
`                      <div 
                        className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto font-mono text-[12px] sm:text-[13px] custom-scrollbar relative z-10 text-[#D8DEE9]" 
                        onClick={() => document.getElementById('terminal-input')?.focus()}
                      >`
);
fs.writeFileSync('pages/SecretArea.tsx', content);
