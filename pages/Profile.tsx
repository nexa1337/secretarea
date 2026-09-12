
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { auth, db } from '../src/firebase';
import { doc, onSnapshot, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbTrash } from 'react-icons/tb';
import { FaAngleLeft, FaAngleRight, FaArrowLeft } from 'react-icons/fa6';
import { ResourceDetailModal } from './SecretArea';

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
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [libraryTab, setLibraryTab] = useState('Playing');
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const handleGameClick = (g: any) => {
        navigate('/', { state: { openGameId: g.id } });
    };
    
    // Pagination for Game history
    const [historyPage, setHistoryPage] = useState(1);
    const historyPerPage = 12;

    // Admin state
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [searchUserTerm, setSearchUserTerm] = useState('');
    const [copied, setCopied] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    
    const filteredUsers = allUsers.filter(u => 
        (u.displayName || '').toLowerCase().includes(searchUserTerm.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(searchUserTerm.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(searchUserTerm.toLowerCase())
    );
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    
    useEffect(() => {
        let unsub = () => {};
        if (activeTab === 'Admin Users' && profileData?.role === 'admin') {
            setLoadingUsers(true);
            unsub = onSnapshot(collection(db, 'SecretArea'), (snap) => {
                const usersData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                usersData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                setAllUsers(usersData);
                setLoadingUsers(false);
            }, (err) => {
                console.error("Error fetching users:", err);
                setLoadingUsers(false);
            });
        }
        return () => unsub();
    }, [activeTab, profileData]);


    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm(t("Are you sure you want to remove this user profile?"))) return;
        try {
            await deleteDoc(doc(db, 'SecretArea', userId));
            setAllUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert(t("Error removing user."));
        }
    };

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, 'SecretArea', currentUser.uid);
                
                const loadProfile = async () => {
                    const defaultData = {
                        email: currentUser.email,
                        displayName: currentUser.displayName || 'Unknown',
                        createdAt: new Date().toISOString(),
                        role: currentUser.email === 'marouananouar02@gmail.com' ? 'admin' : 'visitor',
                        points: 0,
                        gamesViewed: 0,
                        contentLiked: 0,
                        recentGames: [],
                        likedGames: [],
                        libraryGames: [],
                        favoriteGames: []
                    };

                    let unsubscribeDoc = () => {};

                    try {
                        const { getDoc } = await import('firebase/firestore');
                        const docSnap = await getDoc(docRef);
                        let data = docSnap.exists() ? docSnap.data() : null;
                        
                        if (!data) {
                            try {
                                await setDoc(docRef, defaultData);
                                data = defaultData;
                            } catch(e) {
                                console.error("Failed to create profile: ", e);
                                data = defaultData; 
                            }
                        } else {
                            
                            if (!data.email && currentUser.email) {
                                import('firebase/firestore').then(({updateDoc}) => updateDoc(docRef, { email: currentUser.email }).catch(console.error));
                                data.email = currentUser.email;
                            }
                            if (currentUser.email === 'marouananouar02@gmail.com' && data.role !== 'admin') {
                                import('firebase/firestore').then(({updateDoc}) => updateDoc(docRef, { role: 'admin' }).catch(console.error));
                                data.role = 'admin';
                            }
                            if (data.points === undefined) data.points = 0;
                            if (data.gamesViewed === undefined) data.gamesViewed = 0;
                            if (data.contentLiked === undefined) data.contentLiked = 0;
                            if (!data.recentGames) data.recentGames = [];
                            if (!data.likedGames) data.likedGames = [];
                            if (!data.libraryGames) data.libraryGames = [];
                            if (!data.favoriteGames) data.favoriteGames = [];
                        }
                        
                        setProfileData(data);
                        setLoading(false);

                        unsubscribeDoc = onSnapshot(docRef, (snap) => {
                            if (snap.exists()) setProfileData(snap.data());
                        }, (err) => {
                            console.error("Snapshot error caught silently:", err);
                        });
                    } catch (err) {
                        console.error("Critical error loading profile:", err);
                        setProfileData(defaultData);
                        setLoading(false);
                    }
                    return unsubscribeDoc;
                };
                
                let unsub = () => {};
                loadProfile().then(u => unsub = u);
                return () => unsub();
            } else {
                navigate('/');
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, [navigate]);

    if (loading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] pt-24 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#29aaea]"></div></div>;
    }

    if (!user) return <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] pt-24 text-center text-slate-900 dark:text-white">{t("Please log in.")}</div>;
    if (!profileData) return <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] pt-24 text-center text-rose-500">{t("Error loading profile data. (Rules updated, please refresh the page!)")}</div>;

    const earnedBadges = ALL_BADGES.filter(b => b.condition(profileData));
    const liked = profileData.likedGames || [];
    const library = profileData.libraryGames || [];
    const history = profileData.recentGames || [];
    const favorites = profileData.favoriteGames || [];
    const libraryFiltered = library.filter((g: any) => g.status === libraryTab);
    const tabsToRender = profileData.role === 'admin' ? [...TABS, 'Admin Users'] : TABS;

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
                <div className="relative mb-16 mt-2">
                    {/* Banner */}
                    <div className="aspect-[1983/793] max-h-[300px] md:max-h-[400px] rounded-xl w-full bg-[#070b14] overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800/50 flex items-center justify-center">
                        <img src={profileData?.banner || '/images/userprofile.png'} alt="Banner" className="w-full h-full object-contain md:object-cover" />
                    </div>
                    
                    {/* Avatar */}
                    <div className="absolute -bottom-14 start-8 md:start-12">
                        <div className="w-[120px] h-[120px] rounded-full border-[6px] border-slate-50 dark:border-[#070b14] bg-[#29aaea] flex items-center justify-center text-[54px] font-semibold text-white overflow-hidden z-10 shadow-xl transition-colors duration-200">
                            {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : (user.displayName?.charAt(0) || profileData.username?.charAt(0) || user.email?.charAt(0).toUpperCase())}
                        </div>
                    </div>
                </div>

                {/* Username & Bio */}
                <div className="px-8 md:px-12 mb-10 flex flex-col items-start text-start mt-16 relative">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.displayName || profileData.username || user.email?.split('@')[0]}</h1>
                    {profileData.username && (
                        <div 
                            className="flex items-center gap-2 mt-2 cursor-pointer group bg-slate-100 dark:bg-[#111623] hover:bg-slate-200 dark:hover:bg-[#1a2333] px-3 py-1.5 rounded-lg transition-all border border-slate-200 dark:border-slate-800/50"
                            onClick={() => {
                                navigator.clipboard.writeText('@' + profileData.username);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            title="Copy username"
                        >
                            <span className="text-[#29aaea] font-bold text-sm tracking-wide">@{profileData.username}</span>
                            <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                {copied ? (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </span>
                        </div>
                    )}
                    {profileData.bio && <p className="text-slate-600 dark:text-slate-400 mt-5 max-w-2xl text-[15px] leading-relaxed border-l-2 border-[#29aaea]/30 pl-4 py-1">{profileData.bio}</p>}
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
                                            <GameGrid games={recentActivity} onGameClick={handleGameClick} />
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
                                    {liked.length > 0 ? <GameGrid games={liked} onGameClick={handleGameClick} /> : <EmptyState />}
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

                                    {libraryFiltered.length > 0 ? <GameGrid games={libraryFiltered} onGameClick={handleGameClick} /> : <EmptyState />}
                                </div>
                            )}

                            {/* GAME HISTORY TAB */}
                            {activeTab === 'Game history' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{t("Game history")}</h2>
                                    {history.length > 0 ? (
                                        <>
                                            <GameGrid games={currentHistory} onGameClick={handleGameClick} />
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
                                    {favorites.length > 0 ? <GameGrid games={favorites} onGameClick={handleGameClick} /> : <EmptyState />}
                                </div>
                            )}

                            {/* ADMIN USERS TAB */}
                            {activeTab === 'Admin Users' && profileData.role === 'admin' && (
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div className="flex flex-col">
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t("User Management")}</h2>
                                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{t("Total Users")}: {allUsers.length}</span>
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <input 
                                                type="text" 
                                                placeholder={t("Search users...") || "Search users..."}
                                                value={searchUserTerm}
                                                onChange={e => setSearchUserTerm(e.target.value)}
                                                className="w-full bg-white dark:bg-[#111623] border border-slate-200 dark:border-slate-800/50 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {loadingUsers ? (
                                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#29aaea]"></div></div>
                                    ) : (
                                        <div className="bg-white dark:bg-[#111623] rounded-xl border border-slate-200 dark:border-slate-800/50 overflow-hidden shadow-sm dark:shadow-none">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-start text-sm whitespace-nowrap">
                                                    <thead className="bg-slate-100 dark:bg-[#1a2333] text-slate-500 dark:text-[#8892b0]">
                                                        <tr>
                                                            <th className="px-6 py-4 font-semibold text-start">{t("User")}</th>
                                                            <th className="px-6 py-4 font-semibold text-start">{t("Email")}</th>
                                                            <th className="px-6 py-4 font-semibold text-start">{t("Role")}</th>
                                                            <th className="px-6 py-4 font-semibold text-start">{t("Points")}</th>
                                                            <th className="px-6 py-4 font-semibold text-start">{t("Joined")}</th>
                                                            <th className="px-6 py-4 font-semibold text-end">{t("Action")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                                                        {currentUsers.map(u => (
                                                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-[#151b2b] transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-[#29aaea] overflow-hidden flex items-center justify-center font-bold text-white shadow-sm border border-slate-200 dark:border-slate-800">
                                                                            {u.photoURL ? <img src={u.photoURL} alt={u.displayName} className="w-full h-full object-cover" /> : (u.displayName?.charAt(0) || u.email?.charAt(0).toUpperCase())}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-slate-900 dark:text-white leading-tight">{u.displayName || 'Unknown'}</span>
                                                                            {u.username && <span className="text-xs text-slate-500 dark:text-slate-400">@{u.username}</span>}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-slate-500 dark:text-[#8892b0]">{u.email || t('No email provided')}</td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md ${u.role === 'admin' ? 'bg-[#29aaea]/10 dark:bg-[#29aaea]/20 text-[#29aaea]' : 'bg-slate-200 dark:bg-[#1e2432] text-slate-500 dark:text-slate-400'}`}>
                                                                        {t(u.role)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.points || 0}</td>
                                                                <td className="px-6 py-4 text-slate-500 dark:text-[#8892b0]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                                <td className="px-6 py-4 text-end">
                                                                    <button 
                                                                        onClick={() => handleDeleteUser(u.id)}
                                                                        disabled={u.email === 'marouananouar02@gmail.com'}
                                                                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                                    >
                                                                        <TbTrash size={18} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/50">
                                            <div className="text-sm text-slate-500 dark:text-[#8892b0]">{t("Showing")} {indexOfFirstUser + 1} {t("to")} {Math.min(indexOfLastUser, allUsers.length)} {t("of")} {allUsers.length}</div>
                                            <div className="flex gap-2" dir="ltr">
                                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#111623] border border-slate-200 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-[#1a2333] text-slate-700 dark:text-white disabled:opacity-50"><FaAngleLeft /></button>
                                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-[#111623] border border-slate-200 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-[#1a2333] text-slate-700 dark:text-white disabled:opacity-50"><FaAngleRight /></button>
                                            </div>
                                        </div>
                                    )}
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
