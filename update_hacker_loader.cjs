const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
`            {/* Simple Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 dark:bg-cyan-900/10 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
              {/* Terminal Window */}
              <div className="w-full bg-slate-900/90 dark:bg-black/40 backdrop-blur-md border border-slate-700/50 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
                {/* Background Image inside terminal */}
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQkAa9_5IQD_l3knGuF-BnNCR8Tdzoso7DatHeN5EpmXDjvhYtkHUTkaik&s=10')" }} />`,
`            {/* Simple Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
               <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQkAa9_5IQD_l3knGuF-BnNCR8Tdzoso7DatHeN5EpmXDjvhYtkHUTkaik&s=10')" }} />
               <div className="absolute inset-0 bg-slate-50/70 dark:bg-[#020617]/80 md:backdrop-blur-[2px]" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 dark:bg-cyan-900/10 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
              {/* Terminal Window */}
              <div className="w-full bg-slate-900/90 dark:bg-black/40 backdrop-blur-md border border-slate-700/50 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl flex flex-col relative">
                {/* Background Image inside terminal */}
                <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQkAa9_5IQD_l3knGuF-BnNCR8Tdzoso7DatHeN5EpmXDjvhYtkHUTkaik&s=10')" }} />`
);

fs.writeFileSync('pages/SecretArea.tsx', content);
