const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const target1 = "const [selectedGame, setSelectedGame] = useState<any>(null);";
const replacement1 = "const [selectedGame, setSelectedGame] = useState<any>(null);\n    const handleGameClick = (g: any) => {\n        navigate('/', { state: { openGameId: g.id } });\n    };";

code = code.replace(target1, replacement1);

code = code.replace(/onGameClick=\{\(g\) => setSelectedGame\(g\)\}/g, "onGameClick={handleGameClick}");

fs.writeFileSync('pages/Profile.tsx', code);
console.log("Patched Profile.tsx handleGameClick");
