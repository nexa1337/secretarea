const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const anchor = `                    <FaArrowLeft className="rtl:rotate-180" />
                    {t("Back to Dashboard")}
                </button>`;

const replacement = `                    <FaArrowLeft className="rtl:rotate-180" />
                    {t("Back to Dashboard")}
                </button>

                {selectedGame && (
                    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
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
