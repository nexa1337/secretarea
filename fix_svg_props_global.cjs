const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixSvgProps(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                fixSvgProps(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let original = content;
            content = content.replace(/stroke-width=/g, 'strokeWidth=');
            content = content.replace(/stroke-linecap=/g, 'strokeLinecap=');
            content = content.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
            content = content.replace(/fill-rule=/g, 'fillRule=');
            content = content.replace(/clip-rule=/g, 'clipRule=');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log("Fixed SVG props in " + fullPath);
            }
        }
    }
}
fixSvgProps('./src');
fixSvgProps('./pages');
fixSvgProps('./components');
