const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

if (!code.includes("import { createPortal }")) {
    code = code.replace("import React,", "import { createPortal } from 'react-dom';\nimport React,");
}

const modalStart = `    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-slate-900/80 backdrop-blur-md">`;

const modalEnd = `                </AnimatePresence>
            </div>

            {/* Pagination Controls */}`;

const target1 = `    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 bg-slate-900/80 backdrop-blur-md">`;

const replacement1 = `    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 bg-slate-900/90 backdrop-blur-md">`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
} else {
    console.log("Could not find modal return start");
}

const target2 = `                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};`;

const replacement2 = `                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};`;

if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
} else {
    console.log("Could not find modal return end");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Done fixing portal");

