const fs = require('fs');
let code = fs.readFileSync('components/CommentItem.tsx', 'utf8');

const reactionBlockRegex = /<div className="flex items-center rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700\/50 bg-slate-50 dark:bg-slate-800\/50 inline-flex">[\s\S]*?<\/div>/g;

code = code.replace(reactionBlockRegex, '');

fs.writeFileSync('components/CommentItem.tsx', code);
