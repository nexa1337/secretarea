const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

content = content.replace(
  /setError\("CRITICAL ERROR: Google Apps Script Connection Failed and no local backup could be found."\);/,
  `setError("CRITICAL ERROR: Google Apps Script Connection Failed and no local backup could be found.");
        setMaintenanceConfig(null);`
);

fs.writeFileSync('pages/SecretArea.tsx', content);
console.log("Patched catch block to set maintenanceConfig null on critical error");
