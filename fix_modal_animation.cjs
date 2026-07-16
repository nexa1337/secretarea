const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Change MostPopularRepacksSection conditional rendering
const sectionTarget = `        <AnimatePresence>
            {showAllModal && (
                <MostPopularRepacksModal 
                    games={games} 
                    onClose={() => setShowAllModal(false)} 
                    onSelect={(game) => {
                        setShowAllModal(false);
                        onSelect(game);
                    }} 
                />
            )}
        </AnimatePresence>`;

const sectionReplacement = `        <MostPopularRepacksModal 
            isOpen={showAllModal}
            games={games} 
            onClose={() => setShowAllModal(false)} 
            onSelect={(game) => {
                setShowAllModal(false);
                onSelect(game);
            }} 
        />`;

if (code.includes(sectionTarget)) {
    code = code.replace(sectionTarget, sectionReplacement);
    console.log("Fixed Section conditional render");
} else {
    console.log("Could not find section conditional render");
}

// 2. Change MostPopularRepacksModal definition
const modalDefTarget = `const MostPopularRepacksModal: React.FC<{
    games: ResourceItem[],
    onClose: () => void,
    onSelect: (item: ResourceItem) => void
}> = ({ games, onClose, onSelect }) => {`;

const modalDefReplacement = `const MostPopularRepacksModal: React.FC<{
    isOpen: boolean,
    games: ResourceItem[],
    onClose: () => void,
    onSelect: (item: ResourceItem) => void
}> = ({ isOpen, games, onClose, onSelect }) => {`;

if (code.includes(modalDefTarget)) {
    code = code.replace(modalDefTarget, modalDefReplacement);
    console.log("Fixed Modal definition");
} else {
    console.log("Could not find Modal definition");
}

// 3. Wrap Modal return with AnimatePresence
const modalReturnTarget = `    return createPortal(
        <motion.div `;

const modalReturnReplacement = `    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div `;

if (code.includes(modalReturnTarget)) {
    code = code.replace(modalReturnTarget, modalReturnReplacement);
    console.log("Fixed Modal return start");
} else {
    console.log("Could not find Modal return start");
}

const modalEndTarget = `                    </div>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );`;

const modalEndReplacement = `                    </div>
                )}
            </motion.div>
        </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );`;

if (code.includes(modalEndTarget)) {
    code = code.replace(modalEndTarget, modalEndReplacement);
    console.log("Fixed Modal return end");
} else {
    console.log("Could not find Modal return end");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
