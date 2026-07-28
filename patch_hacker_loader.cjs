const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

const targetHackerLoader = `const [showHackerLoader, setShowHackerLoader] = useState(false);`;
const replacementHackerLoader = `const [showHackerLoader, setShowHackerLoader] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true' || localStorage.getItem('nexa_guest_mode') === 'true');`;

content = content.replace(targetHackerLoader, replacementHackerLoader);
fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched hacker loader initial state");
