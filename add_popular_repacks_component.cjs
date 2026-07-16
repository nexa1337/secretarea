const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const componentCode = `
const MostPopularRepacksSection: React.FC<{ 
    gameIds: string[], 
    allResources: Record<string, ResourceItem[]>,
    onSelect: (item: ResourceItem) => void
}> = ({ gameIds, allResources, onSelect }) => {
    
    // Find games based on IDs
    const games = useMemo(() => {
        const allItems = Object.values(allResources).flat();
        return gameIds.map(id => allItems.find(i => String(i.id).toLowerCase() === String(id).toLowerCase())).filter(Boolean) as ResourceItem[];
    }, [gameIds, allResources]);

    if (!games || games.length === 0) return null;

    return (
        <div className="mt-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 md:backdrop-blur-sm relative z-10 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <Icon name="Trophy" className="text-yellow-500" /> Most Popular Repacks of the Year
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2">Community favorite releases</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {games.map((game, index) => (
                    <motion.div 
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => onSelect(game)}
                    >
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-blue-500/20">
                            <img 
                                src={game.image || game.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED'} 
                                alt={game.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                            
                            {/* Dynamic Ranking Number */}
                            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/90 backdrop-blur-md text-white font-black text-sm sm:text-lg flex items-center justify-center rounded-xl shadow-lg border border-white/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                                #{index + 1}
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight drop-shadow-md">
                                    {game.name}
                                </h3>
                                <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded backdrop-blur-sm border border-blue-500/30">
                                        View Details
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

`;

const targetIndex = code.indexOf('const TopGamesSection: React.FC');
if (targetIndex !== -1) {
    code = code.substring(0, targetIndex) + componentCode + code.substring(targetIndex);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Added MostPopularRepacksSection");
} else {
    console.log("Could not find TopGamesSection to inject before it");
}
