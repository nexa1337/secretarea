const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// Function to safely replace outside of specific blocks (like terminals)
function replaceOutsideTerminals(text) {
    // We can just manually find and replace except in terminal blocks, OR
    // we can use a simpler approach: replace all, then fix the ones inside the terminals!
    
    // Let's replace all first
    let newText = text.replace(/(?<![\w:-])text-slate-300/g, 'text-slate-600 dark:text-slate-300');
    
    // Now fix the terminals manually!
    
    // 1. Hacker Loader terminal header
    newText = newText.replace(
        /text-xs font-semibold text-slate-600 dark:text-slate-300 lowercase tracking-widest font-mono/g,
        'text-xs font-semibold text-slate-300 lowercase tracking-widest font-mono'
    );
    
    // 2. Hacker Loader terminal lines
    newText = newText.replace(
        /isLatest \? 'text-cyan-400' : 'text-slate-600 dark:text-slate-300'/g,
        "isLatest ? 'text-cyan-400' : 'text-slate-300'"
    );
    
    // 3. Hacker Loader terminal check icon
    newText = newText.replace(
        /<Icon name="Check" size=\{12\} className="text-slate-600 dark:text-slate-300" \/>/g,
        '<Icon name="Check" size={12} className="text-slate-300" />'
    );

    return newText;
}

content = replaceOutsideTerminals(content);
fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched text-slate-300");
