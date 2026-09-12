const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const target = `{selectedGame && (
                    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
                        <ResourceDetailModal
                            item={selectedGame}
                            onClose={() => setSelectedGame(null)}
                            stash={favorites.map((f: any) => f.id)}
                            toggleStash={() => {}}
                            isGuestMode={false}
                            allResources={{}}
                            globalSpecs={profileData?.pcSpecs || { ram: 16, os: '10', cpuModel: 'Core i5-12400', gpuModel: 'GeForce RTX 3060', isActive: false }}
                        />
                    </div>
                )}`;

if (code.includes(target)) {
    code = code.replace(target, "");
    fs.writeFileSync('pages/Profile.tsx', code);
    console.log("Removed Modal from Profile.tsx");
} else {
    console.log("Target not found");
}
