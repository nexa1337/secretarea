import React, { useEffect, useState } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { auth, db } from '../src/firebase';
import { doc, onSnapshot, setDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { TbTrophy, TbEye, TbHeart, TbCalendar, TbBolt, TbLock, TbClock, TbDeviceGamepad2, TbBookmarks, TbThumbUp, TbHistory, TbInfoCircle, TbUsers } from 'react-icons/tb';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

const TABS = ['Overview', 'Liked', 'Library', 'Game history', 'Favorites'];

const RANKS = [
  { name: 'Cub Wolf', points: 0, icon: '🌟' },
  { name: 'Pup Wolf', points: 50000, icon: '⚔️' },
  { name: 'Juvenile Wolf', points: 100000, icon: '🛡️' },
  { name: 'Subordinate Wolf', points: 250000, icon: '💎' },
  { name: 'Beta Wolf', points: 450000, icon: '👑' },
  { name: 'Alpha Wolf', points: 600000, icon: '🔥' },
];

const ALL_BADGES = [
  { id: 'first_blood', name: 'First Blood', description: 'View your first game', icon: '🩸', condition: (data) => data.gamesViewed >= 1 },
  { id: 'explorer', name: 'Explorer', description: 'View 10 different games', icon: '🗺️', condition: (data) => data.gamesViewed >= 10 },
  { id: 'enthusiast', name: 'Enthusiast', description: 'View 50 different games', icon: '🔥', condition: (data) => data.gamesViewed >= 50 },
  { id: 'critic', name: 'Critic', description: 'Like your first game', icon: '👍', condition: (data) => data.contentLiked >= 1 },
  { id: 'fanboy', name: 'Fanboy', description: 'Like 10 games', icon: '❤️', condition: (data) => data.contentLiked >= 10 },
  { id: 'pup', name: 'Rising Pup', description: 'Reach Pup Wolf rank', icon: '🐺', condition: (data) => data.points >= 50000 },
  { id: 'loyal', name: 'Loyal Member', description: 'Earn 100,000 points', icon: '🛡️', condition: (data) => data.points >= 100000 },
  { id: 'alpha', name: 'The Alpha', description: 'Reach Alpha Wolf rank', icon: '👑', condition: (data) => data.points >= 600000 },
];

const EmptyState = ({ icon: IconCmp, title, desc }) => (
    <div className="bg-white dark:bg-[#111623] rounded-2xl p-12 shadow-sm border border-slate-200 dark:border-slate-800/50 flex flex-col items-center justify-center text-center">
        <IconCmp size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">{desc}</p>
    </div>
);

const GameGrid = ({ games, onGameClick }) => {
    if (!games || games.length === 0) return null;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game, i) => (
                <div key={i} onClick={() => onGameClick(game)} className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                    <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 start-3 end-3">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2">{game.name}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Profile: React.FC = () => {
    const { t, dir } = useLanguage();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');
    const [libraryTab, setLibraryTab] = useState('Playing');
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(allUsers.length / usersPerPage);


    useEffect(() => {
        if (activeTab === 'Admin Users' && profileData?.role === 'admin' && allUsers.length === 0) {
            const fetchUsers = async () => {
                setLoadingUsers(true);
                try {
                    const usersSnap = await getDocs(collection(db, 'SecretArea'));
                    const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    // sort by createdAt desc
                    usersData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                    setAllUsers(usersData);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
                setLoadingUsers(false);
            };
            fetchUsers();
        }
    }, [activeTab, profileData, allUsers.length]);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, 'SecretArea', currentUser.uid);
                if (!localStorage.getItem('wiped_favorites_once_1337')) { import('firebase/firestore').then(({updateDoc}) => updateDoc(docRef, { favoriteGames: [] }).then(() => localStorage.setItem('wiped_favorites_once_1337', 'true')).catch(console.error)); }
                
                // Real-time listener for profile data updates
                const unsubscribeDoc = onSnapshot(docRef, async (docSnap) => {
                    let data = docSnap.exists() ? docSnap.data() : null;
                    if (!data) {
                        data = {
                            email: currentUser.email,
                            displayName: currentUser.displayName,
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
                        await setDoc(docRef, data);
                    } else {
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
                });
                return () => unsubscribeDoc();
            } else {
                navigate('/');
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, [navigate]);

    if (loading) {
        return <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-white dark:bg-[#0a0f18]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }
    if (!user || !profileData) return null;

    const initial = user?.displayName?.[0] || user?.email?.[0] || 'A';
    const bgColor = '#29b6f6';
    
    const memberSince = new Date(profileData.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let currentRankIndex = 0;
    for (let i = 0; i < RANKS.length; i++) {
        if (profileData.points >= RANKS[i].points) {
            currentRankIndex = i;
        } else {
            break;
        }
    }
    const currentRank = RANKS[currentRankIndex];
    const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
    const progressPercent = nextRank 
        ? Math.min(100, Math.max(0, ((profileData.points - currentRank.points) / (nextRank.points - currentRank.points)) * 100))
        : 100;
    const pointsNeeded = nextRank ? nextRank.points - profileData.points : 0;

    // Calculate badges
    const earnedBadges = ALL_BADGES.filter(badge => badge.condition(profileData));

    const handleReturnToGame = (game) => {
        navigate('/', { state: { openGameId: game.id } });
        return;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060a11] text-slate-900 dark:text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div dir={dir} className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate('/')} 
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    {dir === 'rtl' ? <FaAngleRight /> : <FaAngleLeft />}
                    {t('Back to Dashboard') || 'Back to Dashboard'}
                </button>

                {/* Header Banner */}
                <div className="mb-10">
                    <div className="aspect-[1983/793] rounded-t-2xl sm:rounded-t-3xl w-full overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                        <img 
                            src="/images/userprofile.png" 
                            alt="Profile Banner" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.classList.add('bg-gradient-to-r', 'from-[#29b6f6]', 'to-[#039be5]');
                                }
                            }}
                        />
                    </div>
                                                            <div className="px-4 sm:px-10 relative z-10 mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                            <div 
                                className="-mt-12 sm:-mt-16 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 dark:border-[#060a11] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg overflow-hidden shrink-0"
                                style={{ backgroundColor: bgColor }}
                            >
                                {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : initial.toUpperCase()}
                            </div>
                            <div className="pt-2 sm:pt-4 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{user.displayName || user.email.split('@')[0]}</h1>
                                    {profileData?.bio && (
                                        <p className="mt-1 text-slate-600 dark:text-slate-400 max-w-xl text-sm leading-relaxed">{profileData.bio}</p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: `${user.displayName || 'My'}'s Profile`,
                                                text: 'Check out my N E X A 1337 profile!',
                                                url: window.location.href
                                            });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            alert('Profile link copied to clipboard!');
                                        }
                                    }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700 shrink-0"
                                >
                                    <Icon name="Share2" size={16} /> Share Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800/60 mb-8 hide-scrollbar">
                    {(profileData?.role === 'admin' ? [...TABS, 'Admin Users'] : TABS).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'text-[#29b6f6]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                            {t(tab) || tab}
                            {activeTab === tab && (
                                <motion.div 
                                    layoutId="profileTab" 
                                    className="absolute bottom-0 inset-x-0 h-0.5 bg-[#29b6f6]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'Overview' && (
                        <div className="space-y-6 sm:space-y-8">
                            {/* Statistics */}
                            <div className="bg-white dark:bg-[#111623] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <TbBolt size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold">{t('SecretArea Statistics')}</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {/* Points */}
                                    <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                                <TbBolt size={18} />
                                            </div>
                                            <span className="text-xs font-medium text-indigo-400">+ {t('Live')}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.points}</span>
                                            <span className="text-sm text-slate-400">{t('pts')}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{t('Total Points Earned')}</p>
                                    </div>
                                    
                                    {/* Viewed */}
                                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                <TbEye size={18} />
                                            </div>
                                            <span className="text-xs font-medium text-purple-400">+ {t('Live')}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.gamesViewed}</span>
                                            <span className="text-sm text-slate-400">{t('games')}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{t('Total Games Viewed')}</p>
                                    </div>
                                    
                                    {/* Liked */}
                                    <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                                                <TbHeart size={18} />
                                            </div>
                                            <span className="text-xs font-medium text-rose-400">+ {t('Live')}</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{profileData.contentLiked}</span>
                                            <span className="text-sm text-slate-400">{t('likes')}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{t('Content Liked')}</p>
                                    </div>
                                    
                                    {/* Member Since */}
                                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                                <TbCalendar size={18} />
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2 w-full">
                                            <span className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white truncate">{memberSince}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{t('Member Since')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress to Next Rank */}
                            <div className="bg-white dark:bg-[#111623] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/50">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-[#1a1f2e] p-3 pe-6 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                        <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-2xl shadow-inner">
                                            {currentRank.icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{t(currentRank.name)}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{profileData.points} {t('Points')}</div>
                                        </div>
                                    </div>
                                    {nextRank && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">{t('Next Rank')}:</span>
                                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1f2e] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 font-medium">
                                                <span>{nextRank.icon}</span> {t(nextRank.name)}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Rank Path */}
                                <div className="relative pt-4 pb-8 overflow-x-auto hide-scrollbar w-full">
                                    <div className="flex justify-between min-w-max md:min-w-full px-2">
                                        {RANKS.map((rank, idx) => {
                                            const isCurrent = idx === currentRankIndex;
                                            const isPast = idx < currentRankIndex;
                                            const isNext = idx === currentRankIndex + 1;
                                            
                                            return (
                                                <div key={rank.name} className="relative flex flex-col items-center w-28 sm:flex-1 shrink-0">
                                                    {/* Connecting line */}
                                                    {idx < RANKS.length - 1 && (
                                                        <div className={`absolute top-[28px] start-1/2 w-full h-1 z-0 ${isPast ? 'bg-[#29b6f6]' : 'bg-slate-200 dark:bg-slate-800'}`} />
                                                    )}
                                                    
                                                    <div className={`relative z-10 p-2 sm:p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${isCurrent ? 'bg-slate-100 dark:bg-[#1a1f2e] border-2 border-[#29b6f6] shadow-lg shadow-blue-900/20 scale-110' : 'bg-transparent opacity-50'} ${isNext ? 'opacity-80' : ''}`}>
                                                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl ${isPast || isCurrent ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'} shadow-inner`}>
                                                            <div className="absolute inset-0 bg-white dark:bg-[#111623] rounded-full -z-10 border border-slate-100 dark:border-slate-800" />
                                                            {rank.icon}
                                                        </div>
                                                        <div className={`font-bold text-[10px] sm:text-sm text-center ${isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{t(rank.name)}</div>
                                                        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">{rank.points.toLocaleString()} {t('pts')}</div>
                                                        {isCurrent && <div className="absolute -bottom-2 text-[#29b6f6] text-[10px]">▲</div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Progress bar */}
                                {nextRank && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm font-medium mb-2">
                                            <span>{t('Progress to Next Rank')}</span>
                                            <span className="text-[#29b6f6]">{Math.round(progressPercent)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#29b6f6] rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            <span>{profileData.points.toLocaleString()} {t('points')}</span>
                                            <span>{pointsNeeded.toLocaleString()} {t('points needed')}</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Level Up Guide */}
                                <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <TbInfoCircle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-900 dark:text-blue-400 text-sm mb-1">{t('How to level up?')}</h4>
                                        <p className="text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed max-w-3xl">
                                            {t('Earn points by interacting with games: View (+5), Like (+5), Favorite (+2), and Download (+10). Unlocking ranks gives you special status in the community!')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements & Badges */}
                            <div className="bg-white dark:bg-[#111623] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/50">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                            <TbTrophy size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold">{t('Achievements & Badges')}</h2>
                                    </div>
                                    <div className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg text-sm font-bold border border-orange-500/20 transition-all">
                                        {earnedBadges.length} {t('Earned')}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {ALL_BADGES.map((badge) => {
                                        const isEarned = badge.condition(profileData);
                                        return (
                                            <div key={badge.id} className={`border rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all duration-500 ${isEarned ? 'bg-orange-500/5 border-orange-500/30' : 'bg-slate-50 dark:bg-[#1a1f2e] border-slate-200 dark:border-slate-800/60 opacity-60'}`}>
                                                <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-2xl ${isEarned ? 'border-orange-500/50 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-slate-300 dark:border-slate-700 text-slate-400'}`}>
                                                    {isEarned ? badge.icon : <TbLock size={20} />}
                                                </div>
                                                <div>
                                                    <div className={`font-bold ${isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{isEarned ? t(badge.name) : t('Locked')}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{isEarned ? t(badge.description) : t('Keep exploring to unlock more Badges!')}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white dark:bg-[#111623] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                                        <TbClock size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold">{t('Recent Activity')}</h2>
                                </div>
                                
                                {profileData.recentGames && profileData.recentGames.length > 0 ? (
                                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                        {profileData.recentGames.slice(0, 4).map((game, i) => (
                                            <div key={i} onClick={() => handleReturnToGame(game)} className="w-40 sm:w-48 lg:w-56 shrink-0 relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                                <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-3 start-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white">
                                                    {t('Viewed')}
                                                </div>
                                                <div className="absolute bottom-4 inset-x-4">
                                                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{game.name}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">{t('No recent activity yet. Go explore some games!')}</div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'Liked' && (
                        profileData.likedGames && profileData.likedGames.length > 0 
                            ? <GameGrid games={profileData.likedGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbThumbUp} title={t('Liked')} desc={t('Keep exploring to unlock more Badges!')} />
                    )}
                    {activeTab === 'Library' && (
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
                    )}

                    {activeTab === 'Game history' && (
                        profileData.recentGames && profileData.recentGames.length > 0 
                            ? <GameGrid games={profileData.recentGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbHistory} title={t('Game history')} desc={t('No recent activity yet. Go explore some games!')} />
                    )}

                    {activeTab === 'Favorites' && (
                        profileData.favoriteGames && profileData.favoriteGames.length > 0 
                            ? <GameGrid games={profileData.favoriteGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbBookmarks} title={t('Favorites')} desc={t('Keep exploring to unlock more Badges!')} />
                    )}

                    {activeTab === 'Admin Users' && profileData?.role === 'admin' && (
                        <div className="bg-white dark:bg-[#111623] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/50 overflow-hidden">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <TbUsers size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{t('Admin Dashboard - Users')}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Users: {allUsers.length}</p>
                                </div>
                            </div>
                            
                            {loadingUsers ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : (
                                <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">User</th>
                                                <th className="px-6 py-4 font-semibold">Email</th>
                                                <th className="px-6 py-4 font-semibold">Role</th>
                                                <th className="px-6 py-4 font-semibold">Joined</th>
                                                <th className="px-6 py-4 font-semibold">Stats</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                                            {currentUsers.map((u, i) => (
                                                <tr key={u.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                                                                {u.displayName?.[0] || u.email?.[0]?.toUpperCase() || '?'}
                                                            </div>
                                                            <span className="font-medium text-slate-900 dark:text-white">
                                                                {u.displayName || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                        {u.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                            {u.role || 'visitor'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <span title="Points" className="flex items-center gap-1"><TbBolt size={14} className="text-yellow-500" /> {u.points || 0}</span>
                                                            <span title="Games Viewed" className="flex items-center gap-1"><TbEye size={14} className="text-purple-500" /> {u.gamesViewed || 0}</span>
                                                            <span title="Liked" className="flex items-center gap-1"><TbHeart size={14} className="text-rose-500" /> {u.contentLiked || 0}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 border-t border-slate-200 dark:border-slate-700/60 pt-4">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Showing {allUsers.length > 0 ? indexOfFirstUser + 1 : 0} to {Math.min(indexOfLastUser, allUsers.length)} of {allUsers.length} users
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaAngleLeft size={14} />
                                            </button>
                                            <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                                            <button 
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaAngleRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                </>
                            )}
                        </div>
                    )}

                </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
