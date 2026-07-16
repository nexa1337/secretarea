const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const startIndex = code.indexOf('const MostPopularRepacksSection: React.FC<{');
const endIndex = code.indexOf('const TopGamesSection: React.FC<{');

if (startIndex !== -1 && endIndex !== -1) {
    const newCode = `const MostPopularRepacksModal: React.FC<{
    games: ResourceItem[],
    onClose: () => void,
    onSelect: (item: ResourceItem) => void
}> = ({ games, onClose, onSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(12);
            else if (window.innerWidth < 1024) setItemsPerPage(16);
            else setItemsPerPage(20);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(games.length / itemsPerPage);
    const paginatedGames = games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 w-full max-w-7xl max-h-[90vh] sm:max-h-full rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Icon name="Trophy" className="text-yellow-600 dark:text-yellow-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Most Popular Repacks</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">All Top {games.length} Games</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <Icon name="X" size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-950/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {paginatedGames.map((game, index) => {
                            const globalIndex = (currentPage - 1) * itemsPerPage + index;
                            const isHypervisor = game.category?.toLowerCase() === 'hypervisor';
                            return (
                                <motion.div 
                                    key={game.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
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
                                        
                                        <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/90 backdrop-blur-md text-white font-black text-sm sm:text-lg flex items-center justify-center rounded-xl shadow-lg border border-white/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                                            #{globalIndex + 1}
                                        </div>

                                        {isHypervisor && (
                                            <div className="absolute top-2 right-2 z-10 bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-lg border border-red-400/30 group-hover:scale-110 transition-transform">
                                                HV
                                            </div>
                                        )}
                                        
                                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight drop-shadow-md">
                                                {game.name}
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center shrink-0">
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <Icon name="ChevronLeft" size={16} />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={\`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors \${
                                            currentPage === pageNum 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }\`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <Icon name="ChevronRight" size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const MostPopularRepacksSection: React.FC<{ 
    gameIds: string[], 
    allResources: Record<string, ResourceItem[]>,
    onSelect: (item: ResourceItem) => void
}> = ({ gameIds, allResources, onSelect }) => {
    
    const [displayCount, setDisplayCount] = useState(20);
    const [showAllModal, setShowAllModal] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setDisplayCount(8);
            else if (window.innerWidth < 1024) setDisplayCount(16);
            else setDisplayCount(20);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Find games based on IDs
    const games = useMemo(() => {
        const allItems = Object.values(allResources).flat();
        return gameIds.map(id => allItems.find(i => String(i.id).toLowerCase() === String(id).toLowerCase())).filter(Boolean) as ResourceItem[];
    }, [gameIds, allResources]);

    if (!games || games.length === 0) return null;

    const displayedGames = games.slice(0, displayCount);

    return (
        <>
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
                {displayedGames.map((game, index) => {
                    const isHypervisor = game.category?.toLowerCase() === 'hypervisor';
                    return (
                        <motion.div 
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
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

                                {isHypervisor && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-lg border border-red-400/30 group-hover:scale-110 transition-transform">
                                        HV
                                    </div>
                                )}
                                
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
                    );
                })}
            </div>

            {games.length > displayCount && (
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => setShowAllModal(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
                    >
                        See More Games <Icon name="ArrowRight" size={18} />
                    </button>
                </div>
            )}
        </div>

        <AnimatePresence>
            {showAllModal && (
                <MostPopularRepacksModal 
                    games={games} 
                    onClose={() => setShowAllModal(false)} 
                    onSelect={(game) => {
                        setShowAllModal(false);
                        onSelect(game);
                    }} 
                />
            )}
        </AnimatePresence>
        </>
    );
};

`;
    const finalCode = code.substring(0, startIndex) + newCode + code.substring(endIndex);
    fs.writeFileSync('pages/SecretArea.tsx', finalCode);
    console.log("Successfully replaced MostPopularRepacksSection");
} else {
    console.log("Could not find start or end index");
}
