const fs = require('fs');
let code = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const missingTranslations = `
    'No email provided': { en: 'No email provided', fr: 'Aucun email fourni', es: 'Ningún correo proporcionado', ar: 'لم يتم توفير بريد إلكتروني' },
`;

code = code.replace(
    "const translations: Record<string, Record<Language, string>> = {",
    "const translations: Record<string, Record<Language, string>> = {\n" + missingTranslations
);

fs.writeFileSync('src/contexts/LanguageContext.tsx', code);
