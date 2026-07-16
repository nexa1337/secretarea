const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const target = `        if (response.ok) {
          const data = await response.json();
          if (data && data.comments) {
            loadedComments = data.comments;
            fetchSuccess = true;
          }
        }`;

const replacement = `        if (response.ok) {
          const data = await response.json();
          if (data) {
            loadedComments = data.comments || [];
            fetchSuccess = true;
          }
        }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('components/CommentsSection.tsx', code);
    console.log("Fixed comments logic");
} else {
    console.log("Could not find target logic");
}
