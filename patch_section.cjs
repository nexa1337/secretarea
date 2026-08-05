const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `    return (
        <>
        <div className="mt-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 md:backdrop-blur-sm relative z-10 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <Icon name="Trophy" className="text-yellow-500" /> Most Popular Repacks of the Year
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-2">Community favorite releases</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {displayedGames.map((game, index) => {
                    const isHypervisor = game.category?.toLowerCase() === 'hypervisor';
                    return (
                        <motion.div 
                            key={\`\${game.id}-\${index}\`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group cursor-pointer"
                            onClick={() => onSelect(game)}
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-500/50">
                                <img 
                                    src={game.image || game.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED'} 
                                    alt={game.name} 
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 saturate-100 group-hover:saturate-150"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED';
                                    }}
                                />
                                
                                
                                
                                {isHypervisor && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-lg border border-red-400/30 group-hover:scale-110 transition-transform">
                                        HV
                                    </div>
                                )}
                                
                                
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {games.length > displayCount && (
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => setShowAllModal(true)}
                        className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                            SEE MORE GAMES 
                            <Icon name="ArrowRight" size={20} className="transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            )}
        </div>

        <MostPopularRepacksModal `;

const replacement = `    return (
        <>
        <div className="mt-12 bg-white dark:bg-slate-900/40 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800/60 md:backdrop-blur-xl relative z-10 w-full overflow-hidden shadow-xl dark:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-primary-500/5 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform">
                        <Icon name="Trophy" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                            Most Popular Repacks
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Top community favorites this year</p>
                    </div>
                </div>
                
                {games.length > displayCount && (
                    <button 
                        onClick={() => setShowAllModal(true)}
                        className="w-full sm:w-auto group relative px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2 overflow-hidden shrink-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                            SEE MORE GAMES
                            <Icon name="ArrowRight" size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 relative z-10">
                {displayedGames.map((game, index) => {
                    const isHypervisor = game.category?.toLowerCase() === 'hypervisor';
                    return (
                        <motion.div 
                            key={\`\${game.id}-\${index}\`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group cursor-pointer"
                            onClick={() => onSelect(game)}
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-500/50">
                                <img 
                                    src={game.image || game.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED'} 
                                    alt={game.name} 
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 saturate-100 group-hover:saturate-150"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED';
                                    }}
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                                
                                {isHypervisor && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-500/90 backdrop-blur-md text-white font-black text-[9px] sm:text-[10px] px-2 py-1 rounded-lg shadow-lg border border-red-400/30 group-hover:scale-110 transition-transform tracking-widest">
                                        HV
                                    </div>
                                )}
                                
                                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-black text-xs sm:text-sm line-clamp-2 leading-tight drop-shadow-md group-hover:text-blue-400 transition-colors">
                                        {game.name || game.title}
                                    </h3>
                                    {game.repackSize && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-md rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Icon name="HardDrive" size={10} className="text-white/80" />
                                            <span className="text-[9px] font-bold text-white tracking-wider">{game.repackSize}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        <MostPopularRepacksModal `;

if(content.includes(targetStr)) {
  content = content.replace(targetStr, replacement);
  fs.writeFileSync(file, content);
  console.log('patched');
} else {
  console.log('target string not found in file');
}
