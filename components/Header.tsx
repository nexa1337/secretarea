import React, { useState, useRef, useEffect } from 'react';
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


const MoreMenu = ({ isUnlocked, handleLogout, t }: { isUnlocked: boolean, handleLogout: () => void, t: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
        title="Menu"
      >
        <Icon name="Menu" size={20} className="sm:hidden" />
        <Icon name="Menu" size={24} className="hidden sm:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full end-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1"
          >
            <button
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="w-full text-start px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              {theme === 'light' ? <TbMoon size={18} /> : <TbSun size={18} />}
              {theme === 'light' ? t('Dark Mode') : t('Light Mode')}
            </button>
            
            {isUnlocked && (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="w-full text-start px-4 py-3 text-sm flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-600 dark:text-red-500"
              >
                <Icon name="Logout" size={18} />
                {t('Logout')}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
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
    localStorage.removeItem('secret_area_unlocked');
    setIsUnlocked(false);
    window.dispatchEvent(new Event('authChange'));
    window.location.reload();
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
          <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
            <Flags />
            <DiscoverGameButton />
            <LanguageSwitcher />
            <MoreMenu isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;