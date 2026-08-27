import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../src/contexts/LanguageContext';
import Icon from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

const flags = {
  en: 'https://imgs.search.brave.com/OHWzUwxMaExttIlCme1W0aPVH5MkY7Fu0kBvHG3JQbE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8x/MS8xMi8wNS8yMS9h/bWVyaWNhbi1mbGFn/LTU3MzQ0MjZfNjQw/LnBuZw',
  fr: 'https://imgs.search.brave.com/XzNHDQ3qOXErylDJ3_kOHLv3rESOXtya31ryVCbrutY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzU4LzkwLzc2/LzM2MF9GXzE1ODkw/NzYyNl95aEw2YzMx/anBOVVRzVWRIUk5Y/TnlwSU9PNG44amZw/WC5qcGc',
  es: 'https://imgs.search.brave.com/RgTqPUvLUxz1KuN4Ed7rdhehiCD15-SMSuo8je2uRds/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQy/MjkxODc0Ny9waG90/by9mbGFnLW9mLXNw/YWluLXdpdGgtYS1n/cnVuZ2UtdGV4dHVy/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9aFhpRjNaajEz/WkwxVlF3YzhCTTNI/WGhyc21keFc5MkpX/RWs2YWgyTzR5RT0',
  ar: 'https://imgs.search.brave.com/mcwKurm_HUe2clMR2s7_xb2zHAi0pOJay3i1JbvYy68/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wODMv/OTgzLzQ5MS9zbWFs/bC9tb3JvY2Nhbi1m/bGFnLXdpdGgtZ3Jl/ZW4tc3Rhci1vbi1y/ZWQtYmFja2dyb3Vu/ZC12aWRlby5qcGc'
};

const labels = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ar: 'العربية'
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
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

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors flex items-center justify-center bg-slate-100 dark:bg-slate-800 focus:outline-none"
        title={labels[language]}
      >
        <img src={flags[language]} alt={labels[language]} className="w-full h-full object-cover" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full end-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
          >
            {(Object.keys(flags) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelect(lang)}
                className={`w-full text-start px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${language === lang ? 'bg-slate-50 dark:bg-slate-800/50 font-bold' : ''}`}
              >
                <img src={flags[lang]} alt={labels[lang]} className="w-5 h-5 rounded-full object-cover" />
                <span className="text-slate-700 dark:text-slate-300">{labels[lang]}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
