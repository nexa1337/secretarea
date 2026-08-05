const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'SEE MORE GAMES\n                            <Icon name="ArrowRight" size={16} className="transform group-hover:translate-x-1 transition-transform" />',
  'SEE MORE GAMES\n                            <Icon name="ArrowRight" size={20} className="transform group-hover:translate-x-1 transition-transform" />'
);

content = content.replace(
  'text-xs sm:text-sm uppercase tracking-widest',
  'text-sm uppercase tracking-widest'
);

fs.writeFileSync(file, content);
console.log('patched icons');
