const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');
code = code.replace(
  "setComments(uniqueComments);",
  "const ids = uniqueComments.map(c => c.id);\n      if (new Set(ids).size !== ids.length) console.error('DUPLICATES IN UNIQUE COMMENTS:', ids);\n      setComments(uniqueComments);"
);
fs.writeFileSync('components/CommentsSection.tsx', code);
