const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// The current container
const currentStr = 'className="flex flex-wrap items-center justify-start xl:justify-end gap-2 sm:gap-3 w-full mt-6 xl:mt-0 relative z-[90]"';
const newStr = 'className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:flex xl:flex-wrap items-center justify-center xl:justify-end gap-2 sm:gap-3 w-full mt-6 xl:mt-0 relative z-[90]"';

content = content.replace(currentStr, newStr);

// We need to change the buttons' `flex-1 lg:flex-none` to just `flex-1` or remove `lg:flex-none`.
// In a grid, `flex-1 lg:flex-none` might make them shrink on lg if it were flex, but in grid it's ignored mostly.
// But on xl screens, they will be in a flex container. `lg:flex-none` means on xl they are flex-none.
// If we want them to wrap nicely on xl without squishing, `flex-1` is better, or `xl:flex-none` and let them size naturally.
// Let's replace `flex-1 lg:flex-none` with `w-full xl:w-auto xl:flex-none` just to be safe, but they already have `flex-1 lg:flex-none`.
// Actually, let's replace `flex-1 lg:flex-none` with `w-full xl:w-auto` for all 6 buttons.
content = content.replace(/flex-1 lg:flex-none/g, "w-full xl:w-auto");

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Fixed button responsiveness");
