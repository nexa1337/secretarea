const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const startIdx = code.indexOf('<AnimatePresence>');
const endIdx = code.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
  const newRender = `<AnimatePresence>
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id}
                comment={comment}
                onReaction={handleReaction}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </AnimatePresence>`;
  
  code = code.slice(0, startIdx) + newRender + code.slice(endIdx);
  fs.writeFileSync('components/CommentsSection.tsx', code);
}
