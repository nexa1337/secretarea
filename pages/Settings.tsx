import React, { useState, useEffect } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { auth, db } from '../src/firebase';
import { addDoc, collection } from 'firebase/firestore';
import Icon from '../components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GPU_DATA, CPU_DATA } from '../src/data/systemSpecs';
import { 
    saveUserProfileInfo, 
    saveUserHardwareSpecs, 
    subscribeUserProfile,
    isUserAdmin,
    subscribeGlobalBanner,
    saveGlobalBanner 
} from '../src/services/userService';
import { TbShieldCheck } from 'react-icons/tb';

const Settings = () => {
    const { t, dir } = useLanguage();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab === 'Cloud Database' ? 'Profile' : (location.state?.tab || 'Profile'));
    
    // Profile form state
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [bannerURL, setBannerURL] = useState('/images/userprofile.png');
    
    // Hardware form state
    const [gpuModel, setGpuModel] = useState('');
    const [cpuModel, setCpuModel] = useState('');
    const [ram, setRam] = useState(16);
    const [os, setOs] = useState('10');
    const [isActive, setIsActive] = useState(true);

    // Request Item form state
    const [requestTitle, setRequestTitle] = useState(location.state?.requestTitle || '');
    const [requestSection, setRequestSection] = useState('Game');
    const [requestImageUrl, setRequestImageUrl] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

    const isAdmin = isUserAdmin(user?.email, profileData?.role);

    useEffect(() => {
        const unsubBanner = subscribeGlobalBanner((url) => {
            if (url) {
                setBannerURL(url);
            }
        });
        return () => unsubBanner();
    }, []);

    useEffect(() => {
        let unsubscribeDoc: (() => void) | null = null;

        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (unsubscribeDoc) {
                unsubscribeDoc();
                unsubscribeDoc = null;
            }
            setAuthLoading(false);
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
                setPhotoURL(currentUser.photoURL || '');
                
                unsubscribeDoc = subscribeUserProfile(currentUser.uid, (data) => {
                    setProfileData(data);
                    if (data.displayName) setDisplayName(data.displayName);
                    if (data.photoURL) setPhotoURL(data.photoURL);
                    if (data.bannerURL) setBannerURL(data.bannerURL);
                    setUsername(data.username || currentUser.email?.split('@')[0] || '');
                    setBio(data.bio || '');
                    
                    if (data.pcSpecs) {
                        setGpuModel(data.pcSpecs.gpuModel || '');
                        setCpuModel(data.pcSpecs.cpuModel || '');
                        setRam(data.pcSpecs.ram || 16);
                        setOs(data.pcSpecs.os || '10');
                        setIsActive(data.pcSpecs.isActive !== false);
                    }
                }, currentUser);
            }
        });

        return () => {
            if (unsubscribeDoc) {
                unsubscribeDoc();
                unsubscribeDoc = null;
            }
            unsubscribeAuth();
        };
    }, []);

    const triggerSuccess = (msg: string) => {
        setSaveSuccessMessage(msg);
        setTimeout(() => setSaveSuccessMessage(null), 3500);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            if (isAdmin && bannerURL) {
                await saveGlobalBanner(bannerURL, user.email || 'admin');
            }
            await saveUserProfileInfo(user.uid, user, {
                displayName,
                username,
                bio,
                photoURL,
                bannerURL
            });
            triggerSuccess(isAdmin ? t('Profile and Global Banner updated!') : t('Profile updated and saved!'));
        } catch (e: any) {
            console.error("Error saving profile:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestTitle || !requestSection || !user) return;
        setIsSubmittingRequest(true);
        try {
            await fetch('https://script.google.com/macros/s/AKfycbx7nzBZc_tIhbAUK5OvOzgifGVzaVorzjn5OXNe8ENC0p7Pjia7O-u4WggxjRZipt4v/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    title: requestTitle,
                    category: requestSection,
                    image: requestImageUrl,
                    message: requestMessage
                })
            }).catch(() => {});

            try {
                await addDoc(collection(db, 'requests'), {
                    title: requestTitle,
                    section: requestSection,
                    imageUrl: requestImageUrl,
                    message: requestMessage,
                    userId: user.uid,
                    userEmail: user.email,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });
            } catch (err: any) {
                if (err?.code !== 'permission-denied' && !err?.message?.includes('permissions')) {
                    console.warn("Firestore requests note (handled):", err?.message);
                }
                try {
                    const localRequests = JSON.parse(localStorage.getItem('secretarea_local_requests') || '[]');
                    localRequests.push({
                        title: requestTitle,
                        section: requestSection,
                        imageUrl: requestImageUrl,
                        message: requestMessage,
                        userId: user.uid,
                        userEmail: user.email,
                        status: 'pending',
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('secretarea_local_requests', JSON.stringify(localRequests));
                } catch (e) {}
            }
            
            setRequestSuccess(true);
            setRequestTitle('');
            setRequestSection('Game');
            setRequestImageUrl('');
            setRequestMessage('');
            setTimeout(() => setRequestSuccess(false), 3000);
        } catch (error) {
            console.error("Error submitting request:", error);
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    const handleSaveHardware = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await saveUserHardwareSpecs(user.uid, {
                gpuModel,
                cpuModel,
                ram,
                os,
                isActive
            });
            triggerSuccess(t('Hardware specs saved to Firestore!'));
        } catch (e) {
            console.error("Error saving hardware:", e);
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-slate-300 dark:border-slate-700 border-t-[#29aaea] rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Loading Settings...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div dir={dir} className="max-w-md mx-auto px-4 py-24 text-center mt-16">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-[#29aaea] flex items-center justify-center mx-auto mb-4">
                    <Icon name="Lock" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t('Sign In Required')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    {t('Please sign in with Google in SecretArea to configure and save your profile & hardware settings.')}
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-xl bg-[#29aaea] text-white font-bold text-sm shadow-lg shadow-[#29aaea]/20 hover:bg-[#2094ce] transition-colors"
                >
                    {t('Go to SecretArea Login')} &rarr;
                </button>
            </div>
        );
    }

    const initial = user?.displayName?.[0] || user?.email?.[0] || 'G';
    const bgColor = '#29aaea';

    return (
        <div dir={dir} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-16 sm:mt-24 mb-16 sm:mb-24 flex flex-col md:flex-row gap-8">
            
            {/* Notification Toast */}
            <AnimatePresence>
                {saveSuccessMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-2xl flex items-center gap-2 border border-emerald-400"
                    >
                        <Icon name="Check" size={18} />
                        <span>{saveSuccessMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar menu */}
            <div className="w-full md:w-64 shrink-0">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-sm">
                        <Icon name="ArrowLeft" size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        {t('Dashboard')}
                    </Link>
                    <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs text-[#29aaea] hover:underline font-semibold">
                        <Icon name="User" size={14} />
                        {t('View Profile')} &rarr;
                    </Link>
                </div>

                <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm"
                        style={{ backgroundColor: bgColor }}
                    >
                        {photoURL || user.photoURL ? (
                            <img src={photoURL || user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <span className="text-white">{initial.toUpperCase()}</span>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 dark:text-white truncate text-sm">
                            {displayName || user.displayName || user.email?.split('@')[0]}
                        </div>
                        <div className="text-xs text-slate-500 truncate">@{username || 'gamer'}</div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    {[
                        { id: 'Profile', label: t('Profile'), icon: 'User' },
                        { id: 'Hardware', label: t('Hardware'), icon: 'Cpu' },
                        { id: 'Request Item', label: t('Request Item'), icon: 'Plus' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-start text-sm ${
                                activeTab === tab.id 
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon name={tab.icon} size={18} />
                                <span>{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {activeTab === 'Profile' && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('Personal Info') || 'Personal Info'}</h2>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-lg">
                                {t('This information is visible on your profile and synced directly with Firestore database.')}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        {t('Avatar Image URL')}
                                    </label>
                                    <div className="flex gap-4 items-center">
                                        <div 
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-md"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            {photoURL ? (
                                                <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            ) : (
                                                <span className="text-white">{initial.toUpperCase()}</span>
                                            )}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={photoURL} 
                                            onChange={e => setPhotoURL(e.target.value)}
                                            className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                            placeholder="https://... (Google avatar or image link)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        {t('Display Name')}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={displayName} 
                                        onChange={e => setDisplayName(e.target.value)}
                                        placeholder="Gamer Name"
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        {t('Username')}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">@</span>
                                        <input 
                                            type="text" 
                                            value={username} 
                                            onChange={e => setUsername(e.target.value.replace(/^@/, ''))}
                                            placeholder="username"
                                            className="w-full ps-8 pe-4 py-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        {t('Email')}
                                    </label>
                                    <input 
                                        type="email" 
                                        value={user.email || ''} 
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed outline-none text-sm"
                                    />
                                </div>

                                {isAdmin ? (
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                                {t('Profile Banner URL')} <span className="text-[#29aaea] font-normal">({t('Global Stack')})</span>
                                            </label>
                                            <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                                <TbShieldCheck size={13} /> {t('Admin Global Banner')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <input 
                                                type="text" 
                                                value={bannerURL} 
                                                onChange={e => setBannerURL(e.target.value)}
                                                placeholder="/images/userprofile.png or https://..."
                                                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                            />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {t('Admin control: Changing this banner automatically applies and stacks for all registered users.')}
                                            </p>
                                            {bannerURL && (
                                                <div className="h-20 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                                                    <img 
                                                        src={bannerURL} 
                                                        alt="Banner Preview" 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/userprofile.png'; }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                            {t('Profile Banner')}
                                        </label>
                                        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                                            <div className="min-w-0">
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                                                    {t('Universal Profile Banner')}
                                                </span>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                                                    {t('Managed globally by Administrator. Applies automatically to your profile.')}
                                                </span>
                                            </div>
                                            {bannerURL && (
                                                <div className="h-10 w-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                                    <img 
                                                        src={bannerURL} 
                                                        alt="Banner Preview" 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/userprofile.png'; }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        {t('Bio')}
                                    </label>
                                    <textarea 
                                        value={bio} 
                                        onChange={e => setBio(e.target.value)}
                                        rows={3}
                                        placeholder={t("Tell the community about yourself, your favorite game genres, etc...")}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] resize-none outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end gap-3 max-w-2xl">
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="px-6 py-3 bg-[#29aaea] hover:bg-[#2094ce] text-white rounded-xl font-bold transition-all text-sm shadow-md shadow-[#29aaea]/20 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{t('Saving to Firestore...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="Check" size={16} />
                                        <span>{t('Save Profile Info')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Hardware' && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('PC Specifications') || 'PC Specifications'}</h2>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{t('Compatibility Checker')}</span>
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={isActive} 
                                            onChange={(e) => setIsActive(e.target.checked)} 
                                        />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#29aaea]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <div className={`dot absolute start-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4 rtl:-translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-lg">
                                {t('Save your hardware specs to Firestore. They will display inside your profile and benchmark against game requirements.')}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Graphics Card (GPU)')}</label>
                                    <select 
                                        value={gpuModel} 
                                        onChange={e => setGpuModel(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    >
                                        <option value="">{t('Select GPU...') || 'Select GPU...'}</option>
                                        <optgroup label="NVIDIA">
                                            {GPU_DATA.NVIDIA.map(gpu => <option key={gpu} value={gpu}>{gpu}</option>)}
                                        </optgroup>
                                        <optgroup label="AMD">
                                            {GPU_DATA.AMD.map(gpu => <option key={gpu} value={gpu}>{gpu}</option>)}
                                        </optgroup>
                                        <optgroup label="Intel">
                                            {GPU_DATA.Intel.map(gpu => <option key={gpu} value={gpu}>{gpu}</option>)}
                                        </optgroup>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Processor (CPU)')}</label>
                                    <select 
                                        value={cpuModel} 
                                        onChange={e => setCpuModel(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    >
                                        <option value="">{t('Select CPU...') || 'Select CPU...'}</option>
                                        <optgroup label="AMD">
                                            {CPU_DATA.AMD.map(cpu => <option key={cpu} value={cpu}>{cpu}</option>)}
                                        </optgroup>
                                        <optgroup label="Intel">
                                            {CPU_DATA.Intel.map(cpu => <option key={cpu} value={cpu}>{cpu}</option>)}
                                        </optgroup>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Memory (RAM)')}</label>
                                    <select 
                                        value={ram} 
                                        onChange={e => setRam(parseInt(e.target.value))}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    >
                                        <option value="4">4 GB</option>
                                        <option value="8">8 GB</option>
                                        <option value="16">16 GB</option>
                                        <option value="32">32 GB</option>
                                        <option value="64">64 GB</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Operating System')}</label>
                                    <select 
                                        value={os} 
                                        onChange={e => setOs(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    >
                                        <option value="7">Windows 7</option>
                                        <option value="8">Windows 8</option>
                                        <option value="10">Windows 10</option>
                                        <option value="11">Windows 11</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end gap-3 max-w-2xl">
                            <button 
                                onClick={handleSaveHardware}
                                disabled={isSaving}
                                className="px-6 py-3 bg-[#29aaea] hover:bg-[#2094ce] text-white rounded-xl font-bold transition-all text-sm shadow-md shadow-[#29aaea]/20 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{t('Saving Specs...')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="Check" size={16} />
                                        <span>{t('Save Hardware Settings')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Request Item' && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('Request Item') || 'Request Item'}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-lg">{t('Request a game or tool to be added to SecretArea.')}</p>

                            <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Item Title *')}</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={requestTitle} 
                                        onChange={e => setRequestTitle(e.target.value)}
                                        placeholder="e.g. Call of Duty: Black Ops 6"
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Section')}</label>
                                    <select 
                                        value={requestSection} 
                                        onChange={e => setRequestSection(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    >
                                        <option value="Game">Game</option>
                                        <option value="Tools">Tools</option>
                                        <option value="SteamTools">SteamTools</option>
                                        <option value="SaveGame">SaveGame</option>
                                        <option value="Hypervisor">Hypervisor</option>
                                    </select>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Image URL (Optional)')}</label>
                                    <input 
                                        type="url" 
                                        value={requestImageUrl} 
                                        onChange={e => setRequestImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] outline-none text-sm"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">{t('Message to Admin (Optional)')}</label>
                                    <textarea 
                                        value={requestMessage} 
                                        onChange={e => setRequestMessage(e.target.value)}
                                        rows={3}
                                        placeholder={t("Any specific version, repack, or detail?")}
                                        className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#29aaea] resize-none outline-none text-sm"
                                    />
                                </div>
                                
                                <div className="col-span-1 md:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-6 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={isSubmittingRequest}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-[#29aaea] hover:bg-[#2094ce] text-white rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-[#29aaea]/20"
                                    >
                                        {isSubmittingRequest ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : requestSuccess ? (
                                            <><Icon name="Check" size={18} /> {t('Sent Successfully!')}</>
                                        ) : (
                                            <><Icon name="Send" size={18} /> {t('Send Request')}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;
