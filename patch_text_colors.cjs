const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// Inside ResourceDetailModal and other places where text-slate-300 is hardcoded for description
content = content.replace(
  /'text-slate-300'/g,
  "'text-slate-700 dark:text-slate-300'"
);

// Any generic text-slate-300 text that isn't using dark mode
content = content.replace(
  /className="(.*?)text-slate-300(.*?)"/g,
  function(match, p1, p2) {
      if (match.includes('dark:text-slate-300')) return match; // Already handled
      if (p1.includes('dark:')) return match; // Probably has some other dark mode handling
      return `className="${p1}text-slate-700 dark:text-slate-300${p2}"`;
  }
);

content = content.replace(
  /className="(.*?)text-slate-400(.*?)"/g,
  function(match, p1, p2) {
      if (match.includes('dark:text-slate-400')) return match; // Already handled
      if (p1.includes('dark:')) return match; 
      // replace text-slate-400 with text-slate-600 dark:text-slate-400
      return `className="${p1}text-slate-600 dark:text-slate-400${p2}"`;
  }
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched text-slate-300 and 400");
