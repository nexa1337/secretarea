const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');
code = code.replace(
  "key={comment.id}",
  "key={`${comment.id}-${index}`}"
);
code = code.replace(
  "{comments.map((comment) => (",
  "{comments.map((comment, index) => ("
);
fs.writeFileSync('components/CommentsSection.tsx', code);
