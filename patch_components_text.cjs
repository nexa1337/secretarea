const fs = require('fs');
const path = require('path');

const componentsDir = 'components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

function replaceSlateColor(text, slateLevel, newLightLevel) {
    const regex = new RegExp(`(?<!dark:)text-slate-${slateLevel}\\b`, 'g');
    return text.replace(regex, `text-slate-${newLightLevel} dark:text-slate-${slateLevel}`);
}

for (const file of files) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    content = replaceSlateColor(content, '300', '700');
    content = replaceSlateColor(content, '400', '600');
    content = replaceSlateColor(content, '500', '700');
    
    fs.writeFileSync(filePath, content);
}

console.log("Patched text-slate colors in components");
