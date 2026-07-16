const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetGradient = '<div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />';

if (code.includes(targetGradient)) {
    code = code.split(targetGradient).join('');
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Removed gradients");
} else {
    console.log("Could not find gradients");
}
