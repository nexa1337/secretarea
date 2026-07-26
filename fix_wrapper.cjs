const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');
content = content.replace(
`             className={showMathGame ? "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-w-5xl relative z-10" : "w-full h-full relative z-10 flex flex-col"}
          >`,
`             className={showMathGame ? "w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-w-5xl relative z-10" : "w-full bg-white/10 dark:bg-black/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl flex flex-col relative"}
          >`
);

content = content.replace(
`          <div className={\`relative group \${showMathGame ? 'overflow-hidden bg-white/90 dark:bg-slate-900/90 md:backdrop-blur-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'w-full h-full flex flex-col overflow-hidden'}\`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>`,
`          <div className={\`relative group \${showMathGame ? 'overflow-hidden bg-white/90 dark:bg-slate-900/90 md:backdrop-blur-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'w-full flex flex-col overflow-hidden'}\`}>`
);
fs.writeFileSync('pages/SecretArea.tsx', content);
