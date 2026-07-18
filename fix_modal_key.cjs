const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div 
            initial={{ opacity: 0 }}`;

const replacement1 = `    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div 
            key="most-popular-repacks-modal"
            initial={{ opacity: 0 }}`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Fixed key");
} else {
    console.log("Could not find key target");
}

