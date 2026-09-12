const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

code = code.replace(
    '<div className="px-8 md:px-12 mb-10 flex flex-col items-start text-start mt-2">',
    '<div className="px-8 md:px-12 mb-10 flex flex-col items-start text-start mt-16">'
);

fs.writeFileSync('pages/Profile.tsx', code);
console.log("Fixed margin top for profile info!");
