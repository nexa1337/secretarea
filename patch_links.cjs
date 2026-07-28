const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

if (!content.includes('const REDDIT_LINK')) {
    content = content.replace(
        "const TELEGRAM_LINK = 'https://t.me/nexa1337agency';",
        "const TELEGRAM_LINK = 'https://t.me/nexa1337agency';\nconst REDDIT_LINK = 'https://www.reddit.com/r/SecretArea1337';"
    );
}

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched links");
