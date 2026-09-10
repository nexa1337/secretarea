import React, { useState, useRef, useEffect } from 'react';
import { auth, logOut } from '../src/firebase';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_ITEMS } from '../constants';
import { useLanguage } from '../src/contexts/LanguageContext';
import Icon from './Icon';
import { TbMoon, TbSun } from 'react-icons/tb';

const Flags = () => {
  const { t } = useLanguage();
  return (
  <div className="flex items-center gap-1 sm:gap-2">
    <div 
      className="relative w-5 h-3 sm:w-6 sm:h-4 md:w-8 md:h-5 rounded shadow-sm cursor-default overflow-hidden group flex items-center justify-center shrink-0"
      title={t("Made in Morocco")}
    >
      <img 
        src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyejV3bDZmYmVhczl6eWdtajNvb2Nocmk4NzVqYmE5aHBzd3Z6cndiOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Q6xuxUhCgCNpsbfhaP/source.gif" 
        alt="Morocco Flag" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    <div 
      className="relative w-5 h-3 sm:w-6 sm:h-4 md:w-8 md:h-5 rounded shadow-sm cursor-default overflow-hidden group flex items-center justify-center shrink-0"
      title={t("Solidarity with Palestine")}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Flag_of_Palestine.gif" 
        alt="Palestine Flag" 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  </div>
  );
};


const DiscoverGameButton = () => {
  const { t } = useLanguage();
  return (
    <div 
      className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 group shadow-lg cursor-pointer mx-1 transition-transform hover:scale-110 active:scale-95" 
      title={t("Discover a random game")}
      onClick={() => window.dispatchEvent(new CustomEvent('randomPopularGame'))}
    >
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)] animate-[spin_4s_linear_infinite] group-hover:animate-[spin_1s_linear_infinite]" />
      <div className="absolute inset-[2px] rounded-full bg-slate-900 flex items-center justify-center z-10 overflow-hidden transition-colors duration-300 group-hover:bg-slate-800">
        <div className="absolute top-1/2 start-1/2 w-full h-full origin-top-start -ms-0 -mt-0 bg-gradient-to-br from-indigo-500/50 to-transparent animate-[spin_2s_linear_infinite] group-hover:from-indigo-400/80 group-hover:animate-[spin_0.5s_linear_infinite]" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-indigo-500/60 border-dashed animate-[spin_10s_linear_infinite] group-hover:border-indigo-400 group-hover:animate-[spin_3s_linear_infinite_reverse] group-hover:scale-110 transition-transform" />
        <div className="absolute w-[30%] h-[30%] rounded-full border border-indigo-500/60 group-hover:border-indigo-400 group-hover:scale-125 transition-transform" />
        <div className="absolute w-full h-[1px] bg-indigo-500/60 group-hover:bg-indigo-400" />
        <div className="absolute h-full w-[1px] bg-indigo-500/60 group-hover:bg-indigo-400" />
        <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full top-[25%] start-[25%] animate-pulse shadow-[0_0_5px_#fbbf24] group-hover:bg-yellow-300" />
        <div className="absolute w-1.5 h-1.5 bg-teal-400 rounded-full bottom-[25%] end-[25%] animate-pulse shadow-[0_0_5px_#2dd4bf] group-hover:bg-cyan-300" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};



const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button onClick={toggleTheme} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
      {theme === 'light' ? <TbMoon size={22} /> : <TbSun size={22} />}
    </button>
  );
};

const NotificationBell = () => {
  const [hasNew, setHasNew] = useState(false);
  
  useEffect(() => {
    const handleIntelUpdate = (e: any) => {
      const latestTimestamp = e.detail;
      const lastSeen = localStorage.getItem('last_seen_intel');
      if (latestTimestamp && latestTimestamp !== lastSeen) {
        setHasNew(true);
      }
    };
    
    const handleIntelOpened = () => {
      setHasNew(false);
    };

    window.addEventListener('intel-updated', handleIntelUpdate);
    window.addEventListener('intel-opened', handleIntelOpened);
    
    return () => {
      window.removeEventListener('intel-updated', handleIntelUpdate);
      window.removeEventListener('intel-opened', handleIntelOpened);
    };
  }, []);

  return (
    <button 
      onClick={() => window.dispatchEvent(new Event('open-intel-panel'))} 
      className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
    >
      <Icon name="Bell" size={22} className={hasNew ? "animate-pulse" : ""} />
      {hasNew && (
        <span className="absolute top-1 right-1.5 sm:top-2 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
      )}
    </button>
  );
};

const UserDropdown = ({ isUnlocked, handleLogout, t, user, dir }: { isUnlocked: boolean, handleLogout: () => void, t: any, user: any, dir: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isUnlocked && !user) return null;

  const initial = user?.displayName?.[0] || user?.email?.[0] || 'A';
  const bgColor = user ? '#29b6f6' : '#64748b'; // Light blue color for the avatar

  return (
    <div className="relative" ref={dropdownRef} dir={dir}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-500 transition-all ml-1 sm:ml-2"
        style={{ backgroundColor: bgColor }}
      >
        {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : initial.toUpperCase()}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full end-0 mt-3 w-56 bg-white dark:bg-[#111623] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden z-50 py-2 text-slate-700 dark:text-[#94a3b8] font-medium text-[15px]`}
          >
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors text-start">{t('My profile') || 'My profile'}</Link>
            <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-2 mx-4" />
            <Link to="/roadmap" onClick={() => setIsOpen(false)} className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors text-start">{t('Roadmap') || 'Roadmap'}</Link>
            <Link to="/personal-space" onClick={() => setIsOpen(false)} className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors text-start">{t('Personal Space') || 'Personal Space'}</Link>
            <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-2 mx-4" />
            <Link to="/settings" onClick={() => setIsOpen(false)} className="block px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors text-start">{t('Settings') || 'Settings'}</Link>
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-start px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-400 transition-colors">{t('Logout') || 'Logout'}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const Header: React.FC = () => {
  const { t, dir } = useLanguage();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const [isUnlocked, setIsUnlocked] = React.useState(() => localStorage.getItem('secret_area_unlocked') === 'true');

  React.useEffect(() => {
    const handleStorage = () => setIsUnlocked(localStorage.getItem('secret_area_unlocked') === 'true');
    window.addEventListener('storage', handleStorage);
    window.addEventListener('authChange', handleStorage);
    const interval = setInterval(() => {
      setIsUnlocked(localStorage.getItem('secret_area_unlocked') === 'true');
    }, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('authChange', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('secret_area_unlocked');
    setIsUnlocked(false);
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-3 group">
            <div className="relative text-slate-900 dark:text-white shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14">
              <div className="relative z-10 flex items-center justify-center w-full h-full">
                 <Icon name="Wolf" className="w-full h-full" />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center min-w-0 overflow-hidden">
              <div className="flex items-center justify-start mb-1 gap-1">
                  <span className="font-mono font-black text-xs sm:text-sm md:text-lg tracking-tight sm:tracking-widest text-slate-900 dark:text-white leading-none truncate">
                  {t('SecretArea')}
                 </span>
                 <Icon name="CheckCircle" size={14} className="text-blue-500 shrink-0" />
              </div>
              <span className="text-[6px] sm:text-[10px] font-bold text-primary-500 uppercase tracking-tight sm:tracking-[0.3em] leading-none animate-pulse whitespace-nowrap">
                {t('Internet For Everyone')}
              </span>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Flags />
            <DiscoverGameButton />
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationBell />
            <UserDropdown isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} user={user} dir={dir} />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;