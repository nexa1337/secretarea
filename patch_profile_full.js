import fs from 'fs';

const code = `import React, { useEffect, useState } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { auth, db } from '../src/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import { TbTrophy, TbEye, TbHeart, TbCalendar, TbBolt, TbLock, TbClock, TbDeviceGamepad2, TbBookmarks, TbThumbUp, TbHistory } from 'react-icons/tb';
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

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, 'SecretArea', currentUser.uid);
                
                // Real-time listener for profile data updates
                const unsubscribeDoc = onSnapshot(docRef, async (docSnap) => {
                    let data = docSnap.exists() ? docSnap.data() : null;
                    if (!data) {
                        data = {
                            email: currentUser.email,
                            displayName: currentUser.displayName,
                            createdAt: new Date().toISOString(),
                            role: 'visitor',
                            points: 2,
                            gamesViewed: 1,
                            contentLiked: 0,
                            recentGames: [],
                            likedGames: [],
                            libraryGames: [],
                            favoriteGames: []
                        };
                        await setDoc(docRef, data);
                    } else {
                        if (data.points === undefined) data.points = 2;
                        if (data.gamesViewed === undefined) data.gamesViewed = 1;
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
    
    const memberSince = new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
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
        // Go back to dashboard, but we want to open the game.
        // We can pass state to the router, or simply navigate and let them find it.
        // Or trigger a custom event that SecretArea listens to.
        navigate('/');
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('openGameFromProfile', { detail: { id: game.id } }));
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#060a11] text-slate-900 dark:text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button 
                    onClick={() => navigate('/')} 
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                    {dir === 'rtl' ? <FaAngleRight /> : <FaAngleLeft />}
                    {t('Back to Dashboard') || 'Back to Dashboard'}
                </button>

                {/* Header Banner */}
                <div className="mb-10">
                    <div className="h-32 sm:h-48 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-r from-[#29b6f6] to-[#039be5] w-full" />
                    <div className="px-4 sm:px-10 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16">
                        <div 
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 dark:border-[#060a11] flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg overflow-hidden shrink-0"
                            style={{ backgroundColor: bgColor }}
                        >
                            {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : initial.toUpperCase()}
                        </div>
                        <div className="pb-2 sm:pb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold">{user.displayName || user.email.split('@')[0]}</h1>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800/60 mb-8 hide-scrollbar">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={\`relative px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors \${activeTab === tab ? 'text-[#29b6f6]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}\`}
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
                                    <h2 className="text-xl font-bold">SecretArea Statistics</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {/* Points */}
                                    <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                                <TbBolt size={18} />
                                            </div>
                                            <span className="text-xs font-medium text-indigo-400">+ Live</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">{profileData.points}</span>
                                            <span className="text-sm text-slate-400">pts</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">Total Points Earned</p>
                                    </div>
                                    
                                    {/* Viewed */}
                                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                                <TbEye size={18} />
                                            </div>
                                            <span className="text-xs font-medium text-purple-400">+ Live</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">{profileData.gamesViewed}</span>
                                            <span className="text-sm text-slate-400">games</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">Total Games Viewed</p>
                                    </div>
                                    
                                    {/* Liked */}
                                    <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border border-rose-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                                                <TbHeart size={18} />
                                            </div>
                                            <span className="text-xs font-medium text-rose-400">+ Live</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">{profileData.contentLiked}</span>
                                            <span className="text-sm text-slate-400">likes</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">Content Liked</p>
                                    </div>
                                    
                                    {/* Member Since */}
                                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                                <TbCalendar size={18} />
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">{memberSince}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">Member Since</p>
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
                                            <div className="font-bold text-lg">{currentRank.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{profileData.points} Points</div>
                                        </div>
                                    </div>
                                    {nextRank && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Next Rank:</span>
                                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1f2e] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700/50 font-medium">
                                                <span>{nextRank.icon}</span> {nextRank.name}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Rank Path */}
                                <div className="relative pt-4 pb-8 overflow-x-auto hide-scrollbar">
                                    <div className="flex min-w-max px-2">
                                        {RANKS.map((rank, idx) => {
                                            const isCurrent = idx === currentRankIndex;
                                            const isPast = idx < currentRankIndex;
                                            const isNext = idx === currentRankIndex + 1;
                                            
                                            return (
                                                <div key={rank.name} className="relative flex flex-col items-center w-32 sm:w-40">
                                                    {/* Connecting line */}
                                                    {idx < RANKS.length - 1 && (
                                                        <div className={\`absolute top-10 start-1/2 w-full h-1 \${isPast ? 'bg-[#29b6f6]' : 'bg-slate-200 dark:bg-slate-800'}\`} />
                                                    )}
                                                    
                                                    <div className={\`relative z-10 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all \${isCurrent ? 'bg-slate-100 dark:bg-[#1a1f2e] border-2 border-[#29b6f6] shadow-lg shadow-blue-900/20 scale-110' : 'bg-transparent opacity-50'} \${isNext ? 'opacity-80' : ''}\`}>
                                                        <div className={\`w-14 h-14 rounded-full flex items-center justify-center text-3xl \${isPast || isCurrent ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'} shadow-inner\`}>
                                                            {rank.icon}
                                                        </div>
                                                        <div className={\`font-bold text-sm text-center \${isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}\`}>{rank.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-500">{rank.points.toLocaleString()} pts</div>
                                                        {isCurrent && <div className="absolute -bottom-2 text-[#29b6f6]">▲</div>}
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
                                            <span>Progress to Next Rank</span>
                                            <span className="text-[#29b6f6]">{Math.round(progressPercent)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#29b6f6] rounded-full transition-all duration-1000" style={{ width: \`\${progressPercent}%\` }} />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            <span>{profileData.points.toLocaleString()} points</span>
                                            <span>{pointsNeeded.toLocaleString()} points needed</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Achievements & Badges */}
                            <div className="bg-white dark:bg-[#111623] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800/50">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                            <TbTrophy size={20} />
                                        </div>
                                        <h2 className="text-xl font-bold">Achievements & Badges</h2>
                                    </div>
                                    <div className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg text-sm font-bold border border-orange-500/20 transition-all">
                                        {earnedBadges.length} Earned
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {ALL_BADGES.map((badge) => {
                                        const isEarned = badge.condition(profileData);
                                        return (
                                            <div key={badge.id} className={\`border rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all duration-500 \${isEarned ? 'bg-orange-500/5 border-orange-500/30' : 'bg-slate-50 dark:bg-[#1a1f2e] border-slate-200 dark:border-slate-800/60 opacity-60'}\`}>
                                                <div className={\`w-12 h-12 rounded-full border flex items-center justify-center text-2xl \${isEarned ? 'border-orange-500/50 text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-slate-300 dark:border-slate-700 text-slate-400'}\`}>
                                                    {isEarned ? badge.icon : <TbLock size={20} />}
                                                </div>
                                                <div>
                                                    <div className={\`font-bold \${isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}\`}>{isEarned ? badge.name : 'Locked'}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{isEarned ? badge.description : 'Keep exploring to unlock more Badges!'}</div>
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
                                    <h2 className="text-xl font-bold">Recent Activity</h2>
                                </div>
                                
                                {profileData.recentGames && profileData.recentGames.length > 0 ? (
                                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                                        {profileData.recentGames.map((game, i) => (
                                            <div key={i} onClick={() => handleReturnToGame(game)} className="w-40 sm:w-48 lg:w-56 shrink-0 relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                                                <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-3 start-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white">
                                                    Viewed
                                                </div>
                                                <div className="absolute bottom-4 inset-x-4">
                                                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{game.name}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-500">No recent activity yet. Go explore some games!</div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'Liked' && (
                        profileData.likedGames && profileData.likedGames.length > 0 
                            ? <GameGrid games={profileData.likedGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbThumbUp} title="No Liked Games" desc="You haven't liked any games yet. Click the heart icon on games you enjoy!" />
                    )}

                    {activeTab === 'Library' && (
                        profileData.libraryGames && profileData.libraryGames.length > 0 
                            ? <GameGrid games={profileData.libraryGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbDeviceGamepad2} title="Your Library is Empty" desc="Games you download or add to your library will appear here." />
                    )}

                    {activeTab === 'Game history' && (
                        profileData.recentGames && profileData.recentGames.length > 0 
                            ? <GameGrid games={profileData.recentGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbHistory} title="No History" desc="Start viewing games on the dashboard to build your history." />
                    )}

                    {activeTab === 'Favorites' && (
                        profileData.favoriteGames && profileData.favoriteGames.length > 0 
                            ? <GameGrid games={profileData.favoriteGames} onGameClick={handleReturnToGame} /> 
                            : <EmptyState icon={TbBookmarks} title="No Favorites" desc="Pin games to your favorites to access them quickly from here." />
                    )}

                </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
`
fs.writeFileSync('pages/Profile.tsx', code);
