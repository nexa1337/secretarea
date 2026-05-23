import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export const NEXA_ECOSYSTEM_LINKS = [
  { name: 'N E X A 1337', url: 'https://nexa1337.github.io/nexa1337', clicks: '342K' },
  { name: 'N E X A 1337 - Secret Area', url: 'https://nexa1337.github.io/secretarea', clicks: '215K' },
  { name: 'N E X A 1337 - Tool', url: 'https://nexa1337.github.io/tool', clicks: '189K' },
  { name: 'N E X A 1337 - Tool v2', url: 'https://nexa1337.github.io/toolv2', clicks: '92K' },
  { name: 'N E X A 1337 - School', url: 'https://school-lime-psi.vercel.app/', clicks: '54K' },
  { name: 'N E X A 1337 - Digital Store', url: 'https://digitalstore-iota-five.vercel.app/', clicks: '128K' }
];

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <footer className="w-full py-8 text-center text-slate-500 dark:text-slate-400 text-sm pb-24 md:pb-8 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <a href="#" className="flex items-center gap-3 px-4 py-2 border border-[#00a2ed]/40 hover:border-[#00a2ed] rounded-lg text-[#00a2ed] bg-[#00a2ed]/5 hover:bg-[#00a2ed]/10 transition-all">
            <WindowsLogo />
            <div className="text-left font-sans">
              <div className="text-[10px] leading-tight font-medium opacity-90 uppercase tracking-widest text-[#00a2ed]">Download for</div>
              <div className="text-[15px] font-bold leading-tight">Desktop App</div>
            </div>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-2 border border-[#3DDC84]/40 hover:border-[#3DDC84] rounded-lg text-[#3DDC84] bg-[#3DDC84]/5 hover:bg-[#3DDC84]/10 transition-all">
            <AndroidLogo />
            <div className="text-left font-sans">
              <div className="text-[10px] leading-tight font-medium opacity-90 uppercase tracking-widest text-[#3DDC84]">Download for</div>
              <div className="text-[15px] font-bold leading-tight">Android App</div>
            </div>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-4 font-medium">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Secret Area</Link>
          <Link to="/personal-space" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Personal Space</Link>
          <Link to="/roadmap" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Roadmap</Link>
        </div>
        <p>
          © 2026 <button onClick={() => setIsPopupOpen(true)} className="font-bold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">N E X A 1337</button>. All rights reserved.
        </p>
      </footer>

      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">N E X A 1337 Ecosystem</h3>
                <button onClick={() => setIsPopupOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Icon name="X" size={24} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {NEXA_ECOSYSTEM_LINKS.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-100 dark:border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        <Icon name="ExternalLink" size={18} />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{link.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                      <Icon name="Activity" size={14} />
                      {link.clicks} clicks
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
