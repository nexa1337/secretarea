const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Add state variable
const stateDecl = `  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [topGames, setTopGames] = useState<TopGame[]>([]);`;
const newStateDecl = `  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [topGames, setTopGames] = useState<TopGame[]>([]);
  const [popularRepackIds, setPopularRepackIds] = useState<string[]>([]);`;

if (code.includes(stateDecl)) {
  code = code.replace(stateDecl, newStateDecl);
} else {
  console.log("Could not find state declaration");
}

// 2. Parse popularrepacks
const topGamesParse = `      // Handle Top Games
      const topGamesKey = Object.keys(data).find(k => k.toLowerCase().replace(/\\s+/g, '') === 'topgames');`;

const newParse = `      // Handle Popular Repacks
      const popularKey = Object.keys(data).find(k => k.toLowerCase().replace(/\\s+/g, '').includes('popularrepack') || k.toLowerCase().replace(/\\s+/g, '') === 'mostpopular');
      if (popularKey && Array.isArray(data[popularKey])) {
          const ids: string[] = [];
          data[popularKey].forEach((row: any) => {
             // Search all values in row for something that looks like an ID, or just extract the first column
             // Sometimes users name columns 'id', 'game', 'hypervisor'
             Object.values(row).forEach((val: any) => {
                if (val && typeof val === 'string' && val.trim() !== '') {
                    // split by comma if they put multiple
                    val.split(',').forEach((v: string) => ids.push(v.trim()));
                } else if (val && typeof val === 'number') {
                    ids.push(String(val));
                }
             });
          });
          setPopularRepackIds(Array.from(new Set(ids)));
      } else {
          setPopularRepackIds([]);
      }

      // Handle Top Games
      const topGamesKey = Object.keys(data).find(k => k.toLowerCase().replace(/\\s+/g, '') === 'topgames');`;

if (code.includes(topGamesParse)) {
  code = code.replace(topGamesParse, newParse);
} else {
  console.log("Could not find topGames parse");
}

// 3. Exclude popularrepacks from standard parsing
const excludeLine = `else if (normalizedKey.includes('upcoming') || normalizedKey.includes('steamaccounts') || normalizedKey.includes('mastergift') || normalizedKey.includes('profil') || normalizedKey.includes('topgames')) { return; }`;
const newExcludeLine = `else if (normalizedKey.includes('upcoming') || normalizedKey.includes('steamaccounts') || normalizedKey.includes('mastergift') || normalizedKey.includes('profil') || normalizedKey.includes('topgames') || normalizedKey.includes('popularrepack')) { return; }`;

if (code.includes(excludeLine)) {
  code = code.replace(excludeLine, newExcludeLine);
} else {
  console.log("Could not find exclude line");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Patched state and parsing in SecretArea.tsx");
