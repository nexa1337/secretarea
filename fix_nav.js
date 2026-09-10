import fs from 'fs';
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

code = code.replace(
    /navigate\('\/', \{ state: \{ openGameId: game.id \} \}\);/g,
    "navigate('/');"
);

code = code.replace(
    "const handleReturnToGame = (game) => {",
    "const handleReturnToGame = (game) => {\n        navigate('/', { state: { openGameId: game.id } });\n        return;"
);

fs.writeFileSync('pages/Profile.tsx', code);
