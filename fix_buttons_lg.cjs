const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// The current container
const currentStr = 'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:flex xl:flex-wrap items-center justify-center xl:justify-end gap-2 sm:gap-3 w-full mt-6 xl:mt-0 relative z-[90]"';
const newStr = 'className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap items-center justify-center lg:justify-end gap-2 sm:gap-2 w-full mt-6 lg:mt-0 relative z-[90]"';

content = content.replace(currentStr, newStr);

// Change button widths for lg screens so they are in one row
content = content.replace(/w-full xl:w-auto/g, "w-full lg:w-auto lg:flex-1 xl:flex-none lg:shrink-0");

// Reduce padding slightly on lg screens to ensure they fit in one line
content = content.replace(/px-4 py-3 sm:px-5 sm:py-3.5/g, "px-4 py-3 sm:px-5 sm:py-3.5 lg:px-3 lg:py-3 xl:px-4 xl:py-3");

// Adjust text size to fit better on lg
content = content.replace(/text-\[11px\] sm:text-xs/g, "text-[11px] sm:text-xs lg:text-[10px] xl:text-xs");

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Fixed button responsiveness for laptop (one line)");
