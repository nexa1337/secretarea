import fs from 'fs';

let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

// 1. Fix default points and gamesViewed
code = code.replace(/points: 2,/g, 'points: 0,');
code = code.replace(/gamesViewed: 1,/g, 'gamesViewed: 0,');
code = code.replace(/if \(data\.points === undefined\) data\.points = 2;/g, 'if (data.points === undefined) data.points = 0;');
code = code.replace(/if \(data\.gamesViewed === undefined\) data\.gamesViewed = 1;/g, 'if (data.gamesViewed === undefined) data.gamesViewed = 0;');

// 2. Fix Date format
code = code.replace(
    /const memberSince = new Date\(profileData\.createdAt\)\.toLocaleDateString\('en-US', \{ month: 'short', year: 'numeric' \}\);/g,
    `const memberSince = new Date(profileData.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });`
);

// 3. Fix text colors in light mode (text-white -> text-slate-900 dark:text-white)
code = code.replace(/<span className="text-3xl font-bold text-white">\{profileData\.points\}<\/span>/g, '<span className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.points}</span>');
code = code.replace(/<span className="text-3xl font-bold text-white">\{profileData\.gamesViewed\}<\/span>/g, '<span className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.gamesViewed}</span>');
code = code.replace(/<span className="text-3xl font-bold text-white">\{profileData\.contentLiked\}<\/span>/g, '<span className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.contentLiked}</span>');
code = code.replace(/<span className="text-3xl font-bold text-white">\{memberSince\}<\/span>/g, '<span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{memberSince}</span>'); // smaller text for date

// 4. Fix Cub Wolf transparency issue
const oldIconCircle = `<div className={\`w-14 h-14 rounded-full flex items-center justify-center text-3xl \${isPast || isCurrent ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'} shadow-inner\`}>`;
const newIconCircle = `<div className={\`relative w-14 h-14 rounded-full flex items-center justify-center text-3xl \${isPast || isCurrent ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'} shadow-inner\`}>
                                                            <div className="absolute inset-0 bg-white dark:bg-[#111623] rounded-full -z-10 border border-slate-100 dark:border-slate-800" />`;
code = code.replace(oldIconCircle, newIconCircle);

// 5. Limit recent activity to 4 games
code = code.replace(
    /profileData\.recentGames\.map\(\(game, i\) => \(/g,
    'profileData.recentGames.slice(0, 4).map((game, i) => ('
);

// 6. Connect line z-index
code = code.replace(
    /className=\{\`absolute top-10 start-1\/2 w-full h-1/g,
    'className={`absolute top-[46px] start-1/2 w-full h-1 z-0'
);

fs.writeFileSync('pages/Profile.tsx', code);
console.log("Profile fixes applied successfully!");
