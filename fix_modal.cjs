const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full max-w-7xl max-h-[90vh] sm:max-h-full rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >`;

const replacement1 = `<div className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full h-full max-w-none max-h-none rounded-none shadow-2xl flex flex-col overflow-hidden border-none"
            >`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Fixed modal wrapper");
} else {
    console.log("Could not find modal wrapper");
}
