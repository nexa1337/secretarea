const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const oldHandleReactionFetch = `    // Try sending to Google Sheet
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'reactComment', commentId, replyId, type }),
      });
    } catch (e) {`;

const newHandleReactionFetch = `    // Try sending to Google Sheet
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'reactComment', commentId, replyId, type }),
        mode: 'no-cors'
      });
    } catch (e) {`;

const oldHandleReplySubmitFetch = `    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addReply', commentId, reply }),
      });
    } catch (e) {`;

const newHandleReplySubmitFetch = `    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addReply', commentId, reply }),
        mode: 'no-cors'
      });
    } catch (e) {`;

code = code.replace(oldHandleReactionFetch, newHandleReactionFetch);
code = code.replace(oldHandleReplySubmitFetch, newHandleReplySubmitFetch);

fs.writeFileSync('components/CommentsSection.tsx', code);
console.log("Patched fetch mode");
