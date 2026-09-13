
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbTrash } from 'react-icons/tb';
import { FaAngleLeft, FaAngleRight, FaArrowLeft } from 'react-icons/fa6';

const TABS = ['Overview', 'Liked', 'Library', 'Game history', 'Favorites'];
const LIBRARY_STATUSES = ['Playing', 'Plan to Play', 'Completed', 'On Hold', 'Dropped'];

const ALL_BADGES = [
  { id: 'first_blood', name: 'First Blood', description: 'View your first game', icon: '🩸', condition: (data: any) => data.gamesViewed >= 1 },
  { id: 'explorer', name: 'Explorer', description: 'View 10 different games', icon: '🗺️', condition: (data: any) => data.gamesViewed >= 10 },
  { id: 'enthusiast', name: 'Enthusiast', description: 'View 50 different games', icon: '🔥', condition: (data: any) => data.gamesViewed >= 50 },
  { id: 'critic', name: 'Critic', description: 'Like your first game', icon: '👍', condition: (data: any) => data.contentLiked >= 1 },
  { id: 'fanboy', name: 'Fanboy', description: 'Like 10 games', icon: '❤️', condition: (data: any) => data.contentLiked >= 10 },
  { id: 'pup', name: 'Rising Pup', description: 'Reach Pup Wolf rank', icon: '🐺', condition: (data: any) => data.points >= 50000 },
  { id: 'loyal', name: 'Loyal Member', description: 'Earn 100,000 points', icon: '🛡️', condition: (data: any) => data.points >= 100000 },
  { id: 'alpha', name: 'The Alpha', description: 'Reach Alpha Wolf rank', icon: '👑', condition: (data: any) => data.points >= 600000 },
];

const Profile: React.FC = () => {
    const { t, dir } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [libraryTab, setLibraryTab] = useState('Playing');
    
    // Pagination for Game history
    const [historyPage, setHistoryPage] = useState(1);
    const historyPerPage = 12;

    const isUnlocked = localStorage.getItem('secret_area_unlocked') === 'true';

    useEffect(() => {
        if (!isUnlocked) {
            navigate('/');
        }
    }, [isUnlocked, navigate]);

    if (!isUnlocked) return null;

    const profileData = {
        displayName: 'Wolfspace User',
        email: 'user@wolfspace.com',
        role: 'admin',
        points: 0,
        gamesViewed: 0,
        contentLiked: 0,
        recentGames: [],
        likedGames: [],
        libraryGames: [],
        favoriteGames: []
    };

    const earnedBadges = ALL_BADGES.filter(b => b.condition(profileData));
    const liked = profileData.likedGames || [];
    const library = profileData.libraryGames || [];
    const history = profileData.recentGames || [];
    const favorites = profileData.favoriteGames || [];
    const libraryFiltered = library.filter((g: any) => g.status === libraryTab);
    const tabsToRender = TABS;

    // Recent Activity (last 24 hours, max 4)
    const recentActivity = history
        .filter((g: any) => (Date.now() - new Date(g.timestamp || 0).getTime()) < 24 * 60 * 60 * 1000)
        .slice(0, 4);

    // History Pagination
    const idxLastHistory = historyPage * historyPerPage;
    const idxFirstHistory = idxLastHistory - historyPerPage;
    const currentHistory = history.slice(idxFirstHistory, idxLastHistory);
    const totalHistoryPages = Math.ceil(history.length / historyPerPage);

    const EmptyState = () => (
        <div className="flex justify-center items-center py-24">
            <p className="text-slate-500 dark:text-[#8892b0] text-[15px]">{t("No games in this list yet.")}</p>
        </div>
    );

    const GameGrid = ({ games, onGameClick }: { games: any[], onGameClick: (g: any) => void }) => {
        if (!games || games.length === 0) return null;
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {games.map((game, i) => (
                    <div key={i} onClick={() => onGameClick(game)} className="relative aspect-[3/4] rounded-lg overflow-hidden group cursor-pointer bg-white dark:bg-[#111623] hover:ring-2 hover:ring-[#29aaea] transition-all">
                        <img src={game.coverImage || game.background_image || game.image} alt={game.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100" />
                        <div className="absolute bottom-3 start-3 end-3 text-start">
                            <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">{game.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] pt-24 pb-12 font-sans text-slate-900 dark:text-white transition-colors duration-200" dir={dir}>
            <div className="max-w-[1200px] mx-auto px-6">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-slate-500 dark:text-[#8892b0] hover:text-[#29aaea] dark:hover:text-[#29aaea] font-medium transition-colors mb-6"
                >
                    <FaArrowLeft className="rtl:rotate-180" />
                    {t("Back to Dashboard")}
                </button>

                {/* Banner & Header */}
                <div className="relative mb-24 mt-2">
                    {/* Banner */}
                    <div className="h-48 md:h-[220px] rounded-xl w-full bg-[#29aaea] overflow-hidden shadow-lg shadow-[#29aaea]/10 border border-slate-200 dark:border-slate-800/50">
                    </div>
                    
                    {/* Avatar & Username */}
                    <div className="absolute -bottom-14 start-8 md:start-12 flex items-end gap-6">
                        <div className="w-[120px] h-[120px] rounded-full border-[6px] border-slate-50 dark:border-[#070b14] bg-[#29aaea] flex items-center justify-center text-[54px] font-semibold text-white overflow-hidden z-10 shadow-xl transition-colors duration-200">
                            W
                        </div>
                        <div className="mb-[18px]">
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{profileData.displayName}</h1>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800/60 mb-10 overflow-x-auto no-scrollbar px-2">
                    {tabsToRender.map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => { setActiveTab(tab); setHistoryPage(1); }}
                            className={`pb-4 text-[15px] font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'text-[#29aaea] border-[#29aaea]' : 'text-slate-500 dark:text-[#8892b0] border-transparent hover:text-slate-800 dark:hover:text-slate-300'}`}
                        >
                            {t(tab)}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px] px-2 text-start">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* OVERVIEW TAB */}
                            {activeTab === 'Overview' && (
                                <div className="space-y-12">
                                    <div>
                                        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Overview")}</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white dark:bg-[#111623] p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none transition-colors">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8892b0] mb-2">{t("Total Points")}</div>
                                                <div className="text-3xl font-bold text-[#29aaea]">{profileData.points || 0}</div>
                                            </div>
                                            <div className="bg-white dark:bg-[#111623] p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none transition-colors">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8892b0] mb-2">{t("Games Viewed")}</div>
                                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.gamesViewed || 0}</div>
                                            </div>
                                            <div className="bg-white dark:bg-[#111623] p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none transition-colors">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8892b0] mb-2">{t("Games Liked")}</div>
                                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.contentLiked || 0}</div>
                                            </div>
                                            <div className="bg-white dark:bg-[#111623] p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none transition-colors">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8892b0] mb-2">{t("Badges Earned")}</div>
                                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{earnedBadges.length}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div>
                                        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Recent Activity")} (24h)</h2>
                                        {recentActivity.length > 0 ? (
                                            <GameGrid games={recentActivity} onGameClick={(g) => navigate(`/roadmap/${g.id || g.slug}`)} />
                                        ) : (
                                            <div className="bg-white dark:bg-[#111623] p-6 rounded-xl border border-slate-200 dark:border-slate-800/50 text-center text-slate-500 dark:text-[#8892b0] shadow-sm dark:shadow-none">
                                                {t("No recent activity in the last 24 hours.")}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Achievements & Badges")}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {ALL_BADGES.map(badge => {
                                                const isEarned = badge.condition(profileData);
                                                return (
                                                    <div key={badge.id} className={`p-5 rounded-xl border transition-all ${isEarned ? 'bg-slate-50 dark:bg-[#1a2333] border-[#29aaea]/30 shadow-sm' : 'bg-white dark:bg-[#111623] border-slate-200 dark:border-slate-800/50 opacity-50 grayscale'}`}>
                                                        <div className="text-3xl mb-3">{badge.icon}</div>
                                                        <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{t(badge.name)}</div>
                                                        <div className="text-xs text-slate-500 dark:text-[#8892b0]">{t(badge.description)}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LIKED TAB */}
                            {activeTab === 'Liked' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Liked")}</h2>
                                    {liked.length > 0 ? <GameGrid games={liked} onGameClick={(g) => navigate(`/roadmap/${g.id || g.slug}`)} /> : <EmptyState />}
                                </div>
                            )}

                            {/* LIBRARY TAB */}
                            {activeTab === 'Library' && (
                                <div>
                                    <h2 className="text-[22px] font-semibold mb-6 text-slate-900 dark:text-white">{t("Library")}</h2>
                                    
                                    <div className="flex flex-wrap gap-[10px] mb-12">
                                        {LIBRARY_STATUSES.map(status => {
                                            const count = library.filter((g: any) => g.status === status).length;
                                            const isActive = libraryTab === status;
                                            return (
                                                <button 
                                                    key={status}
                                                    onClick={() => setLibraryTab(status)}
                                                    className={`px-[18px] py-[6px] rounded-full text-[14px] transition-all ${isActive ? 'bg-[#29aaea] text-white font-medium shadow-md shadow-[#29aaea]/20' : 'bg-slate-200 dark:bg-[#1e2432] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-[#2a3143]'}`}
                                                >
                                                    {t(status)} <span className={isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-500 font-normal'}>({count})</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {libraryFiltered.length > 0 ? <GameGrid games={libraryFiltered} onGameClick={(g) => navigate(`/roadmap/${g.id || g.slug}`)} /> : <EmptyState />}
                                </div>
                            )}

                            {/* GAME HISTORY TAB */}
                            {activeTab === 'Game history' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Game history")}</h2>
                                    {history.length > 0 ? (
                                        <>
                                            <GameGrid games={currentHistory} onGameClick={(g) => navigate(`/roadmap/${g.id || g.slug}`)} />
                                            {totalHistoryPages > 1 && (
                                                <div className="flex items-center justify-between mt-10 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                                                    <div className="text-sm text-slate-500 dark:text-[#8892b0]">{t("Showing")} {idxFirstHistory + 1} {t("to")} {Math.min(idxLastHistory, history.length)} {t("of")} {history.length}</div>
                                                    <div className="flex gap-2" dir="ltr">
                                                        <button onClick={() => setHistoryPage(p => Math.max(1, p - 1))} disabled={historyPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#111623] border border-slate-200 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-[#1a2333] text-slate-700 dark:text-white disabled:opacity-50"><FaAngleLeft /></button>
                                                        <button onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))} disabled={historyPage === totalHistoryPages} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#111623] border border-slate-200 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-[#1a2333] text-slate-700 dark:text-white disabled:opacity-50"><FaAngleRight /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : <EmptyState />}
                                </div>
                            )}

                            {/* FAVORITES TAB */}
                            {activeTab === 'Favorites' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Favorites")}</h2>
                                    {favorites.length > 0 ? <GameGrid games={favorites} onGameClick={(g) => navigate(`/roadmap/${g.id || g.slug}`)} /> : <EmptyState />}
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;
