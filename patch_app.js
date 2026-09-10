const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

if (!code.includes('import Profile')) {
    code = code.replace("import Disclaimer from './pages/Disclaimer';", "import Disclaimer from './pages/Disclaimer';\nimport Profile from './pages/Profile';");
    code = code.replace("<Route path=\"/disclaimer\" element={<Disclaimer />} />", "<Route path=\"/disclaimer\" element={<Disclaimer />} />\n              <Route path=\"/profile\" element={<Profile />} />");
    fs.writeFileSync('App.tsx', code);
}
