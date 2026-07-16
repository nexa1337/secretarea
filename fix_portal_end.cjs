const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target2 = `                    </div>
                )}
            </motion.div>
        </div>
    );
};`;

const replacement2 = `                    </div>
                )}
            </motion.div>
        </div>,
        document.body
    );
};`;

if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Found and replaced end");
} else {
    console.log("Could not find exact text");
}
