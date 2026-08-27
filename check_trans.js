const fs = require('fs');
const text = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');
const words = [
    'NODES ACTIVE', 'Secret', 'Area',
    'Everything you need, from games to tools, collected from trusted sources and presented in a clean experience ad-free.',
    'Free Accounts', 'Master Gift', 'Join Community', 'Channel', 'Support Us',
    'UPCOMING', 'RELEASES', 'No upcoming', 'listed.', 'PAGE', 'OF',
    'game', 'hypervisor', 'steamtools', 'tools', 'savegames'
];
words.forEach(w => {
    if (!text.includes("'" + w + "'")) {
        console.log("Missing:", w);
    }
});
