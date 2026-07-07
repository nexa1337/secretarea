const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(/Report Broken Link in Secret Vault/g, 'Report Broken Link in Secret Area');
code = code.replace(/<span className="relative z-10">Secret Vault<\/span>/g, '<span className="relative z-10">Secret Area</span>');
code = code.replace(/Secret Vault/g, 'Secret Area');
code = code.replace(/DECRYPTING VAULT CONTENTS/g, 'DECRYPTING AREA CONTENTS');
code = code.replace(/Decrypting Vault/g, 'Decrypting Area');
code = code.replace(/VAULT SUMMARY EXECUTED/g, 'AREA SUMMARY EXECUTED');
code = code.replace(/Already in Vault/g, 'Already in Area');

fs.writeFileSync('pages/SecretArea.tsx', code);
