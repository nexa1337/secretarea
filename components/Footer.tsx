import { useLanguage } from '../src/contexts/LanguageContext';
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const WindowsLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M2 5.09L11.36 3.73V11.5H2V5.09ZM12.64 3.55L22 2.18V11.5H12.64V3.55ZM12.64 12.5H22V21.82L12.64 20.45V12.5ZM2 12.5H11.36V20.27L2 18.91V12.5Z"/>
  </svg>
);

const AndroidLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M15 4l1.4-1.9c.2-.3.1-.7-.2-.9-.3-.2-.7-.1-.9.2L13.8 3.5c-1.3-.4-2.8-.4-4 0L8.2 1.4C8 1.1 7.6 1 7.3 1.2c-.3.2-.4.6-.2.9L8.5 4C4.3 6 1.4 10.1 1 14.8h22C22.6 10.1 19.7 6 15 4zm-7.5 7.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm8.5 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>
  </svg>
);

const Footer: React.FC = () => {
  const { dir, t } = useLanguage();

  return (
    <footer dir={dir} className="w-full py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Secret Area</h3>
            <p className="text-sm max-w-xs">{t('Our goal is simple: bring the best games together in one place, so you can spend less time searching and more time playing.')}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">{t('Navigation')}</h3>
            <div className="flex flex-col gap-3 font-medium text-sm text-center">
              <Link to="/" className="hover:text-primary-500 transition-colors">{t('Secret Area')}</Link>
              <Link to="/personal-space" className="hover:text-primary-500 transition-colors">{t('Personal Space')}</Link>
              <Link to="/roadmap" className="hover:text-primary-500 transition-colors">{t('Roadmap')}</Link>
              <Link to="/disclaimer" className="hover:text-primary-500 transition-colors">{t('Disclaimer')}</Link>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">{t('Apps')}</h3>
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
              <a href="#" className="flex items-center gap-3 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-[#00a2ed] dark:hover:border-[#00a2ed] rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#00a2ed] dark:hover:text-[#00a2ed] bg-slate-50 dark:bg-slate-900/50 hover:bg-[#00a2ed]/5 transition-all w-full">
                <WindowsLogo />
                <div className="text-start font-sans">
                  <div className="text-[9px] leading-tight font-medium opacity-70 uppercase tracking-widest">{t('Download for')}</div>
                  <div className="text-sm font-bold leading-tight">{t('Desktop App')}</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-[#3DDC84] dark:hover:border-[#3DDC84] rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#3DDC84] dark:hover:text-[#3DDC84] bg-slate-50 dark:bg-slate-900/50 hover:bg-[#3DDC84]/5 transition-all w-full">
                <AndroidLogo />
                <div className="text-start font-sans">
                  <div className="text-[9px] leading-tight font-medium opacity-70 uppercase tracking-widest">{t('Download for')}</div>
                  <div className="text-sm font-bold leading-tight">{t('Android App')}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800/60 text-sm">
          <p className="mb-4 sm:mb-0">
            © 2026 <span className="font-bold text-slate-900 dark:text-white">{t('SecretArea')}</span>. {t('All rights reserved.')}
          </p>
          <p className="flex items-center gap-1.5">
            {t('Built by :')} <a href="https://nexa1337vcard.vercel.app" target="_blank" rel="noreferrer" className="font-bold text-slate-900 dark:text-white hover:text-primary-500 transition-colors">N E X A 1337</a>
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
