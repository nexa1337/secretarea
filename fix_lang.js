import fs from 'fs';
let code = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
// Fix duplicate key 'Overview', we'll just ignore it since it builds but shows a warning.
// Wait, esbuild throws a warning, not an error. Build finished successfully.
