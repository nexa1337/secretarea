const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf-8');

// We just want to make sure processRawData is called with whatever loadedData we get, so maintenanceConfig gets set.
// Actually, processRawData(loadedData) is already called in the catch block if fallback is used! Let's verify.
