const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(
    /<header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">/,
    `<header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 relative z-[9999] pointer-events-auto">`
);

fs.writeFileSync('pages/SecretArea.tsx', code);
