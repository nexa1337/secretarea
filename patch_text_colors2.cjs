const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
  /className="(.*?)text-slate-500(.*?)"/g,
  function(match, p1, p2) {
      if (match.includes('dark:text-slate-500') || match.includes('dark:text-slate-400') || match.includes('dark:text-slate-300')) return match;
      if (p1.includes('dark:text-')) return match; 
      // replace text-slate-500 with text-slate-700 dark:text-slate-400
      return `className="${p1}text-slate-700 dark:text-slate-400${p2}"`;
  }
);

content = content.replace(
  /className="(.*?)text-slate-300 dark:text-slate-600(.*?)"/g,
  `className="$1text-slate-400 dark:text-slate-600$2"`
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched text-slate-500");
