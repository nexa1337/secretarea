const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

// Remove the line that hides the login button when not unlocked
code = code.replace(
    "if (!isUnlocked && !user) return null;",
    "// Always show login button if not logged in\n  // if (!isUnlocked && !user) return null;"
);

fs.writeFileSync('components/Header.tsx', code);
