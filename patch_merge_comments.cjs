const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const oldMerge = "const allComments = [...loadedComments, ...fakeComments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());";
const newMerge = `const allComments = [...loadedComments, ...fakeComments];
      const uniqueComments = Array.from(new Map(allComments.map(c => [c.id, c])).values())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setComments(uniqueComments);`;

code = code.replace(oldMerge, newMerge);
code = code.replace("setComments(allComments);", "");

fs.writeFileSync('components/CommentsSection.tsx', code);
