const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

code = code.replace(
    "<td className=\"px-6 py-4 text-slate-500 dark:text-[#8892b0]\">{u.email}</td>",
    "<td className=\"px-6 py-4 text-slate-500 dark:text-[#8892b0]\">{u.email || t('No email provided')}</td>"
);

fs.writeFileSync('pages/Profile.tsx', code);
