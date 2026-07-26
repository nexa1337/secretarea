const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');
content = content.replace(
`      </div>
    );
  }
          }
      \`}</style>
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-[#030712] dark:to-[#030712]">
      </div>`,
`      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#030712] font-sans text-slate-800 dark:text-slate-200 selection:bg-primary-500/30 transition-colors duration-300 overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-60 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-[#030712] dark:to-[#030712]">
      </div>`
);
fs.writeFileSync('pages/SecretArea.tsx', content);
