const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetStr = `<div className="mt-8 mb-4 w-full flex justify-center">
            <AdBanner 
                desktopSrc={AD_CONFIG.banner3.desktop}`;

const replacement = `{['game', 'hypervisor', 'steamtools'].includes(activeTab) && (
            <MostPopularRepacksSection 
                gameIds={popularRepackIds}
                allResources={allResources}
                onSelect={setSelectedResource}
            />
        )}
        <div className="mt-8 mb-4 w-full flex justify-center">
            <AdBanner 
                desktopSrc={AD_CONFIG.banner3.desktop}`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Patched render with MostPopularRepacksSection");
} else {
    console.log("Could not find banner3 to inject before it");
}
