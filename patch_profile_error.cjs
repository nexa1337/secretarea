const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

// Replace the `if (!user || !profileData) return null;` with something that shows the error
code = code.replace(
    "if (!user || !profileData) return null;",
    `if (!user) return <div className="min-h-screen pt-24 text-center">Please log in.</div>;
    if (!profileData) return <div className="min-h-screen pt-24 text-center text-red-500">Error loading profile data. Please refresh.</div>;`
);

fs.writeFileSync('pages/Profile.tsx', code);
