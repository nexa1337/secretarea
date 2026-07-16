const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );
};

export default SecretArea;`;

const replacement = `                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
};

export default SecretArea;`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Fixed end of AllProfilesModal");
} else {
    console.log("Could not find end of AllProfilesModal");
}
