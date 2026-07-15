const fs = require('fs');

const OLD_URL_1 = "https://script.google.com/macros/s/AKfycbxbQKmoUUH4KzLmkAYZMGpoORPDTFYTzqCpnScEFIw5ngQ1cgzvFWU5fq0OXe2M5Ref/exec";
const OLD_URL_2 = "https://script.google.com/macros/s/AKfycbyZxjJP3pkFwnDsnmq1I_6Va63Vsmm481NmcN06rRDG5YbeyKipTf0wS_PkxXrJc4DM/exec";
const NEW_URL = "https://script.google.com/macros/s/AKfycbx7nzBZc_tIhbAUK5OvOzgifGVzaVorzjn5OXNe8ENC0p7Pjia7O-u4WggxjRZipt4v/exec";

function replaceInFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let changed = false;
  
  if (content.includes(OLD_URL_1)) {
    content = content.replace(new RegExp(OLD_URL_1, 'g'), NEW_URL);
    changed = true;
  }
  if (content.includes(OLD_URL_2)) {
    content = content.replace(new RegExp(OLD_URL_2, 'g'), NEW_URL);
    changed = true;
  }
  
  // also let's patch fetch mode to no-cors
  if (filepath.includes('CommentsSection.tsx')) {
    const fetchWithoutNoCors1 = `      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'reactComment', commentId, replyId, type }),
      });`;
    const fetchWithNoCors1 = `      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'reactComment', commentId, replyId, type }),
        mode: 'no-cors'
      });`;
      
    const fetchWithoutNoCors2 = `      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addReply', commentId, reply }),
      });`;
    const fetchWithNoCors2 = `      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addReply', commentId, reply }),
        mode: 'no-cors'
      });`;

    const fetchWithoutNoCors3 = `      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addComment', comment: commentData }),
      });`;
    const fetchWithNoCors3 = `      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addComment', comment: commentData }),
        mode: 'no-cors'
      });`;

    if (content.includes(fetchWithoutNoCors1)) {
       content = content.replace(fetchWithoutNoCors1, fetchWithNoCors1);
       changed = true;
    }
    if (content.includes(fetchWithoutNoCors2)) {
       content = content.replace(fetchWithoutNoCors2, fetchWithNoCors2);
       changed = true;
    }
    if (content.includes(fetchWithoutNoCors3)) {
       content = content.replace(fetchWithoutNoCors3, fetchWithNoCors3);
       changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filepath}`);
  }
}

replaceInFile('components/CommentsSection.tsx');
replaceInFile('pages/SecretArea.tsx');
replaceInFile('pages/PersonalFinance.tsx');
replaceInFile('pages/Games.tsx');
replaceInFile('pages/Tools.tsx');

