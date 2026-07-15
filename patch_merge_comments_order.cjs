const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const target = `const allComments = [...loadedComments, ...fakeComments];
      const uniqueComments = Array.from(new Map(allComments.map(c => [c.id, c])).values())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setComments(uniqueComments);`;
const replacement = `const allComments = [...fakeComments, ...loadedComments];
      const uniqueComments = Array.from(new Map(allComments.map(c => [c.id, c])).values())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setComments(uniqueComments);`;
      
code = code.replace(target, replacement);

fs.writeFileSync('components/CommentsSection.tsx', code);
