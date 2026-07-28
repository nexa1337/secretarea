const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetStr = 'className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-[75%] relative z-[90]"';
const replacementStr = 'className="flex flex-wrap items-center justify-start xl:justify-end gap-2 sm:gap-3 w-full mt-6 xl:mt-0 relative z-[90]"';

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('pages/SecretArea.tsx', content);
    console.log("Replaced layout container");
} else {
    console.log("Could not find target layout string");
}

