const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Fix Modal Animation
const modalTarget = `    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 bg-slate-900/90 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full h-full max-w-none max-h-none rounded-none shadow-2xl flex flex-col overflow-hidden border-none"
            >`;

const modalReplacement = `    return createPortal(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-0 bg-slate-900/90 backdrop-blur-md"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 w-full h-full max-w-none max-h-none rounded-none shadow-2xl flex flex-col overflow-hidden border-none"
            >`;

if (code.includes(modalTarget)) {
    code = code.replace(modalTarget, modalReplacement);
    console.log("Fixed modal root animation");
} else {
    console.log("Could not find modal root");
}

const modalEndTarget = `                    </div>
                )}
            </motion.div>
        </div>,
        document.body
    );`;

const modalEndReplacement = `                    </div>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );`;

if (code.includes(modalEndTarget)) {
    code = code.replace(modalEndTarget, modalEndReplacement);
    console.log("Fixed modal end tag");
} else {
    console.log("Could not find modal end tag");
}

// 2. Fix Button Design
const buttonTarget = `                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => setShowAllModal(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                    >
                        See More Games <Icon name="ArrowRight" size={18} />
                    </button>
                </div>`;

const buttonReplacement = `                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => setShowAllModal(true)}
                        className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                            SEE MORE GAMES 
                            <Icon name="ArrowRight" size={20} className="transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>`;

if (code.includes(buttonTarget)) {
    code = code.replace(buttonTarget, buttonReplacement);
    console.log("Fixed button design");
} else {
    console.log("Could not find button");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
