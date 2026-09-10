import re

with open('pages/Profile.tsx', 'r') as f:
    content = f.read()

# Restore TABS
content = re.sub(r"const TABS = \['Overview', 'Liked', 'Game history', 'Favorites'\];", "const TABS = ['Overview', 'Liked', 'Library', 'Game history', 'Favorites'];", content)

# Restore state
state_insertion = """    const [activeTab, setActiveTab] = useState('Overview');
    const [libraryTab, setLibraryTab] = useState('Playing');"""
content = re.sub(r"\s*const \[activeTab, setActiveTab\] = useState\('Overview'\);", "\n" + state_insertion, content)

# Restore UI block
library_ui = """                    {activeTab === 'Library' && (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-2">
                                {['Playing', 'Plan to Play', 'Completed', 'On Hold', 'Dropped'].map((tab) => {
                                    const count = profileData?.libraryGames?.filter((g: any) => g.status === tab).length || 0;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setLibraryTab(tab)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                                                libraryTab === tab 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {t(tab)} <span className="opacity-60 text-xs">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {(() => {
                                const filteredGames = profileData?.libraryGames?.filter((g: any) => g.status === libraryTab) || [];
                                return filteredGames.length > 0 
                                    ? <GameGrid games={filteredGames} onGameClick={handleReturnToGame} /> 
                                    : <EmptyState icon={TbDeviceGamepad2} title={t(libraryTab)} desc={t('No games in this list yet.')} />;
                            })()}
                        </div>
                    )}"""

content = re.sub(r"(\s*\{activeTab === 'Game history')", "\n" + library_ui + r"\1", content)

with open('pages/Profile.tsx', 'w') as f:
    f.write(content)

with open('pages/SecretArea.tsx', 'r') as f:
    secret_content = f.read()

# Update Google Sheet mappings
secret_content = re.sub(r"getVal\('First button \(Download with game size\)'\)", "getVal('unlock 01')", secret_content)
secret_content = re.sub(r"getVal\('2 button \(CloudDrop Mirror\)'\)", "getVal('unlock 02')", secret_content)
secret_content = re.sub(r"getVal\('3 button \(utorrent File\)'\)", "getVal('unlock 03')", secret_content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(secret_content)
