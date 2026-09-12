const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(
    "const ResourceDetailModal: React.FC<{",
    "export const ResourceDetailModal: React.FC<{"
);

fs.writeFileSync('pages/SecretArea.tsx', code);
