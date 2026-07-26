const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
`        <div className={\`w-full flex justify-center relative z-10 \${showMathGame ? 'min-h-full items-center p-4 py-8' : 'w-full h-full max-h-[80vh] min-h-[500px] max-w-5xl rounded-[1rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-300/50 dark:border-slate-700/50'}\`}>
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
          </div>
          <motion.div`,
`        <div className={\`w-full flex justify-center relative z-10 \${showMathGame ? 'min-h-full items-center p-4 py-8' : 'w-full h-full max-h-[80vh] min-h-[500px] max-w-5xl rounded-[1rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border border-slate-300/50 dark:border-slate-700/50'}\`}>
          <motion.div`
);
fs.writeFileSync('pages/SecretArea.tsx', content);
