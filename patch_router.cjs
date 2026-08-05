const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = content.replace("HashRouter as Router", "BrowserRouter as Router");
fs.writeFileSync('App.tsx', content);
console.log('patched router');
