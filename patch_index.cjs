const fs = require('fs');
let content = fs.readFileSync('index.tsx', 'utf8');
content = content.replace("import App from './App';", "import App from './App';\nimport { HelmetProvider } from 'react-helmet-async';");
content = content.replace("<App />", "<HelmetProvider>\n      <App />\n    </HelmetProvider>");
fs.writeFileSync('index.tsx', content);
console.log('patched index.tsx');
