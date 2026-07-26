const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
`          <div className="fixed inset-0 z-0 pointer-events-none">
             {bgImage && (
                <div 
                   className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40"
                  style={{ backgroundImage: \`url(\${bgImage})\` }} 
                 />
             )}
             <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-950/70 md:backdrop-blur-[2px]"></div>
             <div 
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-900/20 rounded-full md:blur-[120px] blur-[80px]"
             />
          </div>`,
`          <div className="fixed inset-0 z-0 pointer-events-none">
            {showMathGame ? (
              <>
                 {bgImage && (
                    <div 
                       className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40"
                      style={{ backgroundImage: \`url(\${bgImage})\` }} 
                     />
                 )}
                 <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-950/70 md:backdrop-blur-[2px]"></div>
                 <div 
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-900/20 rounded-full md:blur-[120px] blur-[80px]"
                 />
              </>
            ) : (
              <>
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 dark:bg-cyan-900/10 rounded-full blur-[100px]" />
              </>
            )}
          </div>`
);
fs.writeFileSync('pages/SecretArea.tsx', content);
