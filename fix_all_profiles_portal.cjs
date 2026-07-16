const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const startTarget = `    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-4"
            onClick={onClose}
        >`;

const startReplacement = `    return createPortal(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-0"
            onClick={onClose}
        >`;

if (code.includes(startTarget)) {
    code = code.replace(startTarget, startReplacement);
} else {
    console.log("Could not find start for AllProfilesModal");
}

const endTarget = `                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};`;

const endReplacement = `                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );
};`;

if (code.includes(endTarget)) {
    code = code.replace(endTarget, endReplacement);
} else {
    console.log("Could not find end for AllProfilesModal");
}

// Ensure the inner modal is full screen as well
const modalInnerTarget = `            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-50 dark:bg-slate-950 w-full h-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
                onClick={e => e.stopPropagation()}
            >`;

const modalInnerReplacement = `            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-50 dark:bg-slate-950 w-full h-full max-w-none max-h-none rounded-none overflow-hidden shadow-2xl border-none flex flex-col"
                onClick={e => e.stopPropagation()}
            >`;

if (code.includes(modalInnerTarget)) {
    code = code.replace(modalInnerTarget, modalInnerReplacement);
} else {
    console.log("Could not find inner modal for AllProfilesModal");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Done fixing AllProfilesModal");
