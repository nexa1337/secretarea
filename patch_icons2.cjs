const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<Icon name="Trophy" size={24} />',
  '<Icon name="Trophy" size={28} />'
);

content = content.replace(
  '<Icon name="HardDrive" size={10} className="text-white/80" />',
  '<Icon name="HardDrive" size={14} className="text-white/80" />'
);

content = content.replace(
  '<span className="text-[9px] font-bold text-white tracking-wider">{game.repackSize}</span>',
  '<span className="text-[10px] sm:text-xs font-bold text-white tracking-wider">{game.repackSize}</span>'
);

fs.writeFileSync(file, content);
console.log('patched icons2');
