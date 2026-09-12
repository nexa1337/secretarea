const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const anchor = `                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-[#8892b0] dark:hover:text-white font-medium mb-6 transition-colors"
                >
                    <FaArrowLeft className="rtl:rotate-180" />
                    {t("Back to Dashboard")}
                </button>`;

const replacement = `                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-[#8892b0] dark:hover:text-white font-medium mb-6 transition-colors"
                >
                    <FaArrowLeft className="rtl:rotate-180" />
                    {t("Back to Dashboard")}
                </button>

                {selectedGame && (
                    <div className="fixed inset-0 z-[100]">
                        <ResourceDetailModal
                            item={selectedGame}
                            onClose={() => setSelectedGame(null)}
                            stash={favorites.map((f: any) => f.id)}
                            toggleStash={() => {}}
                            isGuestMode={false}
                            allResources={{}}
                        />
                    </div>
                )}`;

if(code.includes(anchor)) {
    code = code.replace(anchor, replacement);
    fs.writeFileSync('pages/Profile.tsx', code);
    console.log("Successfully inserted ResourceDetailModal wrapper!");
} else {
    console.log("Anchor not found.");
}
