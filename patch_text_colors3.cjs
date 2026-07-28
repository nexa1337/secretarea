const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// Use a regex replace with callback for generic text-slate-XYZ without dark:
function replaceSlateColor(text, slateLevel, newLightLevel) {
    const regex = new RegExp(`(?<!dark:)text-slate-${slateLevel}\\b`, 'g');
    return text.replace(regex, `text-slate-${newLightLevel} dark:text-slate-${slateLevel}`);
}

content = replaceSlateColor(content, '300', '700');
content = replaceSlateColor(content, '400', '600');
content = replaceSlateColor(content, '500', '700');

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched all unbound text-slate-300/400/500");
