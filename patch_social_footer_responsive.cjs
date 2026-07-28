const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// The Footer component in SecretArea.tsx is defined like this:
// const Footer: React.FC<{ onSupportClick?: () => void }> = ({ onSupportClick }) => (

// Find the first <footer> which is this one.
content = content.replace(
    /<footer className="w-full mt-2 pt-2 pb-8 flex justify-center items-center gap-4 relative z-20">/,
    '<footer className="w-full mt-2 pt-2 pb-8 flex justify-center items-center gap-3 sm:gap-4 md:gap-6 flex-wrap relative z-20 px-4">'
);

// Fix sizes for a buttons inside this footer
const replaceSizes = (str) => {
    let s = str.replace(/w-12 h-12/g, 'w-10 h-10 sm:w-12 sm:h-12');
    s = s.replace(/size={20}/g, 'size={18} className="sm:w-5 sm:h-5"');
    s = s.replace(/size={22}/g, 'size={20} className="sm:w-6 sm:h-6"');
    return s;
}

let startIndex = content.indexOf('const Footer: React.FC<{ onSupportClick?: () => void }> =');
if (startIndex !== -1) {
    let endIndex = content.indexOf(');', startIndex);
    let before = content.substring(0, startIndex);
    let after = content.substring(endIndex);
    let middle = content.substring(startIndex, endIndex);
    
    middle = replaceSizes(middle);
    content = before + middle + after;
}

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched social footer responsive");
