const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const headerTarget = 'className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 relative z-[9999] pointer-events-auto"';
const headerReplacement = 'className="flex flex-col gap-6 lg:gap-8 mb-12 relative z-[9999] pointer-events-auto"';

if(content.includes(headerTarget)) {
    content = content.replace(headerTarget, headerReplacement);
} else {
    console.log("Could not find headerTarget");
}

const buttonsContainerTarget = 'className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap items-center justify-center lg:justify-end gap-2 sm:gap-2 w-full mt-6 lg:mt-0 relative z-[90]"';
const buttonsContainerReplacement = 'className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-3 w-full mt-2 relative z-[90]"';

if(content.includes(buttonsContainerTarget)) {
    content = content.replace(buttonsContainerTarget, buttonsContainerReplacement);
} else {
    console.log("Could not find buttonsContainerTarget");
}

// Adjust buttons width
content = content.replace(/w-full lg:w-auto lg:flex-1 xl:flex-none lg:shrink-0/g, "w-full md:w-auto");
content = content.replace(/px-4 py-3 sm:px-5 sm:py-3.5 lg:px-3 lg:py-3 xl:px-4 xl:py-3/g, "px-4 py-3 sm:px-5 sm:py-3.5");
content = content.replace(/text-\[11px\] sm:text-xs lg:text-\[10px\] xl:text-xs/g, "text-[11px] sm:text-xs");

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Updated layout to place buttons below description");
