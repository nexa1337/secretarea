const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const oldState = `const [maintenanceConfig, setMaintenanceConfig] = useState<{active: boolean, endTime: string | null, message: string} | null | undefined>(() => {
    try {
        const cached = localStorage.getItem('cached_secret_resources');
        if (cached) {
            const data = JSON.parse(cached);
            const maintenanceKey = Object.keys(data).find(k => k.toLowerCase() === 'maintenance');
            if (maintenanceKey && Array.isArray(data[maintenanceKey]) && data[maintenanceKey].length > 0) {
                const config = data[maintenanceKey][0];
                const isActiveStr = String(config.active || '').toLowerCase().trim();
                if (isActiveStr === 'true' || isActiveStr === 'yes' || isActiveStr === '1' || config.active === true) {
                    return {
                        active: true,
                        endTime: config.time || config.endTime || config.date || null,
                        message: config.message || "Our website is under temporary maintenance, we will be back soon :)"
                    };
                }
            }
            // If cache exists but maintenance is not active, return null
            return null;
        }
    } catch (e) {}
    // If no cache, return undefined to show spinner
    return undefined;
  });`;

const newState = `const [maintenanceConfig, setMaintenanceConfig] = useState<{active: boolean, endTime: string | null, message: string} | null | undefined>(undefined);`;

if (code.includes(oldState)) {
    code = code.replace(oldState, newState);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Patched maintenanceConfig initialization back to undefined");
} else {
    console.log("Could not find oldState");
}
