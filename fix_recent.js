import fs from 'fs';

let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');
code = code.replace(
  'const newRecent = [item, ...recentGames.filter((g) => g.id !== item.id)].slice(0, 20);',
  `const shortItem = {
            id: item.id || '',
            name: item.name || '',
            coverImage: item.coverImage || '',
            timestamp: new Date().toISOString()
          };
          const newRecent = [shortItem, ...recentGames.filter((g) => g.id !== item.id)].slice(0, 20);`
);

code = code.replace(
  'recentGames: [item],',
  `recentGames: [{ id: item.id || '', name: item.name || '', coverImage: item.coverImage || '', timestamp: new Date().toISOString() }],`
);

fs.writeFileSync('pages/SecretArea.tsx', code);
