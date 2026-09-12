import React, { useState, useEffect } from 'react';
import { useLanguage } from '../src/contexts/LanguageContext';
import { auth, db } from '../src/firebase';
import { doc, onSnapshot, updateDoc, addDoc, collection } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import Icon from '../components/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { GPU_DATA, CPU_DATA } from '../src/data/systemSpecs';

const Settings = () => {
    const { t, dir } = useLanguage();
    const [user, setUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
        const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'Profile');
    
    // Profile form state
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [banner, setBanner] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    
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

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
                setPhotoURL(currentUser.photoURL || '');
                
                const docRef = doc(db, 'SecretArea', currentUser.uid);
                const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfileData(data);
                        setUsername(data.username || currentUser.email?.split('@')[0] || '');
                        setBio(data.bio || '');
                        setBanner(data.banner || '');
                        
                        if (data.pcSpecs) {
                            setGpuModel(data.pcSpecs.gpuModel || '');
                            setCpuModel(data.pcSpecs.cpuModel || '');
                            setRam(data.pcSpecs.ram || 16);
                            setOs(data.pcSpecs.os || '10');
                            setIsActive(data.pcSpecs.isActive !== false);
                        }
                    } else {
                        setUsername(currentUser.email?.split('@')[0] || '');
                    }
                });
                return () => unsubscribeDoc();
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateProfile(user, {
                displayName,
                photoURL
            });
            const docRef = doc(db, 'SecretArea', user.uid);
            await updateDoc(docRef, {
                username,
                bio,
                banner,
                photoURL
            });
        } catch (e) {
            console.error(e);
        }
        setIsSaving(false);
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
            });

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
            const docRef = doc(db, 'SecretArea', user.uid);
            await updateDoc(docRef, {
                pcSpecs: {
                    gpuModel,
                    cpuModel,
                    ram,
                    os,
                    isActive
                }
            });
        } catch (e) {
            console.error(e);
        }
        setIsSaving(false);
    };

    if (!user) return null;

    const initial = user?.displayName?.[0] || user?.email?.[0] || 'A';
    const bgColor = user ? '#29b6f6' : '#64748b';

    return (
        
        <div dir={dir} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-16 sm:mt-24 mb-16 sm:mb-24 flex flex-col md:flex-row gap-8">
            {/* Sidebar menu */}
            <div className="w-full md:w-64 shrink-0">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 font-medium">
                    <Icon name="ArrowLeft" size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
                    {t('Back to Dashboard')}
                </Link>
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">

                    <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border-2 border-transparent"
                        style={{ backgroundColor: bgColor }}
                    >
                        {photoURL || user.photoURL ? <img src={photoURL || user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-white">{initial.toUpperCase()}</span>}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{displayName || user.email?.split('@')[0]}</div>
                        <div className="text-sm text-slate-500 truncate">@{username}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    {['Profile', 'Hardware', 'Request Item'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-start ${
                                activeTab === tab 
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:text-white'
                            }`}
                        >
                            <Icon name={tab === 'Profile' ? 'User' : tab === 'Hardware' ? 'Cpu' : 'Plus'} size={20} />
                            {t(tab)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {activeTab === 'Profile' && (
                    <div className="space-y-12 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{t('Personal Info') || 'Personal Info'}</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">{t('This information is visible on your public profile.') || 'This information is visible on your public profile.'}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                
                                <div className="col-span-1 md:col-span-2 mb-4">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Banner URL') || 'Banner URL'}</label>
                                    <input 
                                        type="text"
                                        value={banner}
                                        onChange={e => setBanner(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none mb-6"
                                        placeholder="https://example.com/banner.jpg"
                                    />
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Avatar URL') || 'Avatar URL'}</label>
                                    <div className="flex gap-4 items-center">
                                        <div 
                                            className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            {photoURL ? <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white">{initial.toUpperCase()}</span>}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={photoURL} 
                                            onChange={e => setPhotoURL(e.target.value)}
                                            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Display Name') || 'Display Name'}</label>
                                    <input 
                                        type="text" 
                                        value={displayName} 
                                        onChange={e => setDisplayName(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Username') || 'Username'}</label>
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Email') || 'Email'}</label>
                                    <input 
                                        type="email" 
                                        value={user.email} 
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed outline-none"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Bio') || 'Bio'}</label>
                                    <textarea 
                                        value={bio} 
                                        onChange={e => setBio(e.target.value)}
                                        rows={3}
                                        placeholder={t("A short bio about yourself...") || "A short bio about yourself..."}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex justify-end">
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-bold transition-colors"
                            >
                                {isSaving ? (t('Saving...') || 'Saving...') : (t('Save Changes') || 'Save Changes')}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Hardware' && (
                    <div className="space-y-12 animate-fade-in">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                                <h2 className="text-2xl font-bold">{t('PC Specifications') || 'PC Specifications'}</h2>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">{t('Enable Compatibility Checker')}</span>
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={isActive} 
                                            onChange={(e) => setIsActive(e.target.checked)} 
                                        />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <div className={`dot absolute start-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4 rtl:-translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                            <p className="text-slate-500 mb-8 max-w-sm">{t('Your hardware is compared against game requirements to show compatibility ratings.') || 'Your hardware is compared against game requirements to show compatibility ratings.'}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Graphics Card') || 'Graphics Card'}</label>
                                    <select 
                                        value={gpuModel} 
                                        onChange={e => setGpuModel(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
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
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Processor') || 'Processor'}</label>
                                    <select 
                                        value={cpuModel} 
                                        onChange={e => setCpuModel(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
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
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Memory (RAM)') || 'Memory (RAM)'}</label>
                                    <select 
                                        value={ram} 
                                        onChange={e => setRam(parseInt(e.target.value))}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="4">4 GB</option>
                                        <option value="8">8 GB</option>
                                        <option value="16">16 GB</option>
                                        <option value="32">32 GB</option>
                                        <option value="64">64 GB</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t('Operating System') || 'Operating System'}</label>
                                    <select 
                                        value={os} 
                                        onChange={e => setOs(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="7">Windows 7</option>
                                        <option value="8">Windows 8</option>
                                        <option value="10">Windows 10</option>
                                        <option value="11">Windows 11</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex justify-end">
                            <button 
                                onClick={handleSaveHardware}
                                disabled={isSaving}
                                className="px-6 py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl font-bold transition-colors"
                            >
                                {isSaving ? (t('Saving...') || 'Saving...') : (t('Save Changes') || 'Save Changes')}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Request Item' && (
                    <div className="space-y-12 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">{t('Request Item') || 'Request Item'}</h2>
                            <p className="text-slate-500 mb-8 max-w-sm">{t('Request a game or tool to be added.') || 'Request a game or tool to be added.'}</p>

                            <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t('Item Title *') || 'Item Title *'}</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={requestTitle} 
                                        onChange={e => setRequestTitle(e.target.value)}
                                        placeholder="e.g. Call of Duty: Black Ops 6"
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6366f1] outline-none"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t('Section') || 'Section'}</label>
                                    <select 
                                        value={requestSection} 
                                        onChange={e => setRequestSection(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6366f1] outline-none"
                                    >
                                        <option value="Game">Game</option>
                                        <option value="Tools">Tools</option>
                                        <option value="SteamTools">SteamTools</option>
                                        <option value="SaveGame">SaveGame</option>
                                        <option value="Hypervisor">Hypervisor</option>
                                    </select>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t('Image URL (Optional)') || 'Image URL (Optional)'}</label>
                                    <input 
                                        type="url" 
                                        value={requestImageUrl} 
                                        onChange={e => setRequestImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6366f1] outline-none"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{t('Message to Admin (Optional)') || 'Message to Admin (Optional)'}</label>
                                    <textarea 
                                        value={requestMessage} 
                                        onChange={e => setRequestMessage(e.target.value)}
                                        rows={3}
                                        placeholder={t("Any specific version or details?") || "Any specific version or details?"}
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#6366f1] resize-none outline-none"
                                    />
                                </div>
                                
                                <div className="col-span-1 md:col-span-2 border-t border-slate-200 dark:border-slate-800 pt-8 flex justify-end">
                                    <button 
                                        type="submit"
                                        disabled={isSubmittingRequest}
                                        className="w-full px-6 py-3.5 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isSubmittingRequest ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : requestSuccess ? (
                                            <><Icon name="Check" size={20} /> {t('Sent Successfully!')}</>
                                        ) : (
                                            <><Icon name="Send" size={20} /> {t('Send Request')}</>
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
