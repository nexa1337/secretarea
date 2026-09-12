const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

code = code.replace(
    `if (!user) return <div className="min-h-screen pt-24 text-center">Please log in.</div>;
    if (!profileData) return <div className="min-h-screen pt-24 text-center text-red-500">Error loading profile data. Please refresh.</div>;`,
    `if (!user) return <div className="min-h-screen bg-[#070b14] pt-24 text-center text-white">Please log in.</div>;
    if (!profileData) return <div className="min-h-screen bg-[#070b14] pt-24 text-center text-red-500">Error loading profile data. (Rules updated, please refresh the page!)</div>;`
);

fs.writeFileSync('pages/Profile.tsx', code);
