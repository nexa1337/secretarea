const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(
    /<div className="max-w-\[1600px\] mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-40">/,
    `<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-40 relative z-10">`
);

fs.writeFileSync('pages/SecretArea.tsx', code);
