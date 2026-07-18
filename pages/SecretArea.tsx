
import { createPortal } from 'react-dom';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import Icon from '../components/Icon';
import { CommentsSection } from '../components/CommentsSection';
import { DuaPopup } from '../components/DuaPopup';
import { NetworkDiagnostic } from '../components/NetworkDiagnostic';
import { FaFaceAngry } from 'react-icons/fa6';

// --- CONFIGURATION ---
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx7nzBZc_tIhbAUK5OvOzgifGVzaVorzjn5OXNe8ENC0p7Pjia7O-u4WggxjRZipt4v/exec';
const DISCORD_LINK = 'https://discord.gg/MgqvMyZv2b';
const TELEGRAM_LINK = 'https://t.me/nexa1337agency';
const INSTAGRAM_LINK = 'https://instagram.com/nexa1337';
const ITEMS_PER_PAGE = 12; // Show 12 items per page for laptop grid (4x3)

// --- ADVERTISEMENT CONFIGURATION ---
const AD_CONFIG = {
  banner1: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEgCPA6tVcBH3S5v1Z8kuza6RZkU4xgxr8xmDfFTWXVe20XthTejclAyfpzC2XueH50MwmRFDlVIF5ZIRjBZeNqjgokoSxt9yv7DXICKl25yK2xiE5WaAPt5Qe-n80SlQjtByruEyvGpeo4txkhtEEIcjKnjV4iAFygZilgqiEfPxJqnjbGo88quaNiOjku7",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEg0cECd44EYPreCyyRdRXdrtpVgQ4zhKzzTRdtiusek9QZ6nOVADqxzHsfsdEmEc2uWMAzaWMRsNXcpsI3cAOarcDnfXSrFyDXvfPQbMfsFsdWRVsv0S6ZcNPDc2GsNLQhv2x9K9ftA9bthdBDkYEkCt5styw5GuPQ1R6ig_ao0lDy_8F69e5bhdQ3Px3zo",
    link: "https://nexa1337.github.io/nexa1337"
  },
  banner2: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEieujME3eiERRYSKVuqNK5RmR9HNp8dIkYA9RpGwRpFITR4AF-xgaSrGplCnCjdMfq2qERyhFQ3w55UQZKo_2NKJMqwLz9BVbQCBiSF5xq2LIuEP2hZZh6YCWDn7iYCcNvbsAAY7cOPfLbyUI27WR4CrgT84BBjJUvydxicw8aTVMfLV1TDl_ybMlB9w_2-",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEinwCMKTZTTEwIRwgWImWswN0ZyY_WR59hda2eTjfCsaqCRE081vj5F9NG7Ko4fpWigTmJv1DW7CdzeIC-XVAd-zIrSHCsM9mlCUQhVcJulQIT5A27L2XVG1ddbmPALFBgfPXxLLl6bTq3eBxn_pc1U_fyxJQ5eiwxckBoMXJNDBMi9iJEQ8MJ8gPLqIOBN",
    link: "https://school-lime-psi.vercel.app/"
  },
  banner3: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEiSEyx6A5aXHKHgULr34BNBrXr1T1zwDDY6AzfDmoju_y5RofIrU3hD8656Wx_p2CWs-lye2-ZADxwF1OQdiP-iFeHacWd7d0zqi0mcXb6v6GkzSJ8wCnFt0OtmoHW9GigDZK9p5fu5QQw5tyQFoBNOS1dfcDt5e7HHMJD8FeNvGYcfRCoHHBtWdRxbyD_D",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEjR_OB4CqAqv5g8iq9gu8RKlm8ljH8iuEY-hTnqIlvEHfsz5iJI8QnYmBZ1i9gppBD0axWdTzu9np-rE8wKlDWJ4MjBhNo1uKMVux9ToeY2SK8fpoHy7v7cf493n_FbLo4nF8yOFLD9J2slTY4_3lHTaJJEsUB8U7MCGCHGwXR7ohzD0DdKSlamZY09wQJS",
    link: "https://nexa1337.github.io/tool/"
  },
  banner4: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEgN1RQy1V6nR0osv3oNgTei-P_rZykcqf8dfM62jeYWIvxDOQ1fdpvz77DXZ6PWl98uPlH5BLO18M6B8wxeiVds49Ns1lcShLMmG_ASbuQl9-4i6UOaEGyh3Be8bfWnyhL-TZ4igI09zAsmWkqNaULeJxXPFqAQ81BHvQc0F-kZV2yzgF6g8JbWBL7cQhse",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEg8axchD7U8xQW7JH6F6twwFLvKCG0TfVUjWF8JsFctG42IY3y2pkQDHdRRkVExTf7ewL609l9ztXO9Dq61fPXZPfVlSXwEDB7olykBOZUV4LCzCqdA2SGw0KdJ1F_JPjJPgyl9gMi_gMD9raxaKGAAXqXcEucqknI232gkZPNpYR5OoIzrsmIWh03vy1JF",
    link: "https://nexa1337.github.io/toolv2"
  },
  banner5: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEglYrDKA_WlXZZ7wipHFuzNUndOiozyVITTrLQJ7FAYnSVMpLao7EPdx10rxGkfrT9RtoSZadoVdD77Y_pElZyqWEcBX06-MrPBysM8180sAlzvk85IT35ztmLPEJ4ttQw5QNFqWW-8Pz5-hQBCg2AB0NeiviP4I1lXfk9DDta4f0IySkD1JBNUJ9jT8PQL",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEiZ6vQYIHYF4ft2k3KTHr3oulDVWC7BrP3bhtz0nZ62vr3MyZyZ-JSdASWGqLnC4W_YkH6np8CGyXz1TZNiyzXaBkIEic2DOBkvX1wXQGgHNoavx7HRhAG2sUXhlhOHPAJmDePHsJl5Bs9Ub1lG80u9Zhh2WxqSc1vf8oJjLrq4767OYiLNenojAm9HjijB",
    link: "https://digitalstore-iota-five.vercel.app/"
  }
};

// --- DISCLAIMER DATA ---
interface DisclaimerData {
  label: string;
  title: string;
  text: string;
  btn: string;
  dir?: string;
}

const DISCLAIMER_CONTENT: Record<string, DisclaimerData> = {
  EN: {
    label: "English",
    title: "⚠️ Disclaimer",
    text: "All content shared on this website is already publicly available on the internet.\nWe do not host, modify, or crack any files. We only organize and share existing public links.\n\nWe strongly encourage users to purchase original software and games to support developers.\nThe user is solely responsible for how the content is used.",
    btn: "I Understand"
  },
  AR: {
    label: "العربية",
    title: "⚠️ تنبيه قانوني",
    text: "جميع المحتويات الموجودة في هذا الموقع متوفرة مسبقًا على الإنترنت بشكل علني.\nنحن لا نستضيف الملفات ولا نقوم بتعديلها أو كسر حمايتها، بل نشارك فقط روابط عامة.\n\nننصح المستخدمين بشراء النسخ الأصلية لدعم المطورين.\nالمسؤولية الكاملة تقع على عاتق المستخدم.",
    btn: "أنا أفهم",
    dir: "rtl"
  },
  FR: {
    label: "Français",
    title: "⚠️ Avertissement",
    text: "Tout le contenu présent sur ce site est déjà disponible publiquement sur Internet.\nNous n’hébergeons, ne modifions ni ne crackons aucun fichier. Nous partageons uniquement des liens publics.\n\nNous encourageons fortement l’achat des versions originales pour soutenir les développeurs.\nL’utilisateur est seul responsable de l’utilisation du contenu.",
    btn: "Je comprends"
  },
  ES: {
    label: "Español",
    title: "⚠️ Aviso legal",
    text: "Todo el contenido de este sitio ya está disponible públicamente en Internet.\nNo alojamos, modificamos ni crackeamos archivos. Solo compartimos enlaces públicos.\n\nRecomendamos comprar las versions originales para apoyar a los desarrolladores.\nEl usuario es totalmente responsable del uso del contenido.",
    btn: "Entiendo"
  },
  RU: {
    label: "Русский",
    title: "⚠️ Отказ от ответственности",
    text: "Весь контент на этом сайте уже находится в открытом доступе в интернете.\nМы не размещаем, не изменяем и не взламываем файлы. Мы лишь делимся публичными ссылками.\n\nМы рекомендуем приобретать оригинальные версии для поддержки разработчиков.\nПользователь несёт полную ответственность за использование контента.",
    btn: "Я понимаю"
  }
};

// --- TYPES ---
interface Requirement {
  label: string;
  value: string;
  icon: string;
  link?: string;
}

interface ResourceItem {
  id: string;
  category: string;
  name: string;
  version: string;
  repackSize: string;
  originalSize: string;
  genres: string;
  languages: string;
  repackBy: string;
  coverImage: string;
  galleryImages: string[];
  description: string;
  gameId?: string;
  developer?: string;
  ratingPositive?: string;
  ratingNegative?: string;
  dateAdded?: string;
  hasDenuvo?: boolean;
  hasExternalLauncher?: boolean;
  systemReqs: Requirement[];
  installSteps: string[];
  isPinned: boolean;
  isFree: boolean;
  toolsNeeded: { name: string; url: string }[];
  links: {
    parts: { id: number, link: string, note?: string }[];
    mirrors: { id: number, link: string, note?: string }[];
    full?: string;
    fullNote?: string;
    tutorial?: string; 
    dlc?: string;
    trailer?: string;
  };
}

interface CompanyProfile {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  gameIds?: string[];
  hypervisorIds?: string[];
  steamtoolsIds?: string[];
  architectIds?: string[];
  extraIds?: string[];
}

interface TopGame {
  id: string;
  rank: number;
  name: string;
  bannerUrl: string;
  logoUrl: string;
  symbolUrl: string;
}

interface UpcomingGame {
  id: string;
  title: string;
  image: string;
  platform: string;
  price: string;
  icon: string;
  dateAdded?: string;
}

interface SteamAccount {
    username: string;
    password: string;
    games: string;
    status: string;
}

interface MasterGiftAccount {
    name: string;
    url: string;
    logo: string;
    email: string; // or username
    password: string;
    status: string;
}

// --- HELPER FUNCTIONS ---
const getFakeDownloads = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    const base = Math.abs(hash) % 80000 + 5000; // 5k to 85k
    const daysSince = Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24));
    const dailyGrowth = Math.abs(hash) % 50 + 10;
    const total = base + (daysSince * dailyGrowth);
    return total > 1000 ? (total / 1000).toFixed(1) + 'K' : total.toString();
};

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0` : url;
};

const formatPlatformDisplay = (platform: string) => {
    if (!platform) return '';
    return platform.replace(/,/g, ' •').toUpperCase();
};

const getPlatformIcon = (platform: string): string => {
    if (!platform) return 'Gamepad2';
    const p = platform.toLowerCase();
    if (p.includes('ps5') || p.includes('playstation')) return 'BrandPlaystation';
    if (p.includes('xbox')) return 'BrandXbox';
    if (p.includes('steam') || p.includes('pc')) return 'BrandSteam';
    if (p.includes('switch') || p.includes('nintendo')) return 'Gamepad';
    return 'Gamepad2';
};

// --- COMPONENTS ---

// Countdown Component for Lockout
const LockoutTimer: React.FC<{ targetTime: number }> = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const diff = targetTime - now;
            
            if (diff <= 0) {
                setTimeLeft('00:00:00');
                return;
            }

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <span className="font-mono text-xl font-black text-red-500">{timeLeft}</span>
    );
};

const DisclaimerModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [lang, setLang] = useState<keyof typeof DISCLAIMER_CONTENT>('EN');
  
  if (!open) return null;

  const content = DISCLAIMER_CONTENT[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-red-500/30 flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800">
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {(Object.keys(DISCLAIMER_CONTENT) as Array<keyof typeof DISCLAIMER_CONTENT>).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    lang === l 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {DISCLAIMER_CONTENT[l].label}
                </button>
              ))}
           </div>
        </div>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
                 <Icon name="Shield" size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight" dir={content.dir || 'ltr'}>
                {content.title}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line" dir={content.dir || 'ltr'}>
                {content.text}
              </p>
           </div>
        </div>
        <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
           <button 
             onClick={onClose}
             className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95"
           >
             {content.btn}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// STEAM ACCOUNTS MODAL
const SteamAccountsModal: React.FC<{ open: boolean; onClose: () => void; accounts: SteamAccount[] }> = ({ open, onClose, accounts }) => {
    const [copiedIndex, setCopiedIndex] = useState<{idx: number, type: 'user' | 'pass'} | null>(null);

    const handleCopy = (text: string, idx: number, type: 'user' | 'pass') => {
        navigator.clipboard.writeText(text);
        setCopiedIndex({ idx, type });
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-2 sm:p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#171a21] dark:bg-[#171a21] bg-white w-[95%] md:w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#2a475e] dark:border-[#2a475e] border-slate-200 flex flex-col max-h-[85vh] sm:max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Steam Header */}
                <div className="bg-gradient-to-r from-[#171a21] to-[#1b2838] p-4 sm:p-6 border-b border-[#2a475e] flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[url('https://community.cloudflare.steamstatic.com/public/shared/images/header/globalheader_logo.png')] bg-no-repeat bg-right-bottom opacity-10 bg-contain pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                            <Icon name="BrandSteam" size={24} className="text-[#66c0f4] sm:w-7 sm:h-7" /> 
                            <span className="truncate">Free Accounts</span>
                        </h3>
                        <p className="text-[#c5c3c0] text-[10px] sm:text-xs font-bold mt-1">
                            Updated Daily • <span className="text-[#66c0f4]">{accounts.length} Available</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#c5c3c0] hover:text-white relative z-10 shrink-0">
                        <Icon name="X" size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>
                
                {/* List */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar bg-slate-50 dark:bg-[#171a21]">
                    {accounts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <Icon name="Ghost" size={40} className="mx-auto mb-3 opacity-50"/>
                            <p>No accounts available right now. Check back later!</p>
                        </div>
                    ) : (
                        accounts.map((acc, idx) => {
                        const statusRaw = acc.status?.toString().trim() || 'ONLINE';
                        const isOffline = statusRaw.toLowerCase() === 'offline';
                            return (
                                <div key={idx} className="bg-white dark:bg-[#1b2838] border border-slate-200 dark:border-[#2a475e] rounded-xl p-4 sm:p-5 hover:border-[#66c0f4] transition-colors group shadow-lg relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2a475e] dark:to-[#171a21] rounded-full flex items-center justify-center text-[#66c0f4] font-bold text-xs sm:text-sm">
                                                {idx + 1}
                                            </div>
                                        </div>
                                        {/* Status Badge */}
                                        <div className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${
                                            isOffline 
                                            ? 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' 
                                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                        }`}>
                                            {statusRaw || 'ONLINE'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-[#8f98a0] uppercase tracking-wider">Username</label>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#171a21] p-2 rounded border border-slate-200 dark:border-[#2a475e] group-hover:border-[#66c0f4]/50 transition-colors">
                                                <span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all">{acc.username}</span>
                                                <button 
                                                    onClick={() => handleCopy(acc.username, idx, 'user')}
                                                    className="text-[#66c0f4] hover:text-blue-600 dark:hover:text-white p-1.5 rounded hover:bg-[#66c0f4]/20 transition-all shrink-0"
                                                    title="Copy Username"
                                                >
                                                    {copiedIndex?.idx === idx && copiedIndex.type === 'user' ? <Icon name="Check" size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Icon name="Copy" size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-[#8f98a0] uppercase tracking-wider">Password</label>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#171a21] p-2 rounded border border-slate-200 dark:border-[#2a475e] group-hover:border-[#66c0f4]/50 transition-colors">
                                                <span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all">{acc.password}</span>
                                                <button 
                                                    onClick={() => handleCopy(acc.password, idx, 'pass')}
                                                    className="text-[#66c0f4] hover:text-blue-600 dark:hover:text-white p-1.5 rounded hover:bg-[#66c0f4]/20 transition-all shrink-0"
                                                    title="Copy Password"
                                                >
                                                    {copiedIndex?.idx === idx && copiedIndex.type === 'pass' ? <Icon name="Check" size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Icon name="Copy" size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {acc.games && (
                                        <div className="pt-3 border-t border-slate-100 dark:border-[#2a475e]/50">
                                            <div className="flex items-start gap-2">
                                                <Icon name="DeviceGamepad2" size={16} className="text-slate-400 dark:text-[#8f98a0] mt-0.5 shrink-0" />
                                                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-[#c5c3c0] leading-relaxed line-clamp-2 sm:line-clamp-none">
                                                    <span className="text-slate-500 dark:text-[#8f98a0] font-bold">Includes: </span>
                                                    {acc.games}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                
                <div className="p-3 sm:p-4 bg-slate-100 dark:bg-[#171a21] border-t border-slate-200 dark:border-[#2a475e] text-center shrink-0">
                    <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#8f98a0]">
                        Please do not change passwords. These are community accounts.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// MASTER GIFT MODAL
const MasterGiftModal: React.FC<{ open: boolean; onClose: () => void; accounts: MasterGiftAccount[] }> = ({ open, onClose, accounts }) => {
    const [copiedIndex, setCopiedIndex] = useState<{idx: number, type: 'email' | 'pass'} | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4; // Show 4 items per page for Master Gift
    
    const handleCopy = (text: string, idx: number, type: 'email' | 'pass') => {
        navigator.clipboard.writeText(text);
        setCopiedIndex({ idx, type });
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const totalPages = Math.ceil(accounts.length / ITEMS_PER_PAGE);
    const currentAccounts = accounts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-2 sm:p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-zinc-950 w-[95%] md:w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[85vh] sm:max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 sm:p-6 flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                            <Icon name="Gift" size={28} className="text-yellow-400 sm:w-8 sm:h-8 animate-pulse" /> 
                            <span className="truncate">Master Gift</span>
                        </h3>
                        <p className="text-violet-100 text-[10px] sm:text-sm font-bold mt-1">
                            Exclusive Premium Accounts • <span className="text-yellow-400">{accounts.length} Available</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white relative z-10 shrink-0 shadow">
                        <Icon name="X" size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>
                
                {/* List */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50 dark:bg-zinc-950">
                    {accounts.length === 0 ? (
                        <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                            <div className="w-20 h-20 bg-slate-200 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-slate-300 dark:border-zinc-800">
                                <Icon name="Gift" size={40} className="text-slate-400 dark:text-zinc-600 opacity-50"/>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-zinc-300 mb-2">No Gifts Right Now</h4>
                            <p className="text-sm text-slate-500 dark:text-zinc-500">We continuously restock new premium accounts. Check back later!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                {currentAccounts.map((acc, index) => {
                                    const actualIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                                    const statusRaw = acc.status?.toString().trim() || 'Online';
                                    const isOffline = statusRaw.toLowerCase() === 'offline' || statusRaw.toLowerCase() === 'dead';
                                    return (
                                        <div key={actualIndex} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 hover:border-violet-500/50 transition-all shadow-sm hover:shadow-violet-500/10 group relative flex flex-col h-full">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-3">
                                                    {acc.logo ? (
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 shadow flex items-center justify-center">
                                                            <img src={acc.logo} alt={acc.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-xs font-bold text-zinc-500 uppercase">' + acc.name.substring(0, 2) + '</span>'; }} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow">
                                                            {acc.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white capitalize tracking-tight line-clamp-1">{acc.name}</h4>
                                                        {acc.url && <a href={acc.url} target="_blank" rel="noreferrer" className="text-[10px] text-violet-500 hover:text-violet-400 hover:underline flex items-center gap-1 font-semibold w-fit"><Icon name="ExternalLink" size={10} /> Visit Service</a>}
                                                    </div>
                                                </div>
                                                {/* Status Badge */}
                                                <div className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border shrink-0 ${
                                                    isOffline 
                                                    ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                                                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                }`}>
                                                    {statusRaw}
                                                </div>
                                            </div>

                                            <div className="space-y-3 mt-auto">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Email / Username</label>
                                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-950 p-2 rounded-lg border border-slate-200 dark:border-zinc-800 group-hover:border-violet-500/30 transition-colors">
                                                        <Icon name="Mail" size={14} className="text-zinc-400 shrink-0 ml-1" />
                                                        <span className="text-xs font-mono text-slate-900 dark:text-zinc-300 truncate flex-1 select-all">{acc.email}</span>
                                                        <button 
                                                            onClick={() => handleCopy(acc.email, actualIndex, 'email')}
                                                            className="text-violet-500 hover:text-white hover:bg-violet-600 p-1.5 rounded transition-colors shrink-0 flex items-center justify-center w-7 h-7"
                                                            title="Copy Email"
                                                        >
                                                            {copiedIndex?.idx === actualIndex && copiedIndex.type === 'email' ? <Icon name="Check" size={14} className="text-emerald-500" /> : <Icon name="Copy" size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Password</label>
                                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-950 p-2 rounded-lg border border-slate-200 dark:border-zinc-800 group-hover:border-violet-500/30 transition-colors">
                                                        <Icon name="Key" size={14} className="text-zinc-400 shrink-0 ml-1" />
                                                        <span className="text-xs font-mono text-slate-900 dark:text-zinc-300 truncate flex-1 select-all">{acc.password}</span>
                                                        <button 
                                                            onClick={() => handleCopy(acc.password, actualIndex, 'pass')}
                                                            className="text-violet-500 hover:text-white hover:bg-violet-600 p-1.5 rounded transition-colors shrink-0 flex items-center justify-center w-7 h-7"
                                                            title="Copy Password"
                                                        >
                                                            {copiedIndex?.idx === actualIndex && copiedIndex.type === 'pass' ? <Icon name="Check" size={14} className="text-emerald-500" /> : <Icon name="Copy" size={14} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-zinc-800">
                                    <div className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">
                                        Showing <span className="font-bold text-violet-500">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-bold text-violet-500">{Math.min(currentPage * ITEMS_PER_PAGE, accounts.length)}</span> of <span className="font-bold text-violet-500">{accounts.length}</span> gifts
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg bg-slate-100/50 dark:bg-zinc-900/50 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-zinc-800 transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                        >
                                            <Icon name="ChevronLeft" size={14} /> Prev
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                                                        currentPage === page 
                                                        ? 'bg-violet-600 text-white shadow shadow-violet-500/20' 
                                                        : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg bg-slate-100/50 dark:bg-zinc-900/50 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-zinc-800 transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                        >
                                            Next <Icon name="ChevronRight" size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="p-3 sm:p-4 bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 text-center shrink-0">
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold flex items-center justify-center gap-2">
                        <Icon name="Info" size={12} className="text-violet-500" /> 
                        These accounts belong to the community. Please don't change the passwords!
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// DONATE MODAL
const DonateModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [iframeLoaded, setIframeLoaded] = useState(false);

    if (!open) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[360px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
                            <Icon name="Heart" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Support Us</h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Keep the servers alive</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        <Icon name="X" size={18} />
                    </button>
                </div>
                
                <div className="p-5 flex flex-col items-center justify-center w-full bg-slate-50 dark:bg-slate-900 relative min-h-[400px]">
                    {!iframeLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="text-pink-500"
                            >
                                <Icon name="Loader2" size={24} />
                            </motion.div>
                            <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Loading Gateway</p>
                        </div>
                    )}
                    <iframe 
                        src="https://trocador.app/anonpay/?ticker_to=xmr&network_to=Mainnet&address=4A1aLQiLKP9MppgCFYHWhM8GNP9eoxEQBQpAWKuiNaD5C2kLmrG2aM9cSK2pncFNNgKCCKbtqNrijAEampjek7SM7BsUFvX&donation=True&name=SecretArea&description=Support+the+website&email=nexa1337agency@gmail.com&bgcolor=00000000" 
                        width="310" 
                        height="350" 
                        className="bg-white dark:bg-slate-100 rounded-xl"
                        style={{ border: 0, opacity: iframeLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }} 
                        scrolling="no"
                        onLoad={() => setIframeLoaded(true)}
                    ></iframe>
                    
                    <div className="mt-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3 w-[310px]">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                            <Icon name="Wallet" size={18} />
                        </div>
                        <div className="text-left flex-1">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">No crypto wallet?</h4>
                            <p className="text-[10px] text-slate-600 dark:text-slate-500 leading-relaxed font-medium">
                                You can use <a href="https://exodus.com/" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-bold">Exodus</a>, <a href="https://cakewallet.com/" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-bold">Cake Wallet</a>, or another wallet to exchange and send.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// REQUEST MODAL
const RequestModal: React.FC<{ open: boolean; onClose: () => void; onSubmit: (data: any) => Promise<void>; initialTitle?: string; allResources?: Record<string, ResourceItem[]> }> = ({ open, onClose, onSubmit, initialTitle = '', allResources = {} }) => {
    const [formData, setFormData] = useState({ title: initialTitle, category: 'Game', image: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [duplicateItem, setDuplicateItem] = useState<ResourceItem | null>(null);
    const [autoCategorized, setAutoCategorized] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData(prev => ({ ...prev, title: initialTitle }));
        }
    }, [open, initialTitle]);

    // Smart Features Effect
    useEffect(() => {
        if (!formData.title || formData.title.length < 3) {
            setDuplicateItem(null);
            return;
        }

        const query = formData.title.toLowerCase();

        // 1. Duplicate Detection
        let foundMatch = null;
        for (const category in allResources) {
            const match = allResources[category].find(item => item.name.toLowerCase() === query || item.name.toLowerCase().includes(query));
            if (match) {
                foundMatch = match;
                break;
            }
        }
        setDuplicateItem(foundMatch || null);

        // 2. Auto-Categorization
        const toolKeywords = ['adobe', 'autocad', 'photoshop', 'illustrator', 'office', 'windows', 'software', 'revit', 'sketchup', 'blender', '3ds max', 'lumion', 'v-ray', 'unreal engine', 'd5 render', 'twinmotion', 'archicad', 'intellij', 'webstorm', 'pycharm', 'clip studio'];
        const steamToolKeywords = ['steam', 'bypass', 'tool', 'unlocker', 'greenluma', 'koalageddon', 'creamapi', 'autocreamapi', 'goldberg', 'steamworks'];
        const hypervisorKeywords = ['hypervisor', 'kvm', 'qemu', 'vmware', 'virtualbox', 'anti-cheat bypass', 'hyper-v', 'vt-x', 'amd-v'];
        const saveKeywords = ['save', 'savegame', '100%', 'completed', 'completion', 'platinum', 'unlock all'];

        let suggestedCategory = 'Game';
        if (saveKeywords.some(kw => query.includes(kw))) {
            suggestedCategory = 'SaveGame';
        } else if (hypervisorKeywords.some(kw => query.includes(kw))) {
            suggestedCategory = 'Hypervisor';
        } else if (toolKeywords.some(kw => query.includes(kw))) {
            suggestedCategory = 'Tools';
        } else if (steamToolKeywords.some(kw => query.includes(kw))) {
            suggestedCategory = 'SteamTools';
        }

        if (suggestedCategory !== formData.category && !autoCategorized) {
            setFormData(prev => ({ ...prev, category: suggestedCategory }));
            setAutoCategorized(true);
        }

    }, [formData.title, allResources]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({...formData, category: e.target.value});
        setAutoCategorized(true); // Prevent auto-changing it again
    };

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
        setFormData({ title: '', category: 'Game', image: '', message: '' });
        setAutoCategorized(false);
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-4"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 w-[95%] sm:w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30 flex flex-col max-h-[90vh]"
            >
                <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Icon name="Plus" size={20} className="text-blue-500" /> Request Item
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon name="X" size={18} />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Item Title *</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Call of Duty: Black Ops 6"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        {/* Smart Duplicate Warning */}
                        <AnimatePresence>
                            {duplicateItem && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3 overflow-hidden"
                                >
                                    <Icon name="AlertTriangle" size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Already in Area?</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            We found <strong>{duplicateItem.name}</strong> in the {duplicateItem.category} section. Are you sure you want to request it?
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Section</label>
                            <select 
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                value={formData.category}
                                onChange={handleCategoryChange}
                            >
                                <option value="Game">Game</option>
                                <option value="Hypervisor">Hypervisor</option>
                                <option value="SteamTools">SteamTools</option>
                                <option value="Tools">Tools</option>
                                <option value="SaveGame">SaveGame</option>
                            </select>
                            {autoCategorized && formData.title.length > 2 && (
                                <p className="text-[10px] text-blue-500 mt-1.5 flex items-center gap-1 font-bold uppercase tracking-wider">
                                    <Icon name="Wand2" size={10} /> Auto-categorized based on title
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Image URL (Optional)</label>
                            <input 
                                type="url" 
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Message to Admin (Optional)</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Any specific version or details?"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="Send" size={18} />}
                            {loading ? 'Transmitting...' : 'Send Request'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};
const Footer: React.FC<{ onSupportClick?: () => void }> = ({ onSupportClick }) => (
  <footer className="w-full mt-2 pt-2 pb-8 flex justify-center items-center gap-4 relative z-20">
     <a id="join-community-btn" href={DISCORD_LINK} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#5865F2] hover:shadow-lg hover:shadow-[#5865F2]/20 transition-all border border-slate-200 dark:border-slate-800">
        <Icon name="Discord" size={20} />
     </a>
     <a id="telegram-btn" href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="relative w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#229ED9] hover:shadow-lg hover:shadow-[#229ED9]/20 transition-all border border-slate-200 dark:border-slate-800">
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center z-20">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ animation: 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
        </span>
        <Icon name="Telegram" size={20} />
     </a>
     {onSupportClick && (
         <button onClick={onSupportClick} className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-pink-500/30 transition-all border border-pink-400 group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
            <Icon name="Heart" size={20} className="group-hover:animate-pulse" />
         </button>
     )}
  </footer>
);
const AdBanner: React.FC<{ desktopSrc: string, mobileSrc: string, link: string, className?: string }> = ({ desktopSrc, mobileSrc, link, className }) => (
  <a href={link} target="_blank" rel="noreferrer" className={`relative block w-full max-w-[320px] md:max-w-[970px] mx-auto aspect-[32/10] md:aspect-[97/25] group overflow-hidden rounded-2xl transition-all duration-500 bg-slate-100 dark:bg-slate-900/50 ${className || ''}`}>
    {/* Animated glow effect behind the image */}
    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out -skew-x-12 z-10 pointer-events-none" />
    
    {/* Sponsored Badge */}
    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white/90 px-2 py-1 rounded-md border border-white/10 text-[9px] md:text-[10px] font-medium tracking-wide transition-all duration-300 group-hover:bg-black/60 shadow-sm">
        <Icon name="Info" size={12} className="text-white/70" />
        <span>Sponsored</span>
    </div>

    <picture className="w-full h-full block">
        <source media="(min-width: 768px)" srcSet={desktopSrc} />
        <img src={mobileSrc} alt="Advertisement" className="w-full h-full object-cover transform group-hover:scale-105 md:group-hover:scale-[1.02] transition-transform duration-700" loading="lazy" />
    </picture>
  </a>
);

const GameCarousel: React.FC<{ games: UpcomingGame[], loading: boolean, errorState: { missing: boolean, script: boolean } }> = ({ games, loading, errorState }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [games]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 640) setItemsPerView(1.2); 
            else if (w < 768) setItemsPerView(2.2); 
            else if (w < 1024) setItemsPerView(3.2); 
            else if (w < 1280) setItemsPerView(4.2); 
            else setItemsPerView(5); 
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isHovered || games.length === 0 || errorState.missing || errorState.script) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex, isHovered, games.length, itemsPerView, errorState]);

    const handleNext = () => {
        setCurrentIndex((prev) => {
            const maxIndex = games.length - Math.floor(itemsPerView);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const maxIndex = games.length - Math.floor(itemsPerView);
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) handleNext();
        if (touchStartX.current - touchEndX.current < -50) handlePrev();
    };

    if (errorState.missing || errorState.script) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl border border-red-200 dark:border-red-900/30">
                <Icon name="Bug" size={32} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">{errorState.script ? "Script Error" : "Backend Mismatch"}</span>
                <span className="text-[10px] mt-1 opacity-70">{errorState.script ? "Invalid API response." : "'upcoming' tab not found."}</span>
            </div>
        );
    }

    if (loading && games.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl">
                <Icon name="Database" size={32} className="mb-2 opacity-50 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Syncing Data...</span>
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl">
                <Icon name="Ghost" size={32} className="mb-2 opacity-50" />
                <span className="text-xs font-bold uppercase tracking-widest">No Upcoming Games Found</span>
            </div>
        );
    }

    return (
        <div 
            className="relative w-full group select-none"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <motion.div 
                    className="flex"
                    animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {games.map((game) => (
                        <div 
                            key={game.id}
                            style={{ width: `${100 / itemsPerView}%` }}
                            className="flex-shrink-0 p-1"
                        >
                            <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden group/card shadow-sm hover:shadow-lg transition-all duration-300">
                                <img 
                                    src={game.image} 
                                    alt={game.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 md:backdrop-blur-md border border-white/10 mb-1.5 max-w-full">
                                        <Icon name={game.icon} size={10} className="text-white shrink-0" />
                                        <span className="text-[8px] font-bold text-white uppercase tracking-wider truncate">
                                            {formatPlatformDisplay(game.platform)}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-xs md:text-sm text-white leading-tight line-clamp-2 drop-shadow-md group-hover/card:text-primary-400 transition-colors">
                                        {game.title}
                                    </h3>
                                    <div className="mt-1 flex justify-between items-center">
                                        <span className="font-mono font-bold text-emerald-400 text-[10px] drop-shadow-md bg-black/40 px-1.5 rounded">
                                            {game.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handlePrev} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronLeft" size={20} />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handleNext} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronRight" size={20} />
                </button>
            </div>
        </div>
    );
};

const RecentProductsCarousel: React.FC<{ 
    items: ResourceItem[], 
    loading: boolean, 
    onSelect: (item: ResourceItem) => void,
    stash: string[],
    toggleStash: (id: string, e?: React.MouseEvent) => void
}> = ({ items, loading, onSelect, stash, toggleStash }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [items]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 640) setItemsPerView(1.2); 
            else if (w < 768) setItemsPerView(2.2); 
            else if (w < 1024) setItemsPerView(3.2); 
            else if (w < 1280) setItemsPerView(4.2); 
            else setItemsPerView(5); 
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isHovered || items.length === 0) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex, isHovered, items.length, itemsPerView]);

    const handleNext = () => {
        setCurrentIndex((prev) => {
            const maxIndex = items.length - Math.floor(itemsPerView);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const maxIndex = items.length - Math.floor(itemsPerView);
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) handleNext();
        if (touchStartX.current - touchEndX.current < -50) handlePrev();
    };

    if (loading && items.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl">
                <Icon name="Database" size={32} className="mb-2 opacity-50 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading Recent Products...</span>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div 
            className="relative w-full group select-none"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <motion.div 
                    className="flex"
                    animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {items.map((item, idx) => (
                        <div 
                            key={`${item.id}-${idx}`}
                            style={{ width: `${100 / itemsPerView}%` }}
                            className="flex-shrink-0 p-1"
                        >
                            <div 
                                onClick={() => onSelect(item)}
                                className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden group/card shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <img 
                                    src={item.coverImage} 
                                    alt={item.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity"></div>
                                
                                {item.isFree && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 z-20">
                                        <Icon name="Tag" size={10} /> Free
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg z-20">
                                    {item.category === 'steamtools' ? 'STEAMTOOLS' : item.category === 'extra' ? 'SAVEGAME' : item.category.toUpperCase()}
                                </div>

                                <button
                                    onClick={(e) => toggleStash(item.id, e)}
                                    className={`absolute top-2 right-2 z-40 p-1.5 rounded-full md:backdrop-blur-md transition-all ${
                                        stash.includes(item.id) 
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                                        : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10'
                                    } ${item.isFree ? 'top-10' : ''}`}
                                    title={stash.includes(item.id) ? "Remove from Stash" : "Add to Stash"}
                                >
                                    <Icon name="Bookmark" size={12} className={stash.includes(item.id) ? "fill-current" : ""} />
                                </button>

                                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                    <h3 className="font-black text-xs md:text-sm text-white leading-tight line-clamp-2 drop-shadow-md group-hover/card:text-primary-400 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="mt-1 flex justify-between items-center">
                                        <span className="font-mono font-bold text-slate-300 text-[10px] drop-shadow-md bg-black/40 px-1.5 rounded">
                                            {item.version}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handlePrev} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronLeft" size={20} />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handleNext} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronRight" size={20} />
                </button>
            </div>
        </div>
    );
};

const UpcomingListsDisplay: React.FC<{ lists: { [key: string]: string[] } }> = ({ lists }) => {
    const [activeCategory, setActiveCategory] = useState<string>('game');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const tabs = ['game', 'hypervisor', 'steamtools', 'tools', 'savegames'];
    
    const handleCategoryChange = (tab: string) => {
        setActiveCategory(tab);
        setCurrentPage(1);
    };

    const getBgImage = (category: string) => {
        switch (category) {
            case 'game':
            case 'hypervisor':
                return 'https://webvator.com/wp-content/uploads/2025/10/1712163651504.jpg';
            case 'steamtools':
                return 'https://cdn.fastly.steamstatic.com/store/home/store_home_share.jpg';
            case 'tools':
                return 'https://img.magnific.com/premium-photo/hacker-guy-black-clothes-wearing-mask-with-laptop-funny-comic-3d-illustration-white_926199-4299052.jpg';
            case 'savegames':
                return 'https://www.coordinated.com/hubfs/Blog%20Images/bigstock--191129032.jpg';
            default:
                return 'https://webvator.com/wp-content/uploads/2025/10/1712163651504.jpg';
        }
    };

    const fullList = lists[activeCategory] || [];
    const totalPages = Math.ceil(fullList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const activeList = fullList.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="w-full bg-white dark:bg-[#1e232d] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors">
            {/* Faded Background Image */}
            <div className="absolute top-0 right-0 bottom-0 w-full md:w-2/3 pointer-events-none opacity-20 dark:opacity-10 transition-opacity duration-500">
                <motion.img 
                    key={activeCategory}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={getBgImage(activeCategory)} 
                    alt={`${activeCategory} Background`} 
                    className="w-full h-full object-cover md:object-right"
                    style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)' }}
                />
            </div>
            
            <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    UPCOMING <span className="text-emerald-500 dark:text-emerald-400">RELEASES</span>
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 mb-6 sm:mb-8 uppercase tracking-widest">
                    <span>{new Date().toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleCategoryChange(tab)}
                            className={`px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-sm border ${
                                activeCategory === tab 
                                ? 'bg-emerald-500 text-white border-emerald-500 scale-105' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* List Items */}
                <div className="space-y-2 sm:space-y-3 min-h-[300px]">
                    {activeList.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-400 dark:text-slate-600 text-sm italic py-8"
                        >
                            No upcoming {activeCategory} listed.
                        </motion.div>
                    ) : (
                        activeList.map((item, idx) => {
                            const hasArrow = item.trim().startsWith('---') || item.trim().startsWith('->');
                            const displayItem = hasArrow ? item.replace(/^[-]+>*\s*/, '') : item;
                            
                            const isTop5 = idx < 5;
                            const textColor = isTop5 
                                ? "text-emerald-600 dark:text-emerald-400" 
                                : "text-blue-600 dark:text-blue-400";
                            const arrowColor = isTop5
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-blue-500 dark:text-blue-400";

                            return (
                                <motion.div 
                                    key={`${activeCategory}-${currentPage}-${idx}`} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="flex items-start gap-2 sm:gap-3 group"
                                >
                                    <span className={`${arrowColor} font-mono text-xs sm:text-sm tracking-tighter mt-1 opacity-70 group-hover:opacity-100 transition-opacity`}>---&gt;</span>
                                    <span className={`${textColor} font-bold text-sm sm:text-base md:text-lg leading-snug tracking-tight drop-shadow-sm group-hover:brightness-125 transition-all`}>
                                        {displayItem}
                                    </span>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Icon name="ChevronLeft" size={20} />
                        </button>
                        <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            PAGE {currentPage} OF {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Icon name="ChevronRight" size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const HypervisorGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-4"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full h-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-bold text-sm">
              <Icon name="ArrowLeft" size={16} /> Back to Product
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Icon name="ShieldAlert" size={28} className="text-red-500" />
              Hypervisor Guide
            </h2>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <Icon name="X" size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <article id="post-74689" className="post-74689 page type-page status-publish hentry">
            <div className="entry-content space-y-4">
              <p><span style={{ color: 'red' }} className="font-bold">This page is a work-in-progress and will be updated.</span></p>
              <p>This article is partially based on RessourectoR’s (admin of cs.rin.ru site) article:</p>
              <p><a href="https://cs.rin.ru/forum/viewtopic.php?f=10&amp;t=156407" target="_blank" style={{ fontSize: '20px' }} rel="noopener" className="text-blue-500 hover:underline break-all">https://cs.rin.ru/forum/viewtopic.php?f=10&amp;t=156407</a></p>
              <p>I highly recommend to open and read it at least one time. It’s more complex than this page and covers more security topics.</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">What are Hypervisor Cracks?</h3>
              <p>Denuvo Hypervisor Crack or Bypass refers to advanced techniques that leverage virtualization at a very low level (often using a custom or modified hypervisor) to interfere with how the protection monitors the system. Denuvo relies heavily on integrity checks, timing analysis, and detection of debugging or emulation environments. A hypervisor-based approach allows an attacker to sit “under” the operating system, transparently controlling CPU behavior, intercepting instructions, and masking signs of analysis without modifying the protected executable directly.</p>
              <p>Instead of patching the game binary, the hypervisor can emulate or alter specific CPU instructions, fake timing results, or hide breakpoints and memory changes, effectively tricking Denuvo into believing everything is running on a normal, untampered system. This makes the protection much harder to detect or react to, since its checks are being handled outside its visibility. These methods are extremely complex and are typically explored by highly skilled reverse engineers, as they require deep knowledge of CPU virtualization, kernel internals, and anti-tamper mechanisms.</p>
              <p>Officially, only signed drivers can work at such low level. Due to the piracy nature of Denuvo Hypervisor drivers, they will never receive Microsoft-approved certificate. And that’s why to use such “cracks” you need to make certain modifications to your system security settings, listed below. Please note, that those changes are intended to be made temporary, for the course of your gameplay session and then should be reverted after you quit the game.</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Windows virtualization-based security components</h3>
              <p>On modern systems with Secure Boot, TPM 2.0 and hardware-assisted virtualization capabilities, Windows 10 and 11 enable, mostly* by default, various security solutions via Virtualization-based Security (VBS). VBS is an umbrella term for using a bare-metal hypervisor, the Windows hypervisor, to create isolated virtual spaces that are safe from even a fully compromised OS, in which these security components run and monitor the OS or store confidential information.</p>
              <p>The following Windows components are such security solutions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><a href="https://learn.microsoft.com/en-us/windows/security/hardware-security/enable-virtualization-based-protection-of-code-integrity" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Memory Integrity (HVCI)</a>: Runs checks to detect malicious or at least unexpected modifications of Windows kernel code and restricts suspicious kernel memory allocations. For example, RessourectoR imagines this could protect against malicious software that is being run with administrative privileges and attempts to modify system files, or against memory security vulnerabilities in user-run applications.</li>
                <li><a href="https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/oem-credential-guard" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Credential Guard</a>: Stores access credentials, such as passwords, authentication data, biometric data etc. in an isolated environment.</li>
                <li><a href="https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/windows-hello" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Windows Hello</a>: Allows you to log in with convenient methods like a short PIN, facial recognition or fingerprint scan. RessourectoR has not found a direct source for this, but it probably prefers Credential Guard to store its highly sensitive data. The login methods it provides tend to break when some of the components above are disabled. It is also protected by System Guard, if that is enabled.</li>
                <li><a href="https://learn.microsoft.com/en-us/windows/security/hardware-security/how-hardware-based-root-of-trust-helps-protect-windows" target="_blank" rel="noopener" className="text-blue-500 hover:underline">System Guard (Secure Launch)</a>: An advanced system hardening framework that protects the OS boot process and <a href="https://en.wikipedia.org/wiki/System_Management_Mode" target="_blank" rel="noopener" className="text-blue-500 hover:underline">System Management Mode</a> (SMM, commonly used by the BIOS to run hardware configuration software) from (arguably sophisticated) rootkits. Such rootkits could compromise the hypervisor itself, so this protection is assisted by various hardware security features of modern processors. Backed by TPM 2.0, this also allows to monitor system integrity, including the other security components mentioned here, after boot continuously and verify it from a remote system.</li>
                <li>From what RessourectoR could find, this is cutting edge and not enabled by default.</li>
              </ul>
              <p>* Even though hardware and boot requirements are met, Windows sometimes seems to fail at enabling features that are supposed to be enabled automatically, such as VBS and memority integrity.</p>
              <p className="font-bold mt-4">Without the Windows hypervisor, none of these security features can be used. By design, the hypervisor cannot be disabled directly. Instead, all the above features that want to utilize VBS signal that it needs to be enabled, which then loads the hypervisor. Therefore, we must disable all those features to prevent the Windows hypervisor from being loaded.</p>
              <p className="font-bold">A boot option that prevents Hyper-V from loading the hypervisor also needs to be added.</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">I want to play that new Denuvo-protected game, is it safe to disable all this and use a hypervisor crack?</h3>
              <p>There is no simple answer. This is RessourectoR’s personal take as someone with 10 years of experience in security-focused system administration and only a casual interest in gaming.</p>
              <p>It’s true that the most common threats are info stealer malware from fake download buttons, ransomware that encrypts your files or joining a DDoS botnet. It’s supposed such malware is usually not interested in higher privilege escalation or hardware sabotage, if it can already access what it needs. It’s also true that the best protection against such malware is a good ad blocker, staying on trusted sites and user education.</p>
              <p>More experienced PC users develop a false sense of security from seeing how successfully they avoid malware infection by “being smart”. They argue that they don’t need all these restrictive, patronizing security features and AVs that just annoy with false positives, because their malware-free track record “proves” that they know better. They also argue that more advanced threats are not aimed at home users, but corporate networks and too unlikely to care about. Especially relevant for gamers: Virtualization can reduce system performance and whether that is noticeable or not is also a point of contention.</p>
              <p>The other side of the argument: You would be disabling technology that evolved from decades of security research, ignoring what experts consider necessary nowadays. You would willingly give up protections against common classes of software vulnerabilities and if you ever do get a more advanced malware, it can breeze right through so that your PC can stay part of a botnet for eternity or spread to more local network devices more easily. If a lot of people remove these protections – especially DSE and memory integrity – for gaming, one of the main use cases of Windows PCs at home, it might be worth the effort for malware authors to target such setups. Widespread usage of HV cracks could encourage manipulated fake releases, because people who download those can be expected to disable all protection, including AV exclusion. The knowledge and effort required to take precautions and verify files properly is higher than with common threats and the potential consequences much more severe.</p>
              <p>Aside from the disabled Windows features, even if you trust the authors of the hypervisor driver and even compile it yourself from source, a serious vulnerability in its code could instantly provide maximum and undetectable access to your system.</p>
              <p className="font-bold">Whether that game is worth the risks is something you will ultimately have to decide for yourself.</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">What’s inside those cracks?</h3>
              <p>Basically, every modern Hypervisor bypass/crack consists of two parts:</p>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  VBS.cmd: special command-line script, which checks your existing settings and modify them to make your system prepared for HV-cracks.
                  <p className="mt-2">This script is universal for all HV-games and is developed separately, it doesn’t depend on actual game cracks. You can download the latest version below:</p>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 my-4">
                    <a href="https://paste.fitgirl-repacks.site/?7bcd452c6412ca8a#7hF2cQmiRvFNqKWFmtUCF9D6k9MG9bFFZRfdgEUoy2Xm" target="_blank" rel="noopener" className="text-green-600 dark:text-green-400 font-bold hover:underline">Current version: v1.4 (Updated on March 26, 2026)</a>
                    <div className="mt-4">
                      <div className="font-bold mb-2">Changes log:</div>
                      <div className="text-sm space-y-2">
                        <p className="font-bold">v1.4</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Added Driver Signature Enforcement (DSE) and test signing detection. If test signing is already enabled, the script will skip the Startup Settings step, BitLocker suspension, and onetimeadvancedoptions entirely, as driver signature enforcement is already bypassed.</li>
                          <li>Fixed an issue where the Revert Changes option would incorrectly show “Nothing to revert, as no changes were previously applied.” when DSE was still disabled, even though a reboot was required to restore it.</li>
                          <li>Added FACEIT Anti-Cheat detection. If detected, the script will exit with a message asking the user to uninstall it before proceeding, as it is known to block the driver from loading.</li>
                          <li>Replaced PowerShell calls with full path via %psc% to avoid resolution issues when PowerShell is not in PATH.</li>
                          <li>Removed outdated comments.</li>
                          <li>Minor improvements.</li>
                          <li>We rely on user reports to identify and fix issues. If you encounter any problems, please report them at <a href="https://cs.rin.ru/forum/viewtopic.php?f=14&amp;t=156435" className="text-blue-500 hover:underline">https://cs.rin.ru/forum/viewtopic.php?f=14&amp;t=156435</a></li>
                        </ol>
                        <p className="font-bold mt-3">v1.3</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Fixed an issue where Credential Guard Scenarios registry key was being restored on revert even when Credential Guard itself was not running before the script was executed. CG and CG Scenarios are now tracked and reverted independently.</li>
                          <li>Fixed an issue where Memory Integrity (HVCI) would not be detected if it was configured but not yet running, which could keep VBS active. HVCI detection now checks both runtime status and registry configuration.</li>
                          <li>Added detection and removal of RequirePlatformSecurityFeatures when disabling VBS, which was causing VBS to remain enabled. The original value is backed up and restored accurately on revert.</li>
                          <li>Added detection and removal of the Enhanced Sign-in Security Scenarios key alongside the existing subkey, and reverts them independently.</li>
                          <li>Added a message informing the user when no security features needed to be disabled.</li>
                          <li>Minor improvements.</li>
                        </ol>
                        <p className="font-bold mt-3">v1.2</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Fixed a compatibility issue where launching the script from a 32-bit application, like Compact AutoRunner which is used in Hypervisor Launcher by FitGirl, would cause system tools such as bcdedit to not be found, due to System32 being redirected to SysWOW64 in 32-bit processes. This manifested as the Windows hypervisor showing as failed to disable, and UEFI lock removal failing entirely. The script now relaunches itself as a 64-bit process when this is detected. Thanks to galaxyxyz888 on Discord.</li>
                          <li>Fixed an issue where the Credential Guard Scenarios registry key was not being disabled, which could keep VBS active even when Credential Guard was not running. Thanks to sowhatnumber on Discord.</li>
                          <li>Fixed an issue where SecConfig.efi would not correctly return to the current OS after clearing a UEFI lock on dual-boot systems. Thanks to RessourectoR.</li>
                          <li>Fixed an issue where reverting the Windows hypervisor would incorrectly show as failed after a reboot on systems with UEFI locked VBS or HVCI, caused by SecConfig.efi clearing the hypervisorlaunchtype BCD entry during the UEFI lock removal process on boot.</li>
                          <li>Fixed an issue where the Revert Changes option would not show “No changes have been made” on systems that had previously agreed to UEFI lock removal, even when no features had actually been disabled, due to the UEFILockAgreed registry value being incorrectly counted as a tracked change.</li>
                          <li>Fixed an issue where the ManageVBS registry key was not being cleaned up correctly after reverting on systems that had agreed to UEFI lock removal.</li>
                          <li>Added test signing detection. If test signing is already enabled, the script will inform the user.</li>
                          <li>Minor visual improvements.</li>
                        </ol>
                        <p className="font-bold mt-3">v1.1</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Fixed a crash when the script path or filename contained spaces or special characters, such as when downloaded multiple times and renamed to VBS (1).cmd.</li>
                          <li>Fixed an issue where Enhanced Sign-in Security was preventing VBS from being disabled. A check has been added to disable it if detected. This mainly affected ROG Ally X users where it is enabled by default. Thanks to .oathkeeper213 on Discord and Azazel35 on Reddit.</li>
                          <li>Added support for disabling VBS, HVCI and Credential Guard when protected by a UEFI lock using SecConfig.efi. In the script, the user is advised to only proceed on personal devices before removing the UEFI lock. Note that on managed devices, VBS, HVCI and Credential Guard protected by a UEFI lock can only be disabled for one boot cycle. UEFI locks can be fully reverted using the Revert Changes option. Thanks to poce on Discord.</li>
                          <li>Added support for disabling VBS and HVCI mandatory mode. Note that reverting mandatory mode is not currently supported and must be re-enabled manually if needed.</li>
                          <li>Added a note in the script’s introduction regarding compatibility issues with kernel anti-cheats, specifically Vanguard, where disabling driver signature enforcement would result in a bug check (BSOD) in some system configurations, and FACEIT Anti-Cheat, which prevented the driver from loading with a multitude of different errors, most notably ERROR_ACCESS_DENIED, ERROR_INVALID_BLOCK and ERROR_NO_SYSTEM_RESOURCES. Thanks to xyz2theb on Reddit, deviljin0500, faintx11 &amp; xeros1 on Discord for reporting this.</li>
                          <li>Updated introductory notes.</li>
                          <li>Minor visual improvements.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  The Crack/Bypass itself
                  <p className="mt-2">Consists of EXEs/DLLs, which does the actual Denuvo bypassing + other additional DLLs, like Goldberg Steam emulator to get past the underlying Steam protection.</p>
                  <p className="mt-2">Those files work only for specific game versions, for which they were made. They won’t work on different game version or other games.</p>
                </li>
              </ol>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Pre-requirements</h3>
              <p>Your CPU must support one of two virtualization techniques: VT-x for Intel and AMD-V (SVM) for AMD.</p>
              <p>Google if CPU model supports virtualization to know if you can play HV-games.</p>
              <p>Before proceeding with HV cracks, check your BIOS for enabling those technologies.</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Do I need to disable Secure Boot or use EfiGuard?</h3>
              <p>No. Current HV bypasses do not require those changes.</p>
            </div>
          </article>
        </div>
      </motion.div>
    </motion.div>
  );
};

const analyzeRequirements = (reqs: {label: string, value: string}[]) => {
  let minRam = 0;
  let minOs = 0;
  let minGpuTier = 1;
  let minCpuTier = 1;
  
  reqs.forEach(req => {
    const label = req.label.toLowerCase();
    const val = req.value.toLowerCase();
    
    if (label.includes("memory") || label.includes("ram")) {
      const match = val.match(/(\d+)\s*gb/);
      if (match) minRam = parseInt(match[1]);
      else {
        const mbMatch = val.match(/(\d+)\s*mb/);
        if (mbMatch) minRam = parseInt(mbMatch[1]) / 1024;
      }
    }
    
    if (label.includes("os") || label.includes("system") || label.includes("windows")) {
      if (val.includes("11")) minOs = 11;
      else if (val.includes("10")) minOs = 10;
      else if (val.includes("8.1")) minOs = 8;
      else if (val.includes("8")) minOs = 8;
      else if (val.includes("7")) minOs = 7;
    }
    
    if (label.includes("graphics") || label.includes("gpu") || label.includes("video")) {
      if (val.match(/5090|5080|4090|4080|7900\s?xtx|7900\s?xt|3090|rx\s?6950|rx\s?6900|rx\s?7900/)) minGpuTier = 6;
      else if (val.match(/5070|4070\s?ti|4070|3080\s?ti|3080|6800\s?xt|6800|7800\s?xt|rx\s?7800/)) minGpuTier = 5;
      else if (val.match(/4060\s?ti|4060|3070\s?ti|3070|2080\s?ti|6750\s?xt|6700\s?xt|7700\s?xt|1080\s?ti/)) minGpuTier = 4;
      else if (val.match(/3060\s?ti|3060|2070\s?super|2070|2060\s?super|2060|1080|1070\s?ti|1070|6650\s?xt|6600\s?xt|6600|7600|rx\s?5700\s?xt|rx\s?5700|arc\s?a770/)) minGpuTier = 3;
      else if (val.match(/1660\s?ti|1660\s?super|1660|1650\s?super|1650|1060|1050\s?ti|980\s?ti|980|970|rx\s?590|rx\s?580|rx\s?570|rx\s?480|rx\s?470|arc\s?a750/)) minGpuTier = 2;
      else if (val.match(/1050|1030|960|950|750\s?ti|750|mx\d{3}|intel\s?hd|intel\s?uhd|iris\s?xe|vega\s?\d+/)) minGpuTier = 1;
      else if (val.match(/(\d+)\s*gb\s*vram|vram\s*(\d+)\s*gb/)) {
         const vramMatch = val.match(/(\d+)\s*gb\s*vram|vram\s*(\d+)\s*gb/);
         const vram = parseInt(vramMatch?.[1] || vramMatch?.[2] || "0");
         if (vram >= 16) minGpuTier = 5;
         else if (vram >= 12) minGpuTier = 4;
         else if (vram >= 8) minGpuTier = 3;
         else if (vram >= 4) minGpuTier = 2;
         else minGpuTier = 1;
      }
      else minGpuTier = 3;
    }
    
    if (label.includes("processor") || label.includes("cpu")) {
      if (val.match(/i9|ryzen\s?9|threadripper|core\s?ultra\s?9/)) minCpuTier = 5;
      else if (val.match(/i7|ryzen\s?7|core\s?ultra\s?7/)) minCpuTier = 4;
      else if (val.match(/i5|ryzen\s?5|core\s?ultra\s?5/)) minCpuTier = 3;
      else if (val.match(/i3|ryzen\s?3|pentium|celeron|athlon/)) minCpuTier = 2;
      else minCpuTier = 3;
    }
  });
  
  return { minRam, minOs, minGpuTier, minCpuTier };
};


export const checkCompatibilityStatus = (userSpecs: {ram: number, os: string, cpuTier: number, gpuTier: number}, reqs: {label: string, value: string}[]) => {
  if (!reqs || reqs.length === 0) return 'unknown';
  const parsedReqs = analyzeRequirements(reqs);
  let status: 'pass'|'fail'|'warn' = 'pass';

  if (parsedReqs.minRam > 0 && userSpecs.ram < parsedReqs.minRam) status = 'fail';
  if (parsedReqs.minOs > 0 && parseInt(userSpecs.os) < parsedReqs.minOs) status = 'fail';
  
  if (status !== 'fail') {
      if (parsedReqs.minGpuTier > 1 && userSpecs.gpuTier < parsedReqs.minGpuTier) status = 'warn';
      if (parsedReqs.minCpuTier > 1 && userSpecs.cpuTier < parsedReqs.minCpuTier) status = 'warn';
  }
  return status;
};

const SystemChecker: React.FC<{ reqs: {label: string, value: string}[] }> = ({ reqs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userSpecs, setUserSpecs] = useState({
    ram: 16,
    os: '10',
    cpuTier: 3,
    gpuTier: 3,
  });
  const [result, setResult] = useState<{status: 'pass'|'fail'|'warn', messages: string[]} | null>(null);

  const handleCheck = () => {
    const parsedReqs = analyzeRequirements(reqs);
    const messages = [];
    let status: 'pass'|'fail'|'warn' = 'pass';

    if (parsedReqs.minRam > 0) {
      if (userSpecs.ram < parsedReqs.minRam) {
        messages.push(`❌ RAM: You have ${userSpecs.ram}GB, but ${parsedReqs.minRam}GB is strictly required. Your system will likely crash or experience severe stuttering.`);
        status = 'fail';
      } else if (userSpecs.ram === parsedReqs.minRam) {
        messages.push(`⚠️ RAM: You have exactly ${userSpecs.ram}GB which is the minimum. Close background apps before running!`);
        if (status === 'pass') status = 'warn';
      } else {
        messages.push(`✅ RAM: Your ${userSpecs.ram}GB provides plenty of headroom over the required ${parsedReqs.minRam}GB.`);
      }
    }

    if (parsedReqs.minOs > 0) {
      const userOsNum = parseInt(userSpecs.os);
      if (userOsNum < parsedReqs.minOs) {
        messages.push(`❌ OS: You are running exactly Windows ${userOsNum}, but this requires Windows ${parsedReqs.minOs}+. It may refuse to launch.`);
        status = 'fail';
      } else {
        messages.push(`✅ OS: Windows ${userOsNum} perfectly meets the OS compatibility requirement.`);
      }
    }

    if (parsedReqs.minGpuTier > 1) {
      if (userSpecs.gpuTier < parsedReqs.minGpuTier) {
        messages.push(`⚠️ GPU: Your graphics processor is in tier ${userSpecs.gpuTier}, which is below the recommended tier ${parsedReqs.minGpuTier}. Expect low framerates; try setting all graphics to "Low" and using upscaling (FSR/DLSS).`);
        if (status === 'pass') status = 'warn';
      } else if (userSpecs.gpuTier === parsedReqs.minGpuTier) {
        messages.push(`✅ GPU: Your graphics processor meets the minimum target. You should get playable framerates on medium-to-low settings.`);
      } else {
        messages.push(`🚀 GPU: Excellent! Your chosen GPU is above the recommended specifications. Enjoy high fidelity gameplay.`);
      }
    }

    if (parsedReqs.minCpuTier > 1) {
      if (userSpecs.cpuTier < parsedReqs.minCpuTier) {
        messages.push(`⚠️ CPU: Your processor (tier ${userSpecs.cpuTier}) might bottleneck this software (tier ${parsedReqs.minCpuTier} expected). You may experience long load times and sudden stutters.`);
        if (status === 'pass') status = 'warn';
      } else {
        messages.push(`✅ CPU: Your processor easily handles the compute requirements! No bottlenecks expected.`);
      }
    }

    if (messages.length === 0) {
      messages.push("✅ No specific heavy requirements detected. Your system should handle this flawlessly.");
    } else if (status === 'pass') {
      messages.push("✨ SUMMARY: Incredible specs! You exceed all major requirements for this software.");
    } else if (status === 'warn') {
      messages.push("🚧 SUMMARY: Proceed with caution. The software will likely run, but you may need to reduce settings or close background apps to maintain stability.");
    } else if (status === 'fail') {
      messages.push("🚨 SUMMARY: System failure expected. Your current specifications fall critically below the minimum required limits.");
    }

    setResult({ status, messages });
  };

  return (
    <div className="mt-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
            <Icon name="Cpu" size={20} />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Can I Run It? (Smart Check)</span>
        </div>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={20} className="text-slate-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Operating System</label>
                <select 
                  value={userSpecs.os}
                  onChange={(e) => setUserSpecs({...userSpecs, os: e.target.value})}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="7">Windows 7</option>
                  <option value="8">Windows 8</option>
                  <option value="10">Windows 10</option>
                  <option value="11">Windows 11</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">RAM (GB)</label>
                <select 
                  value={userSpecs.ram}
                  onChange={(e) => setUserSpecs({...userSpecs, ram: parseInt(e.target.value)})}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="4">4 GB</option>
                  <option value="8">8 GB</option>
                  <option value="16">16 GB</option>
                  <option value="32">32 GB</option>
                  <option value="64">64+ GB</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Processor (CPU)</label>
                <select 
                  value={userSpecs.cpuTier}
                  onChange={(e) => setUserSpecs({...userSpecs, cpuTier: parseInt(e.target.value)})}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="1">Basic Dual Core (Older Intel/AMD)</option>
                  <option value="2">Standard Quad Core (i3 / Ryzen 3)</option>
                  <option value="3">Solid 6-Core (i5 / Ryzen 5)</option>
                  <option value="4">High-End 8+ Core (i7 / Ryzen 7)</option>
                  <option value="5">Enthusiast (i9 / Ryzen 9)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Graphics (GPU)</label>
                <select 
                  value={userSpecs.gpuTier}
                  onChange={(e) => setUserSpecs({...userSpecs, gpuTier: parseInt(e.target.value)})}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="1">Integrated Graphics (Intel HD / AMD APU)</option>
                  <option value="2">Entry Level (GTX 1050 / RX 560)</option>
                  <option value="3">Mid Range (RTX 3060 / RX 6600)</option>
                  <option value="4">High End (RTX 4070 / RX 7800)</option>
                  <option value="5">Ultra (RTX 4080 / RX 7900 XTX)</option>
                  <option value="6">Enthusiast / Next-Gen (RTX 5090 / 4090)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleCheck}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary-600/20"
            >
              Check Compatibility
            </button>

            {result && (
              <div className={`p-4 rounded-xl border ${result.status === 'pass' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : result.status === 'warn' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                <h4 className={`font-black uppercase tracking-wider mb-3 ${result.status === 'pass' ? 'text-emerald-600 dark:text-emerald-400' : result.status === 'warn' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.status === 'pass' ? 'Looks Good to Go!' : result.status === 'warn' ? 'Might Struggle a Bit' : 'Probably Won\'t Run Well'}
                </h4>
                <div className="space-y-2">
                  {result.messages.map((msg, idx) => {
                    const iconName = msg.startsWith('❌') ? 'XCircle' : msg.startsWith('⚠️') ? 'AlertTriangle' : msg.startsWith('✅') ? 'CheckCircle2' : msg.startsWith('🚀') ? 'Rocket' : msg.startsWith('✨') ? 'Sparkles' : msg.startsWith('🚧') ? 'HardHat' : msg.startsWith('🚨') ? 'AlertOctagon' : 'Info';
                    return (
                    <div key={idx} className="flex gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Icon name={iconName as any} size={16} className={`shrink-0 mt-0.5 ${msg.startsWith('❌') || msg.startsWith('🚨') ? 'text-red-500' : msg.startsWith('⚠️') || msg.startsWith('🚧') ? 'text-yellow-500' : msg.startsWith('✅') || msg.startsWith('✨') || msg.startsWith('🚀') ? 'text-emerald-500' : 'text-slate-500'}`} />
                      <span>{msg.replace(/^(❌|⚠️|✅|🚀|✨|🚧|🚨)\s*/, '')}</span>
                    </div>
                  )})}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NoteModal: React.FC<{
  content: string;
  onClose: () => void;
}> = ({ content, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 md:backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 10 }}
      className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 relative"
      onClick={e => e.stopPropagation()}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 p-2 rounded-full transition-all"
      >
        <Icon name="X" size={16} />
      </button>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 pr-8 flex items-center gap-2">
        <Icon name="Info" size={20} className="text-emerald-500" /> Note
      </h3>
      <div className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
        {content}
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
          Close
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const CompanyProfileModal: React.FC<{
  profile: CompanyProfile;
  resources: ResourceItem[];
  onClose: () => void;
  onItemClick: (item: ResourceItem) => void;
}> = ({ profile, resources, onClose, onItemClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [imgError, setImgError] = useState(false);
  const itemsPerPage = 24;

  useEffect(() => {
    setImgError(false);
  }, [profile.logoUrl]);

  const categories = Array.from(new Set(resources.map(r => r.category)));
  categories.unshift('all');

  const filteredResources = activeCategory === 'all' 
      ? resources 
      : resources.filter(r => r.category === activeCategory);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage) || 1;
  const currentItems = filteredResources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
    >
      <div className="flex-none p-4 md:p-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 md:backdrop-blur-md">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center p-2 relative group">
             {!imgError && profile.logoUrl ? (
               <>
                 <img src={profile.logoUrl} alt={profile.name} referrerPolicy="no-referrer" className="w-full h-full object-contain" onError={() => setImgError(true)} />
               </>
             ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                   <Icon name="Briefcase" size={32} className="text-slate-300 dark:text-slate-600" />
                </div>
             )}
          </div>
          <div>
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 md:mb-2">{profile.name}</h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-3xl line-clamp-2 md:line-clamp-none leading-relaxed">{profile.description || 'Welcome to this company\'s profile. Explore their ecosystem of products and releases below.'}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 md:p-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700 ml-4">
           <Icon name="X" size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
           {categories.map(cat => (
              <button
                 key={cat}
                 onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                 className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeCategory === cat 
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 border border-primary-500' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-500/50'
                 }`}
              >
                 {cat === 'all' ? 'All Products' : (cat === 'steamtools' ? 'SteamTools' : cat)}
                 <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${activeCategory === cat ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                     {cat === 'all' ? resources.length : resources.filter(r => r.category === cat).length}
                 </span>
              </button>
           ))}
        </div>

        {currentItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
            {currentItems.map(item => (
               <div 
                  key={item.id} 
                  onClick={() => onItemClick(item)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-sm hover:shadow-xl flex flex-col h-full"
               >
                  <div className="aspect-[9/16] bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                     <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"  loading="lazy" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                     <div className="absolute top-2 inset-x-2 flex justify-between items-start">
                         <div className="bg-primary-600 text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-md">
                             {(item.category || '').toUpperCase()}
                         </div>
                         {item.version && (
                             <div className="bg-slate-900/80 md:backdrop-blur-sm text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold shadow-md truncate ml-2">
                                 {item.version}
                             </div>
                         )}
                     </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                     <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-[11px] md:text-sm tracking-tight leading-tight group-hover:text-primary-500 transition-colors">{item.name}</h4>
                     
                     <div className="mt-auto pt-2 flex flex-wrap gap-1">
                        {item.genres && (
                           <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-full">
                               {item.genres.split(',')[0]}
                           </span>
                        )}
                        {!item.genres && item.repackBy && (
                           <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-full">
                               {item.repackBy}
                           </span>
                        )}
                     </div>
                  </div>
               </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
             <Icon name="SearchX" size={48} className="mb-4 opacity-30" />
             <span className="text-sm font-bold uppercase tracking-widest text-slate-500">No products found in this category</span>
          </div>
        )}
        
        {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 pb-8">
               <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
               ><Icon name="ChevronLeft" size={16} /></button>
               <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar px-1">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                     <button
                         key={page}
                         onClick={() => setCurrentPage(page)}
                         className={`w-10 h-10 rounded-lg text-xs font-bold transition-colors shrink-0 ${currentPage === page ? 'bg-primary-500 text-white shadow-md' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 text-slate-600 dark:text-slate-300'}`}
                     >
                         {page}
                     </button>
                 ))}
               </div>
               <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
               ><Icon name="ChevronRight" size={16} /></button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

const ResourceDetailModal: React.FC<{ 
  item: ResourceItem; 
  onClose: () => void;
  isHypervisor?: boolean;
  stash: string[];
  toggleStash: (id: string, e?: React.MouseEvent) => void;
  onCompanyClick?: (companyName: string) => void;
  onGenreClick?: (genre: string) => void;
  resolvedDev?: string;
}> = ({ item, onClose, isHypervisor, stash, toggleStash, onCompanyClick, onGenreClick, resolvedDev }) => {
  const [activeImage, setActiveImage] = useState(item.coverImage);
  const [showTrailer, setShowTrailer] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showArabic, setShowArabic] = useState(false);
  const [showHypervisorGuide, setShowHypervisorGuide] = useState(false);
  const [noteModalContent, setNoteModalContent] = useState<string | null>(null);
  const [showQBitWarning, setShowQBitWarning] = useState(false);
  const [qBitSuccess, setQBitSuccess] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setActiveImage(item.galleryImages.length > 0 ? item.galleryImages[0] : item.coverImage);
    setShowTrailer(false);
    setTranslatedDesc(null);
    setShowArabic(false);
    setIsCopied(false);
  }, [item]);

  const handleCopyLink = () => {
    const base = window.location.origin + window.location.pathname;
    const url = `${base}#/?item=${item.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTranslate = async () => {
    if (showArabic) {
        setShowArabic(false);
        return;
    }
    if (translatedDesc) {
        setShowArabic(true);
        return;
    }
    setIsTranslating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Translate the following technical software/game description into professional Arabic. Keep technical terms English. \n\nTEXT: ${item.description}`,
        });
        const text = response.text;
        if (text) {
            setTranslatedDesc(text);
            setShowArabic(true);
        }
    } catch (error) {
        console.error("Translation failed", error);
    } finally {
        setIsTranslating(false);
    }
  };

  const handleThumbnailClick = (img: string) => {
    setActiveImage(img);
    setShowTrailer(false);
  };

  const handleReportBrokenLink = () => {
    const whatsappMessage = `*Report Broken Link in Secret Area*\n\n*Item Name:* ${item.name}\n*Item ID:* ${item.id}\n*Category:* ${item.category}\n\nPlease check this link, it seems to be down. Thanks!`;
    const phoneNumber = '212723242286';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const isSteamTool = item.category === 'steamtools';
  const isExtra = item.category === 'extra';
  const scoreConfig = (item.ratingPositive) ? ((score) => {
    if (isNaN(score)) return { emoji: '🤔', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', wrapper: 'bg-slate-50 dark:bg-slate-900' };
    if (score > 50) return { emoji: '😎', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', border: 'border-emerald-500/10', wrapper: 'bg-emerald-500/5' };
    if (score === 50) return { emoji: '😐', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20', border: 'border-orange-500/10', wrapper: 'bg-orange-500/5' };
    return { emoji: '😕', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20', border: 'border-red-500/10', wrapper: 'bg-red-500/5' };
  })(parseInt((item.ratingPositive || '').toString().replace(/[^0-9]/g, ''))) : { emoji: '🤔', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', wrapper: 'bg-slate-50 dark:bg-slate-900' };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-950 p-0"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full h-full rounded-none relative overflow-hidden flex flex-col lg:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] bg-white/60 dark:bg-black/60 hover:bg-red-500 hover:text-white text-slate-500 dark:text-slate-400 p-2.5 rounded-full transition-all md:backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg"
        >
             <Icon name="X" size={20} />
        </button>

        <div className="w-full lg:w-[45%] bg-slate-100 dark:bg-black flex flex-col shrink-0 h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative">
           <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-200/90 dark:to-slate-900/90 pointer-events-none"></div>
              <AnimatePresence mode="wait">
                {showTrailer && item.links.trailer ? (
                    <motion.div 
                        key="trailer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full z-20 bg-black flex items-center justify-center relative"
                    >
                        <iframe 
                            className="w-full h-full absolute inset-0"
                            src={getYoutubeEmbedUrl(item.links.trailer) || ''}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </motion.div>
                ) : activeImage.endsWith('.webm') || activeImage.endsWith('.mp4') ? (
                    <motion.video
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={activeImage}
                        autoPlay
                        controls
                        className="max-w-full max-h-full object-contain shadow-2xl z-10"
                    />
                ) : (
                    <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={activeImage} 
                        alt={item.name} 
                        className="max-w-full max-h-full object-contain shadow-2xl z-10" 
                    />
                )}
              </AnimatePresence>
           </div>
           <div className="h-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-3 flex gap-3 overflow-x-auto no-scrollbar shrink-0 z-20">
              <Thumbnail src={item.coverImage} isActive={!showTrailer && activeImage === item.coverImage} onClick={() => handleThumbnailClick(item.coverImage)} />
             {item.galleryImages.map((img, idx) => (
               <Thumbnail key={idx} src={img} isActive={!showTrailer && activeImage === img} onClick={() => handleThumbnailClick(img)} />
             ))}
           </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar relative flex flex-col">
            <div className="p-4 sm:p-5 md:p-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-30 md:backdrop-blur-xl">
               <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge text={isSteamTool ? 'STEAMTOOLS' : (isExtra ? 'SAVEGAME' : item.category)} color="blue" icon={isSteamTool ? 'BrandSteam' : (isExtra ? 'Save' : 'Folder')} />
                  {!isSteamTool && <Badge text={item.version} color="slate" icon="Code" />}
                  <Badge text={`ID: ${item.gameId || item.id}`} color="slate" icon="Hash" />
                  {!isSteamTool && !isExtra && item.category !== 'architect' && item.repackBy && <Badge text={`REPACK: ${item.repackBy.toUpperCase()}`} color="emerald" icon="Box" />}
                  {isExtra && item.repackBy && <Badge text={`AUTHOR: ${item.repackBy.toUpperCase()}`} color="emerald" icon="User" />}
                  {resolvedDev && (
                      <button 
                         onClick={() => onCompanyClick && onCompanyClick(resolvedDev)}
                         className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-500/30 transition-colors border border-violet-200 dark:border-violet-500/30"
                      >
                          <Icon name="Briefcase" size={12} />
                          {resolvedDev}
                      </button>
                  )}
               </div>
               <div className="flex items-start justify-between gap-4">
                 <div className="flex items-center gap-2 sm:gap-3">
                   <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight uppercase italic">{item.name}</h2>
                   <button
                     onClick={handleCopyLink}
                     className="text-slate-400 hover:text-blue-500 transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 sm:p-2 rounded-lg"
                     title="Copy Share Link"
                   >
                     <Icon name={isCopied ? "Check" : "Link"} size={18} className={`sm:w-5 sm:h-5 ${isCopied ? "text-emerald-500" : ""}`} />
                   </button>
                 </div>
                 <button
                    onClick={(e) => toggleStash(item.id, e)}
                    className={`shrink-0 p-2 sm:p-3 rounded-xl transition-all ${
                        stash.includes(item.id) 
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={stash.includes(item.id) ? "Remove from Stash" : "Add to Stash"}
                 >
                    <Icon name="Bookmark" size={18} className={`sm:w-5 sm:h-5 ${stash.includes(item.id) ? "fill-current" : ""}`} />
                 </button>
               </div>
               {item.genres && (
                 <div className="mt-3 text-xs font-mono text-primary-500 dark:text-sky-400 font-bold uppercase tracking-widest flex items-center gap-2 flex-wrap">
                    <Icon name="Gamepad2" size={14} className="shrink-0" /> 
                    {item.genres.split(',').map((genre, idx, arr) => {
                        const trimmedGenre = genre.trim();
                        const isClickable = ['game', 'hypervisor', 'steamtools'].includes(item.category.toLowerCase());
                        
                        return (
                            <span key={idx} className="flex-shrink-0">
                                {isClickable ? (
                                    <span 
                                        onClick={(e) => { e.stopPropagation(); onGenreClick?.(trimmedGenre); }}
                                        className="cursor-pointer hover:text-primary-600 dark:hover:text-primary-200 hover:underline transition-colors"
                                    >
                                        {trimmedGenre}
                                    </span>
                                ) : (
                                    <span>{trimmedGenre}</span>
                                )}
                                {idx < arr.length - 1 && <span className="text-slate-400 dark:text-slate-600 ml-1">,</span>}
                            </span>
                        );
                    })}
                 </div>
               )}
            </div>

            <div className="p-4 sm:p-5 md:p-8 space-y-6 sm:space-y-8 pb-32">
                <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded-r-xl">
                    <div className="flex gap-3">
                        <Icon name="AlertTriangle" className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">N E X A 1337 Says :</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed font-medium">
                                Support the original developers and creators by purchasing legitimate copies of their products.<br/>
                                All trademarks, copyrights, and intellectual property belong to their respective owners.<br/>
                                If you are a rights holder and wish to request content removal, please contact us.
                            </p>
                        </div>
                    </div>
                </div>
                
                {isSteamTool ? (
                    <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Icon name="BrandSteam" size={16} /> Community Score
                            </h4>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                VERIFIED
                            </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className={`flex items-center gap-4 flex-1 w-full p-3 rounded-xl border ${scoreConfig.wrapper} ${scoreConfig.border}`}>
                                <div className={`w-12 h-12 rounded-full ${scoreConfig.bg} ${scoreConfig.color} shrink-0 flex items-center justify-center text-2xl`}>
                                    {scoreConfig.emoji}
                                </div>
                                <div>
                                    <span className={`block text-[10px] font-bold ${scoreConfig.color} opacity-70 uppercase tracking-wider`}>Positive</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.ratingPositive || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex items-center gap-4 flex-1 w-full p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 justify-end sm:justify-start flex-row-reverse sm:flex-row">
                                <div className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                                    <Icon name="Users" size={24} />
                                </div>
                                <div className="text-right sm:text-left">
                                    <span className="block text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wider">In Game</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.ratingNegative || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isExtra ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                       <StatBox label="File Size" value={item.originalSize || item.repackSize} icon="Database" color="text-primary-500 dark:text-sky-400" />
                       <StatBox label="Status by %" value={item.version} icon="PieChart" color="text-amber-500 dark:text-amber-400" />
                       <StatBox label="Downloads" value={getFakeDownloads(item.id)} icon="Download" color="text-blue-500 dark:text-blue-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       <StatBox label="Repack Size" value={item.repackSize} icon="Database" color="text-primary-500 dark:text-sky-400" />
                       <StatBox label="Original Size" value={item.originalSize} icon="Server" color="text-slate-500 dark:text-slate-400" />
                       <StatBox label="Languages" value={item.languages} icon="Globe" color="text-emerald-500 dark:text-emerald-400" />
                       <StatBox label="Downloads" value={getFakeDownloads(item.id)} icon="Download" color="text-blue-500 dark:text-blue-400" />
                    </div>
                )}

                {isSteamTool && item.hasDenuvo && (
                    <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 flex gap-4">
                        <div className="text-red-600 dark:text-red-400 shrink-0">
                            <Icon name="ShieldLock" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400 text-sm uppercase mb-1">Denuvo DRM Detected</h4>
                            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed font-medium">
                                This game uses Denuvo Anti-Tampering DRM. There is currently no known public bypass for Denuvo, meaning you likely will NOT be able to play this game. However, there's a slight chance it might be available in the DepotBox or ProjectLighting Launcher with a bypass. <span className="font-bold underline">Download at your own risk.</span>
                            </p>
                        </div>
                    </div>
                )}

                {isSteamTool && item.hasExternalLauncher && (
                    <div className="mb-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 flex gap-4">
                        <div className="text-orange-600 dark:text-orange-400 shrink-0">
                            <Icon name="User" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-orange-700 dark:text-orange-400 text-sm uppercase mb-1">Third-Party Account Required</h4>
                            <p className="text-xs text-orange-600 dark:text-orange-300 leading-relaxed font-medium">
                                This game requires an external launcher or account verification (EA Account). As this game also has Denuvo, it might be impossible to play in any case. <span className="font-bold underline">Download at your own risk.</span>
                            </p>
                        </div>
                    </div>
                )}

                <Section title="Overview" action={
                        <button onClick={handleTranslate} disabled={isTranslating} className={`flex items-center gap-2 px-3 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${showArabic ? 'bg-primary-500/20 border-primary-500 text-primary-600 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                            {isTranslating ? (<><Icon name="Cpu" size={12} className="animate-spin" /> Decrypting...</>) : (<><Icon name="Globe" size={12} /> {showArabic ? 'Show Original' : 'Translate AR'}</>)}
                        </button>
                    }>
                   <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                     <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence mode="wait">
                            <motion.div key={showArabic ? 'ar' : 'en'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium ${showArabic ? 'text-right font-sans text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`} dir={showArabic ? 'rtl' : 'ltr'}>
                                {showArabic && translatedDesc ? translatedDesc : item.description}
                            </motion.div>
                        </AnimatePresence>
                     </div>
                     <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none opacity-50"></div>
                   </div>
                </Section>

                {item.systemReqs.length > 0 && (
                   <Section title="System Requirements">
                      <motion.div 
                        initial="hidden" 
                        animate="visible" 
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                        className="flex flex-col gap-2"
                      >
                        {item.systemReqs.map((req, idx) => {
                          let paramIcon = req.icon || 'Cpu';
                          const label = req.label.toLowerCase();
                          if (label.includes('os')) paramIcon = 'BrandWindows';
                          if (label.includes('ram')) paramIcon = 'Cpu';
                          if (label.includes('gpu')) paramIcon = 'GPU';
                          if (label.includes('storage')) paramIcon = 'Database';
                          
                          return (
                            <motion.div 
                              key={idx} 
                              variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                              }}
                              className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-sm"
                            >
                               <div className="flex items-center gap-3 shrink-0 mb-2 sm:mb-0">
                                 <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 group-hover:text-blue-500 transition-colors">
                                   <Icon name={paramIcon} size={18} />
                                 </div>
                                 <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{req.label}</span>
                               </div>
                               <span className="text-sm font-mono text-slate-600 dark:text-slate-400 text-left sm:text-right sm:max-w-[60%] leading-relaxed">
                                 {req.value}
                               </span>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                      <div className="mt-6">
                        <SystemChecker reqs={item.systemReqs} />
                      </div>
                   </Section>
                )}

                {item.toolsNeeded && item.toolsNeeded.length > 0 && (
                    <Section title="Tools You Need">
                        <div className="flex flex-wrap gap-3">
                            {item.toolsNeeded.map((tool, idx) => (
                                <a 
                                    key={idx} 
                                    href={tool.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    <Icon name="Wrench" size={14} /> {tool.name}
                                </a>
                            ))}
                        </div>
                    </Section>
                )}

                {item.installSteps.length > 0 && (
                   <Section title={isExtra ? "Steps You Need" : "Installation Guide"}>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 mt-[-10px]">Follow these steps to safely install and set up your application.</p>
                      <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className="flex flex-col gap-3"
                      >
                        {item.installSteps.map((step, idx) => (
                          <motion.div 
                            key={idx} 
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 }
                            }}
                            className="group flex gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all hover:shadow-lg hover:-translate-y-0.5 items-start relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm group-hover:scale-110">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1">{step}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                   </Section>
                )}

                {isHypervisor && (
                   <Section title="What is a Hypervisor Bypass?">
                      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30">
                        <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                          Please read this article before proceeding with downloading and installation: 
                          <button onClick={(e) => { e.stopPropagation(); setShowHypervisorGuide(true); }} className="ml-1 text-red-600 dark:text-red-400 underline font-bold hover:text-red-500 transition-colors">
                            https://fitgirl-repacks.site/hypervisor-guide/
                          </button>
                        </p>
                      </div>
                   </Section>
                )}

                <Section title={item.category === 'architect' ? "Download Channels / Via Telegram" : "Download Channels"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {item.category === 'architect' && (
                            <a 
                                href={TELEGRAM_LINK} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="col-span-1 md:col-span-2 group relative overflow-hidden bg-gradient-to-r from-[#229ED9] to-[#1D85B8] p-3 sm:p-5 rounded-xl shadow-lg shadow-[#229ED9]/20 hover:shadow-[#229ED9]/40 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
                                    <div className="p-2 bg-white/10 rounded-full md:backdrop-blur-sm relative">
                                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center z-20">
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ animation: 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
                                        </span>
                                        <Icon name="Telegram" size={20} className="text-white sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-left sm:text-center">
                                        <div className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] opacity-80">Join Channel</div>
                                        <div className="text-[11px] sm:text-lg font-black text-white uppercase tracking-wider leading-tight sm:leading-none break-all sm:break-normal">
                                            Download Via Telegram
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )}
                        {item.links.full && (
                            <a 
                                href={item.links.full} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={(e) => {
                                    if (['game', 'hypervisor'].includes(item.category?.toLowerCase())) {
                                        e.preventDefault();
                                        setShowQBitWarning(true);
                                    }
                                }}
                                className="col-span-1 md:col-span-2 group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-500 p-3 sm:p-5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                {['game', 'hypervisor'].includes(item.category?.toLowerCase()) && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1 sm:py-1.5 rounded-bl-xl shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center gap-1 z-20 border-l border-b border-yellow-300">
                                        <Icon name="Sparkles" size={12} className="animate-pulse" /> Recommendation
                                    </div>
                                )}
                                <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
                                    {['steamtools', 'tools', 'savegame', 'extra', 'architect'].includes(item.category?.toLowerCase()) ? (
                                        <img 
                                            src="https://play-lh.googleusercontent.com/HAOAPee5LQ1c7D2npKzi2hKO5AV29Syu1XKkGM_Etd4dCcpVch13GxUkCLMlaCMpH91tYHF4DaiCF_Fs3LOlkA" 
                                            alt="Drive/Google" 
                                            referrerPolicy="no-referrer"
                                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                         loading="lazy" />
                                    ) : ['game', 'hypervisor'].includes(item.category?.toLowerCase()) ? (
                                        <img 
                                            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/utorrent-icon.png" 
                                            alt="uTorrent" 
                                            referrerPolicy="no-referrer"
                                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                         loading="lazy" />
                                    ) : (
                                        <div className="p-2 bg-white/10 rounded-full md:backdrop-blur-sm">
                                            <Icon name="Download" size={20} className="text-white sm:w-6 sm:h-6" />
                                        </div>
                                    )}
                                    <div className="text-left sm:text-center">
                                        <div className="text-[10px] font-black text-primary-100 uppercase tracking-[0.2em] opacity-80">Master File</div>
                                        <div className="text-[11px] sm:text-lg font-black text-white uppercase tracking-wider leading-tight sm:leading-none break-all sm:break-normal">
                                            {['game', 'hypervisor'].includes(item.category) ? `Magnet (${item.repackSize})` : `Full Project (${item.repackSize})`}
                                        </div>
                                        {item.links.fullNote && (
                                            <div className="mt-1 flex items-center gap-2">
                                                <div className="text-[9px] sm:text-[10px] text-white/80 font-bold truncate max-w-[150px] sm:max-w-[200px]">
                                                    {item.links.fullNote.length > 30 ? `${item.links.fullNote.substring(0, 30)}...` : item.links.fullNote}
                                                </div>
                                                {item.links.fullNote.length > 30 && (
                                                    <button 
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNoteModalContent(item.links.fullNote!); }}
                                                        className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest bg-white/20 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded hover:bg-white/30 transition-colors shadow-sm"
                                                    >
                                                        <Icon name="Info" size={12} className="w-3 h-3" />
                                                        <span>Read</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </a>
                        )}
                        {item.links.parts.map(part => (
                            <DownloadButton 
                                key={`part-${part.id}`}
                                label={['game', 'hypervisor'].includes(item.category) ? <span className="text-red-500 group-hover:text-red-400">DataNodes (Speed &amp; Usability) - Part {part.id < 10 ? '0' + part.id : part.id}</span> : `Download Part ${part.id < 10 ? '0' + part.id : part.id}`} 
                                sub="Primary Server" 
                                href={part.link} 
                                icon="Server" 
                                customIconUrl="https://jdownloader.org/_media/vote/jdi.png"
                                note={part.note}
                                onNoteClick={(note) => setNoteModalContent(note)}
                            />
                        ))}
                        {item.links.parts.length === 0 && !item.links.full && (
                            <div className="col-span-1 md:col-span-2 p-6 bg-slate-100 dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
                                <Icon name="Loader" size={24} className="animate-spin mx-auto mb-2 text-slate-400" />
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Encryption Keys...</p>
                            </div>
                        )}
                        {item.links.mirrors.map(mirror => (
                            <DownloadButton 
                                key={`mirror-${mirror.id}`}
                                label={['game', 'hypervisor'].includes(item.category) ? `FuckingFast (REALLY Fucking Fast 🙂) - Link ${mirror.id < 10 ? '0' + mirror.id : mirror.id}` : `Mirror Link ${mirror.id < 10 ? '0' + mirror.id : mirror.id}`} 
                                sub="Backup Server" 
                                href={mirror.link} 
                                icon="Database" 
                                customIconUrl="https://jdownloader.org/_media/vote/jdi.png"
                                secondary 
                                note={mirror.note}
                                onNoteClick={(note) => setNoteModalContent(note)}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        {item.links.trailer && (
                            <button onClick={() => setShowTrailer(!showTrailer)} className={`flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg sm:bg-transparent border sm:border-0 text-xs font-bold uppercase tracking-widest transition-colors ${showTrailer ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400'}`}>
                                <Icon name="Video" size={16} /> {showTrailer ? 'Close Trailer' : 'Game Trailer'}
                            </button>
                        )}
                        {item.links.tutorial && <a href={item.links.tutorial} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent border sm:border-0 border-slate-200 dark:border-slate-700 text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 uppercase tracking-widest transition-colors"><Icon name="BrandYoutube" size={16} /> Watch Tutorial</a>}
                        {item.links.dlc && <a href={item.links.dlc} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent border sm:border-0 border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-500 hover:text-purple-500 dark:hover:text-purple-400 uppercase tracking-widest transition-colors"><Icon name="Plus" size={16} /> Get DLCs / Updates</a>}
                        
                        <button 
                            onClick={handleReportBrokenLink} 
                            className="flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg bg-red-50 dark:bg-red-900/10 sm:bg-transparent border sm:border-0 border-red-200 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 uppercase tracking-widest transition-colors"
                        >
                            <Icon name="AlertTriangle" size={16} /> Report Broken Link
                        </button>
                    </div>
                </Section>
                
                <CommentsSection itemId={item.id} itemTitle={item.title || item.name} itemCategory={item.category} />
            </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {showHypervisorGuide && (
          <HypervisorGuideModal open={showHypervisorGuide} onClose={() => setShowHypervisorGuide(false)} />
        )}
        {noteModalContent && (
          <NoteModal content={noteModalContent} onClose={() => setNoteModalContent(null)} />
        )}
        {showQBitWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowQBitWarning(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQBitWarning(false);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors z-10"
                aria-label="Close"
              >
                <Icon name="X" size={20} />
              </button>
              <div className="p-6 sm:p-8 text-center space-y-6 pt-8">
                {!qBitSuccess ? (
                  <>
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg shadow-blue-500/20">
                      <Icon name="Download" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Wait a minute! 🛑</h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        To use this method, you need <span className="font-bold text-blue-600 dark:text-blue-400">qBittorrent</span> to download uTorrent files without problems. Do you already have it installed? 🤔
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <a 
                        href={item.links.full}
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQBitWarning(false);
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 flex items-center justify-center"
                      >
                        YES, I HAVE IT 🚀
                      </a>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open('https://www.qbittorrent.org/download', '_blank');
                          setQBitSuccess(true);
                        }}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center"
                      >
                        Not Yet 😅
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-emerald-500/20">
                      <Icon name="Check" size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Everything is fine! 🎉</h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                        Now you can have it thanks for respect N E X A 1337 Guidelines and instructions, all this for you. 🥳
                      </p>
                      <a 
                        href={item.links.full}
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQBitWarning(false);
                          setTimeout(() => setQBitSuccess(false), 500);
                        }}
                        className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
                      >
                        Get Files ⚡️
                      </a>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Badge: React.FC<{ text: string; color: 'blue' | 'slate' | 'emerald'; icon: string }> = ({ text, color, icon }) => {
  const colors = {
    blue: 'bg-primary-500/10 text-primary-600 dark:text-sky-400 border-primary-500/20',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  };
  return (
    <span className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${colors[color]}`}>
       <Icon name={icon} size={12} /> {text}
    </span>
  );
};

const StatBox: React.FC<{ label: string; value: string; icon: string; color: string; fullWidth?: boolean }> = ({ label, value, icon, color, fullWidth }) => (
  <div className={`bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center ${fullWidth ? 'col-span-2 lg:col-span-1' : ''}`}>
     <Icon name={icon} size={20} className={`${color} mb-2`} />
     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</span>
     <span className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate w-full px-2">{value || 'N/A'}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="space-y-4">
     <div className="flex items-center justify-between pr-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> {title}
        </h3>
        {action}
     </div>
     {children}
  </div>
);

const Thumbnail: React.FC<{ src: string; isActive: boolean; onClick: () => void }> = ({ src, isActive, onClick }) => {
  const isVideo = src.endsWith('.webm') || src.endsWith('.mp4');
  return (
    <button onClick={onClick} className={`relative aspect-square h-full rounded-lg overflow-hidden border-2 transition-all shrink-0 ${isActive ? 'border-primary-500 scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
      {isVideo ? (
        <video src={src} className="w-full h-full object-cover" muted loop playsInline />
      ) : (
        <img src={src} alt="thumb" className="w-full h-full object-cover"  loading="lazy" />
      )}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Icon name="Play" size={16} className="text-white opacity-80" />
        </div>
      )}
    </button>
  );
};

const DownloadButton: React.FC<{ label: React.ReactNode; sub: string; href: string; icon: string; customIconUrl?: string; secondary?: boolean; note?: string; onNoteClick?: (note: string) => void }> = ({ label, sub, href, icon, customIconUrl, secondary, note, onNoteClick }) => (
  <div className={`relative group flex flex-col p-2 sm:p-4 rounded-xl border transition-all active:scale-95 hover:-translate-y-1 ${secondary ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-primary-500/50'}`}>
     <div className="flex items-center gap-2 sm:gap-4 flex-1">
         <div className={`p-1.5 sm:p-2.5 rounded-lg shrink-0 transition-colors ${secondary ? 'bg-slate-100 dark:bg-slate-950 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300' : 'bg-slate-200 dark:bg-slate-900 text-primary-600 dark:text-primary-500 group-hover:text-white group-hover:bg-primary-500'}`}>
            {customIconUrl ? (
               <img src={customIconUrl} alt="icon" referrerPolicy="no-referrer" className="w-4 h-4 sm:w-5 sm:h-5 object-contain"  loading="lazy" />
            ) : (
               <Icon name={icon} size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
         </div>
         <div className="min-w-0 flex-1">
            <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5 text-slate-500 dark:text-slate-400">{sub}</div>
            <div className={`text-xs font-bold break-words leading-tight ${secondary ? 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-white'}`}>{label}</div>
         </div>
         <Icon name="ExternalLink" size={14} className={`shrink-0 w-3 h-3 sm:w-4 sm:h-4 opacity-50 sm:opacity-0 group-hover:opacity-100 transition-opacity ${secondary ? 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white' : 'text-slate-400 group-hover:text-primary-600 dark:group-hover:text-white'}`} />
     </div>
     <a href={href} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label={label}></a>
     
     {note && (
         <div className="relative z-20 mt-2 sm:mt-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-2">
            <div className={`text-[9px] sm:text-[10px] font-bold truncate pr-2 flex-1 ${secondary ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-600 dark:text-emerald-500'}`}>
                {note.length > 40 ? `${note.substring(0, 40)}...` : note}
            </div>
            {note.length > 40 && onNoteClick && (
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNoteClick(note); }}
                    className={`flex items-center gap-1 shrink-0 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 rounded transition-colors cursor-pointer ${secondary ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'}`}
                >
                    <Icon name="Info" size={12} className="w-3 h-3" />
                    <span>Read</span>
                </button>
            )}
         </div>
     )}
  </div>
);

// --- LATEST INTEL PANEL ---

type IntelCategory = 'ALL' | 'GAME' | 'HYPERVISOR' | 'STEAMTOOLS' | 'ARCHITECT' | 'EXTRA' | 'UPCOMING';
interface IntelItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: IntelCategory;
  type: 'NEW' | 'UPDATE' | 'FIX' | 'ALERT';
  version?: string;
}

const LatestIntelPanel: React.FC<{ open: boolean; onClose: () => void; items: IntelItem[] }> = ({ open, onClose, items }) => {
  const [filter, setFilter] = useState<IntelCategory>('ALL');

  if (!open) return null;

  const filteredIntel = items.filter(item => filter === 'ALL' || item.category === filter);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'GAME': return 'Gamepad2';
      case 'HYPERVISOR': return 'Cpu';
      case 'STEAMTOOLS': return 'Wrench';
      case 'ARCHITECT': return 'Building';
      case 'EXTRA': return 'Plus';
      case 'UPCOMING': return 'Clock';
      default: return 'Info';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'NEW': return 'bg-emerald-500 text-white';
      case 'UPDATE': return 'bg-blue-500 text-white';
      case 'FIX': return 'bg-purple-500 text-white';
      case 'ALERT': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback to raw string if unparseable
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 0) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex justify-end bg-black/60 md:backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 relative">
                <Icon name="Radar" size={24} className="animate-pulse" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50 dark:border-slate-950"></div>
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Latest Intel</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Changelog Feed</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
            {(['ALL', 'GAME', 'HYPERVISOR', 'STEAMTOOLS', 'ARCHITECT', 'EXTRA', 'UPCOMING'] as IntelCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === cat 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'ARCHITECT' ? 'TOOLS' : cat === 'EXTRA' ? 'SAVEGAME' : cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {filteredIntel.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800"
              >
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${getTypeColor(item.type).split(' ')[0]}`}></div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 hover:border-primary-500/50 transition-colors group">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={getCategoryIcon(item.category)} size={14} className="text-slate-400" />
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      {item.version && (
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 px-1.5 rounded">
                          {item.version}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {filteredIntel.length === 0 && (
              <div className="text-center py-10">
                <Icon name="Ghost" size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No intel found</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


const MostPopularRepacksModal: React.FC<{
    isOpen: boolean,
    games: ResourceItem[],
    onClose: () => void,
    onSelect: (item: ResourceItem) => void
}> = ({ isOpen, games, onClose, onSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(12);
            else if (window.innerWidth < 1024) setItemsPerPage(16);
            else setItemsPerPage(20);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(games.length / itemsPerPage);
    const paginatedGames = games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div 
            key="most-popular-repacks-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-0 bg-slate-900/90 backdrop-blur-md"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-900 w-full h-full max-w-none max-h-none rounded-none shadow-2xl flex flex-col overflow-hidden border-none"
            >
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Icon name="Trophy" className="text-yellow-600 dark:text-yellow-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Most Popular Repacks</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">All Top {games.length} Games</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <Icon name="X" size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-950/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {paginatedGames.map((game, index) => {
                            const globalIndex = (currentPage - 1) * itemsPerPage + index;
                            const isHypervisor = game.category?.toLowerCase() === 'hypervisor';
                            return (
                                <motion.div 
                                    key={game.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative group cursor-pointer"
                                    onClick={() => onSelect(game)}
                                >
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-500/50">
                                        <img 
                                            src={game.image || game.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED'} 
                                            alt={game.name} 
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 saturate-100 group-hover:saturate-150"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED';
                                            }}
                                        />
                                        
                                        
                                        <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/90 backdrop-blur-md text-white font-black text-sm sm:text-lg flex items-center justify-center rounded-xl shadow-lg border border-white/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                                            #{globalIndex + 1}
                                        </div>

                                        {isHypervisor && (
                                            <div className="absolute top-2 right-2 z-10 bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-lg border border-red-400/30 group-hover:scale-110 transition-transform">
                                                HV
                                            </div>
                                        )}
                                        
                                        
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center shrink-0">
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <Icon name="ChevronLeft" size={16} />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                                            currentPage === pageNum 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <Icon name="ChevronRight" size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
};

const MostPopularRepacksSection: React.FC<{ 
    gameIds: string[], 
    allResources: Record<string, ResourceItem[]>,
    onSelect: (item: ResourceItem) => void
}> = ({ gameIds, allResources, onSelect }) => {
    
    const [displayCount, setDisplayCount] = useState(20);
    const [showAllModal, setShowAllModal] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setDisplayCount(8);
            else if (window.innerWidth < 1024) setDisplayCount(16);
            else setDisplayCount(20);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Find games based on IDs
    const games = useMemo(() => {
        const allItems = Object.values(allResources).flat();
        return gameIds.map(id => allItems.find(i => String(i.id).toLowerCase() === String(id).toLowerCase())).filter(Boolean) as ResourceItem[];
    }, [gameIds, allResources]);

    if (!games || games.length === 0) return null;

    const displayedGames = games.slice(0, displayCount);

    return (
        <>
        <div className="mt-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 md:backdrop-blur-sm relative z-10 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <Icon name="Trophy" className="text-yellow-500" /> Most Popular Repacks of the Year
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-2">Community favorite releases</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {displayedGames.map((game, index) => {
                    const isHypervisor = game.category?.toLowerCase() === 'hypervisor';
                    return (
                        <motion.div 
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group cursor-pointer"
                            onClick={() => onSelect(game)}
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-blue-500/50">
                                <img 
                                    src={game.image || game.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED'} 
                                    alt={game.name} 
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110 saturate-100 group-hover:saturate-150"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED';
                                    }}
                                />
                                
                                
                                {/* Dynamic Ranking Number */}
                                <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/90 backdrop-blur-md text-white font-black text-sm sm:text-lg flex items-center justify-center rounded-xl shadow-lg border border-white/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                                    #{index + 1}
                                </div>

                                {isHypervisor && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-600/90 backdrop-blur-md text-white font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-lg border border-red-400/30 group-hover:scale-110 transition-transform">
                                        HV
                                    </div>
                                )}
                                
                                
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {games.length > displayCount && (
                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={() => setShowAllModal(true)}
                        className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-3 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                            SEE MORE GAMES 
                            <Icon name="ArrowRight" size={20} className="transform group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            )}
        </div>

        <MostPopularRepacksModal 
            isOpen={showAllModal}
            games={games} 
            onClose={() => setShowAllModal(false)} 
            onSelect={(game) => {
                setShowAllModal(false);
                onSelect(game);
            }} 
        />
        </>
    );
};

const TopGamesSection: React.FC<{ games: TopGame[] }> = ({ games }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 10;
    
    const noData = !games || games.length === 0;

    const dummyGames: TopGame[] = [
        {
            id: 'dummy-1',
            rank: 1,
            name: 'Red Dead Redemption 2',
            bannerUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar5n9.jpg',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Red_Dead_Redemption_2_Logo.svg/800px-Red_Dead_Redemption_2_Logo.svg.png',
            symbolUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/red-dead-redemption-2.svg'
        },
        {
            id: 'dummy-2',
            rank: 2,
            name: 'The Witcher 3: Wild Hunt',
            bannerUrl: 'https://images.igdb.com/igdb/image/upload/t_1080p/sc5tk7.jpg',
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/The_Witcher_3_Wild_Hunt_logo.svg/800px-The_Witcher_3_Wild_Hunt_logo.svg.png',
            symbolUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Witcher_3_School_of_the_Wolf_Medallion.svg/200px-Witcher_3_School_of_the_Wolf_Medallion.svg.png'
        }
    ];

    const displayGames = noData ? dummyGames : games;
    const totalPages = Math.ceil(displayGames.length / ITEMS_PER_PAGE);
    const displayedPageGames = displayGames.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    return (
        <div className="mt-12 w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] border-y border-slate-200 dark:border-white/10 transition-colors duration-300">
            {noData && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 m-4 md:m-8 rounded-xl relative z-20 mx-auto max-w-5xl">
                    <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                        <Icon name="AlertTriangle" size={20} /> Action Required: Google Apps Script Update
                    </h4>
                    <p className="text-sm text-yellow-200/80 mb-2">
                        Your Google Apps Script is not returning the "topgames" sheet data. You are currently seeing a preview with dummy data.
                    </p>
                    <p className="text-xs text-yellow-200/60 font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">
                        1. Open your Google Sheet <br/>
                        2. Go to Extensions &gt; Apps Script <br/>
                        3. Make sure it fetches the new sheet. If you have hardcoded sheet names, add "topgames" (or exactly how you named it) to the loop.<br/>
                        4. VERY IMPORTANT: Click Deploy &gt; New deployment &gt; Web app. Overwriting an old version without "New deployment" will NOT work!
                    </p>
                </div>
            )}
            {/* Header / Title Style */}
            <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-40 mix-blend-luminosity"
                    style={{ backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/123/929/desktop-wallpaper-we-loved-them-all-games-collage.jpg')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/70 to-slate-50 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/50 dark:to-[#0a0a0a] transition-colors duration-300"></div>
                
                <div className="relative z-20 text-center flex flex-col items-center">
                    <h2 className="flex flex-col md:flex-row items-center justify-center font-black tracking-tighter leading-none transition-colors duration-300">
                        <span className="text-8xl md:text-[11rem] xl:text-[13rem] text-slate-900 dark:text-slate-100 font-['Anton'] md:pr-6 leading-none">
                            {displayGames.length}
                        </span>
                        <div className="flex flex-col items-center md:items-start md:mt-2">
                            <span className="text-5xl md:text-7xl xl:text-[6.5rem] font-['Bebas_Neue'] uppercase leading-[0.8] tracking-widest text-[#0b1b3d] dark:text-[#c4d4e2]">
                                OPEN WORLD
                            </span>
                            <span className="text-[5rem] md:text-[8rem] xl:text-[10rem] font-['Permanent_Marker'] md:-ml-2 text-transparent bg-clip-text bg-gradient-to-br from-red-600 via-red-500 to-orange-600 leading-[0.8] -mt-2 md:-mt-6 text-stroke-2 text-stroke-white dark:text-stroke-black" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
                                GAMES
                            </span>
                        </div>
                    </h2>
                    <div className="mt-4 md:mt-6 flex items-center gap-4 text-slate-800 dark:text-slate-200 font-['Inter'] font-black tracking-[0.3em] text-lg md:text-2xl uppercase transition-colors duration-300">
                        <span className="h-[2px] w-12 md:w-24 bg-slate-800 dark:bg-slate-200 transition-colors duration-300 opacity-50"></span>
                        YOU MUST PLAY
                        <span className="h-[2px] w-12 md:w-24 bg-slate-800 dark:bg-slate-200 transition-colors duration-300 opacity-50"></span>
                    </div>
                    <p className="mt-4 text-[9px] md:text-xs text-slate-500 dark:text-slate-400 font-bold tracking-[0.25em] uppercase transition-colors duration-300">
                        From Fantasy Kingdoms to Chaotic Cities
                    </p>
                </div>
            </div>

            <div className="flex flex-col relative z-10 max-w-7xl mx-auto w-full px-4 mb-10">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentPage}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl transition-colors duration-300"
                    >
                        {displayedPageGames.map((game, idx) => {
                            // Rank text e.g. "01"
                            const rankNum = game.rank.toString().padStart(2, '0');
                            
                            // Neon colors
                            const neonColors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#0ea5e9', '#8b5cf6', '#d946ef', '#f43f5e'];
                            const c1 = neonColors[idx % neonColors.length];
                            
                            return (
                                <div key={game.id} className="relative group flex items-stretch border-b border-slate-300 dark:border-white/10 last:border-b-0 overflow-hidden min-h-[90px] sm:min-h-[110px] md:min-h-[130px] transition-all hover:brightness-105 dark:hover:brightness-125 bg-white sm:bg-transparent dark:bg-black/60 dark:md:backdrop-blur-md">
                                    {/* Number Box on the left */}
                                    <div className="w-[70px] md:w-[120px] shrink-0 flex items-center justify-center bg-slate-100 dark:bg-[#050505] relative z-20 border-r border-slate-300 dark:border-white/5 shadow-none dark:shadow-[5px_0_15px_rgba(0,0,0,0.5)] transition-colors duration-300">
                                        <span 
                                            style={{ 
                                                textShadow: `0 0 10px ${c1}66`,
                                                color: c1
                                            }}
                                            className="font-['Anton'] italic text-4xl md:text-6xl drop-shadow-md brightness-90 dark:brightness-125"
                                        >
                                            {rankNum}
                                        </span>
                                    </div>
                                    
                                    {/* Content Area with Banner Background */}
                                    <div className="flex-1 relative flex items-center px-4 md:px-8 py-2 overflow-hidden bg-slate-200 dark:bg-slate-900 transition-colors duration-300">
                                        {/* Banner Background */}
                                        <div 
                                            className="absolute inset-0 bg-cover bg-[center_30%] transition-transform duration-[20s] group-hover:scale-110 opacity-80 dark:opacity-100"
                                            style={{ backgroundImage: `url(${game.bannerUrl})` }}
                                        ></div>
                                        
                                        {/* Dynamic Gradient for Light/Dark */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/50 to-white/95 dark:hidden"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/90 hidden dark:block"></div>
                                        
                                        {/* Logo / Title Area */}
                                        <div className="relative z-10 flex-1 flex items-center justify-start h-full">
                                            {game.logoUrl ? (
                                                <div className="flex items-center justify-start w-[140px] sm:w-[220px] md:w-[350px] h-12 md:h-20 flex-shrink-0">
                                                    <img src={game.logoUrl} alt={game.name} className="max-w-full max-h-full object-contain object-left drop-shadow-[0_2px_5px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"  loading="lazy" />
                                                </div>
                                            ) : (
                                                <h3 className="font-black italic text-xl md:text-4xl text-slate-900 dark:text-white tracking-tight uppercase drop-shadow-[0_2px_5px_rgba(255,255,255,1)] dark:drop-shadow-[0_5px_15px_rgba(0,0,0,1)] transition-colors duration-300">
                                                    {game.name}
                                                </h3>
                                            )}
                                        </div>

                                        {/* Symbol on the right */}
                                        {game.symbolUrl && (
                                            <div className="relative z-10 shrink-0 ml-4 flex items-center justify-end w-[40px] md:w-[80px] h-10 md:h-20 mr-2">
                                                <img src={game.symbolUrl} alt="Symbol" className="max-w-full max-h-full object-contain object-right opacity-90 group-hover:opacity-100 transition-all duration-300 drop-shadow-md"  loading="lazy" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Right Edge Glow */}
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/20 dark:bg-white opacity-0 group-hover:opacity-50 blur-[2px] transition-opacity"></div>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-slate-100 dark:bg-[#050505] p-4 border-t border-slate-300 dark:border-white/5 flex justify-center items-center gap-2 transition-colors duration-300">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-white rounded-full transition-colors flex items-center justify-center shrink-0 border border-slate-300 dark:border-transparent shadow-sm"
                    >
                        <Icon name="ChevronLeft" size={20} />
                    </button>
                    <div className="flex gap-2 mx-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`h-3 rounded-full transition-all ${
                                    currentPage === i ? 'bg-red-600 dark:bg-red-500 w-6' : 'bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 w-3'
                                }`}
                                aria-label={`Page ${i + 1}`}
                            />
                        ))}
                    </div>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-white rounded-full transition-colors flex items-center justify-center shrink-0 border border-slate-300 dark:border-transparent shadow-sm"
                    >
                        <Icon name="ChevronRight" size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

const BestStudiosCarousel: React.FC<{ 
    profiles: CompanyProfile[], 
    onSelect: (profile: CompanyProfile) => void,
    onSeeAll: () => void,
    categoryType: 'games' | 'tools'
}> = ({ profiles, onSelect, onSeeAll, categoryType }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const sortedProfiles = useMemo(() => {
        return [...profiles]
            .map(p => {
                let count = 0;
                if (categoryType === 'games') {
                    count = (p.gameIds?.length || 0) + (p.hypervisorIds?.length || 0) + (p.steamtoolsIds?.length || 0);
                } else {
                    count = (p.architectIds?.length || 0) + (p.extraIds?.length || 0);
                }
                return {
                    ...p,
                    totalGames: count
                };
            })
            .filter(p => p.totalGames > 0)
            .sort((a, b) => b.totalGames - a.totalGames);
    }, [profiles, categoryType]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 480) setItemsPerView(2.2); 
            else if (w < 640) setItemsPerView(3.2); 
            else if (w < 768) setItemsPerView(4.2); 
            else if (w < 1024) setItemsPerView(5.2); 
            else setItemsPerView(6); 
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (sortedProfiles.length === 0) return null;

    const maxIndex = Math.max(0, sortedProfiles.length - Math.floor(itemsPerView));

    const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) handleNext();
        if (touchStartX.current - touchEndX.current < -50) handlePrev();
    };

    return (
        <div className="mt-12 bg-white/50 dark:bg-slate-900/50 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 md:backdrop-blur-sm relative z-10 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Icon name="Briefcase" className="text-blue-500" /> {categoryType === 'games' ? 'Best Studios' : 'Best Company'}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Top developers by released items</p>
                </div>
                <button 
                    onClick={onSeeAll}
                    className="shrink-0 text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 transition-all px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20"
                >
                    <span>VIEW ALL</span> <Icon name="ArrowRight" size={16} />
                </button>
            </div>
            
            <div 
                className="relative group w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="overflow-hidden w-full relative">
                    <motion.div 
                        className="flex will-change-transform pb-4"
                        animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {sortedProfiles.map((profile) => (
                            <div 
                                key={profile.id}
                                style={{ width: `${100 / itemsPerView}%` }}
                                className="flex-shrink-0 px-2"
                            >
                                <div 
                                    onClick={() => onSelect(profile)}
                                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all h-full group/studio"
                                >
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800 group-hover/studio:border-blue-500/30 group-hover/studio:bg-blue-50 dark:group-hover/studio:bg-blue-900/20 overflow-hidden shrink-0 transition-all shadow-inner">
                                        {profile.logoUrl ? (
                                            <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-contain filter group-hover/studio:brightness-110 transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="font-black text-lg sm:text-xl text-slate-400 group-hover/studio:text-blue-500 transition-colors">' + profile.name.substring(0, 2).toUpperCase() + '</span>'; }} />
                                        ) : (
                                            <span className="font-black text-lg sm:text-xl text-slate-400 group-hover/studio:text-blue-500 transition-colors">{profile.name.substring(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="text-center w-full">
                                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover/studio:text-blue-500 transition-colors" title={profile.name}>{profile.name}</h3>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded border border-blue-200 dark:border-blue-500/30 group-hover/studio:shadow-sm">
                                            {profile.totalGames} {profile.totalGames === 1 ? 'Item' : 'Items'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 z-30 opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentIndex === 0}
                        className="p-1 sm:p-2 sm:p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl hover:scale-110 transition-transform disabled:opacity-0 disabled:scale-100 border border-slate-200 dark:border-slate-700"
                    >
                        <Icon name="ChevronLeft" size={20} />
                    </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 z-30 opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={handleNext} 
                        disabled={currentIndex >= maxIndex}
                        className="p-1 sm:p-2 sm:p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl hover:scale-110 transition-transform disabled:opacity-0 disabled:scale-100 border border-slate-200 dark:border-slate-700"
                    >
                        <Icon name="ChevronRight" size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

const SecretArea: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true');
  const [showHackerLoader, setShowHackerLoader] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true');
  const [hackerProgress, setHackerProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<{ quality: string | null, isTesting: boolean }>({ quality: null, isTesting: false });
  const [allResources, setAllResources] = useState<Record<string, ResourceItem[]>>({ game: [], hypervisor: [], steamtools: [], architect: [], extra: [] });
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [topGames, setTopGames] = useState<TopGame[]>([]);
  const [popularRepackIds, setPopularRepackIds] = useState<string[]>([]);
  
  const getResolvedDeveloper = (item: ResourceItem) => {
      if (item.developer && item.developer.trim()) return item.developer;
      const catMap: Record<string, keyof CompanyProfile> = {
          'game': 'gameIds',
          'hypervisor': 'hypervisorIds',
          'steamtools': 'steamtoolsIds',
          'architect': 'architectIds',
          'extra': 'extraIds'
      };
      
      const key = catMap[item.category];
      if (!key) return '';

      for (const profile of companyProfiles) {
          const ids = (profile[key] as string[]) || [];
          const lowerIds = ids.map(id => String(id).toLowerCase().trim()).filter(Boolean);
          const numericIds = ids.map(id => String(id).replace(/^[A-Za-z]+[-]?/, '').toLowerCase().trim()).filter(Boolean);
          const itemIdsToMatch = [
              String(item.id || '').toLowerCase().trim(),
              String(item.id || '').replace(/^[A-Za-z]+[-]?/, '').toLowerCase().trim(),
              String(item.gameId || '').toLowerCase().trim()
          ].filter(Boolean);

          if (lowerIds.length > 0) {
              const matched = lowerIds.some(id => 
                  itemIdsToMatch.includes(id) || 
                  itemIdsToMatch.some(itemId => itemId === id || itemId.endsWith(`-${id}`) || itemId.endsWith(id))
              ) || numericIds.some(id => itemIdsToMatch.includes(id));
              
              if (matched) return profile.name;
          }
      }
      return '';
  };

  const [activeTab, setActiveTab] = useState<'game' | 'hypervisor' | 'steamtools' | 'architect' | 'extra' | 'stash'>('game');
  const [searchQuery, setSearchQuery] = useState('');
  const [stash, setStash] = useState<string[]>([]);
  const [showAllProfiles, setShowAllProfiles] = useState(false);

  useEffect(() => {
    const savedStash = localStorage.getItem('myStash');
    if (savedStash) {
      try {
        setStash(JSON.parse(savedStash));
      } catch (e) {
        console.error("Failed to parse stash from local storage");
      }
    }
  }, []);

  const toggleStash = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setStash(prev => {
      const newStash = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('myStash', JSON.stringify(newStash));
      return newStash;
    });
  };

  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedCompanyProfile, setSelectedCompanyProfile] = useState<CompanyProfile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visitorCount, setVisitorCount] = useState(2491);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showIntelPanel, setShowIntelPanel] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: number, title: string, text: string, time: string, isAr?: boolean}>>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([]);
  const [upcomingLists, setUpcomingLists] = useState<{ [key: string]: string[] }>({
      game: [],
      hypervisor: [],
      steamtools: [],
      tools: [],
      savegames: []
  });
  const [upcomingPlatform, setUpcomingPlatform] = useState('PlayStation 5');
  const [isUpcomingMissing, setIsUpcomingMissing] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [requestModalInitialTitle, setRequestModalInitialTitle] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<{type: string, text: React.ReactNode}[]>([
    { type: 'system', text: 'N E X A 1337 OS v9.0.1 - SECURE terminal' },
    { type: 'system', text: 'Unauthorized access is strictly prohibited.' },
    { type: 'system', text: 'Type "help" for available commands.' },
    { type: 'success', text: '💡 TIP: Type a command and press ENTER.' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [terminalMode, setTerminalMode] = useState<'normal' | 'password'>('normal');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [terminalCleared, setTerminalCleared] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const secretBackgrounds = [
    "https://canada1.discourse-cdn.com/flex036/uploads/retrogameboards/original/2X/8/892f6ed5a098a1428757d3b6220ad281eafcbe80.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyZnY4YnZtdGNjbDNjdGhwbTdpbjFiOHBuYWJnbGw3cjVkczM3ZDZ5YyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rpl1sod1vCXK0L2SUN/giphy.gif",
    "https://miro.medium.com/1*rv7bzPRCHMsOv1vI_gHyfg.gif",
    "https://i.pinimg.com/originals/4c/d6/ea/4cd6eaa599851725aa5a195d162fb20d.gif"
  ];
  const [bgImage] = useState(() => secretBackgrounds[Math.floor(Math.random() * secretBackgrounds.length)]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    const newHistory = [...terminalHistory];
    
    if (terminalMode === 'password') {
      newHistory.push({ type: 'user', text: `Please enter the Secret Code:\n${'*'.repeat(cmd.length)}` });
    } else {
      newHistory.push({ type: 'user', text: `┌──(guest㉿nexa1337.com)-[~]\n└─$ ${cmd}` });
    }

    const lowerCmd = cmd.toLowerCase();

    if (terminalMode === 'password') {
      if (lowerCmd === 'exit' || lowerCmd === 'cancel' || lowerCmd === 'quit' || lowerCmd === 'abort' || lowerCmd === 'clear') {
        setTerminalMode('normal');
        setFailedAttempts(0);
        if (lowerCmd === 'clear') {
          setTerminalHistory([]);
          setTerminalCleared(true);
        } else {
          newHistory.push({ type: 'error', text: 'Authentication aborted.' });
          newHistory.push({ type: 'success', text: '💡 TIP: Type "help" to see available commands.' });
        }
        setTerminalInput('');
        return;
      } else if (cmd === 'Wolfspace') {
        newHistory.push({ type: 'success', text: 'Access Granted. Decrypting Area...' });
        setIsUnlocked(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'true');
        fetchData();
        setFailedAttempts(0);
        setTerminalMode('normal');
      } else {
        const fails = failedAttempts + 1;
        setFailedAttempts(fails);
        if (fails >= 2) {
           newHistory.push({ 
             type: 'error', 
             text: (
                <div className="flex flex-col items-center justify-center p-6 my-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-4">
                  <FaFaceAngry className="text-red-500 text-6xl animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                  <span className="text-red-500 font-black uppercase tracking-[0.2em] text-center text-sm md:text-base">you are a loser contact admin to request secret key</span>
                </div>
             ) 
           });
           setFailedAttempts(0);
           setTerminalMode('normal');
        } else {
           newHistory.push({ type: 'error', text: 'Access Denied. Invalid secret code.' });
           newHistory.push({ type: 'system', text: '💡 TIP: Try again, or type "exit" to abort authentication.' });
           // stay in password mode
        }
      }
    } else {
      if (lowerCmd === 'help') {
        newHistory.push({ type: 'system', text: '┌──────────────────────────────────┐' });
        newHistory.push({ type: 'system', text: '│ AVAILABLE PROTOCOLS              │' });
        newHistory.push({ type: 'system', text: '└──────────────────────────────────┘' });
        newHistory.push({ type: 'info', text: '  [1] INQUIRE : What is inside?' });
        newHistory.push({ type: 'info', text: '  [2] COMMS   : Contact Support' });
        newHistory.push({ type: 'info', text: '  [3] AUTH    : Enter Secret Code' });
        newHistory.push({ type: 'info', text: '  [4] NETWORK : Join Telegram' });
        newHistory.push({ type: 'info', text: '  clear       : Flush memory' });
        newHistory.push({ type: 'system', text: ' ' });
        newHistory.push({ type: 'success', text: '  💡 TIP: Type a number (e.g. "3") or a command and press ENTER.' });
      } else if (lowerCmd === '1') {
        newHistory.push({ type: 'system', text: '>>> AREA SUMMARY EXECUTED <<<' });
        newHistory.push({ type: 'info', text: '  ██╗    ██╗ ██████╗ ██╗     ███████╗   ██╗██████╗ ██████╗ ███████╗' });
        newHistory.push({ type: 'info', text: '  ██║    ██║██╔═══██╗██║     ██╔════╝  ███║╚════██╗╚════██╗╚════██║' });
        newHistory.push({ type: 'info', text: '  ██║ █╗ ██║██║   ██║██║     █████╗    ╚██║ █████╔╝ █████╔╝    ██╔╝' });
        newHistory.push({ type: 'info', text: '  ██║███╗██║██║   ██║██║     ██╔══╝     ██║ ╚═══██╗ ╚═══██╗   ██╔╝ ' });
        newHistory.push({ type: 'info', text: '  ╚███╔███╔╝╚██████╔╝███████╗██║        ██║██████╔╝██████╔╝   ██║  ' });
        newHistory.push({ type: 'info', text: '   ╚══╝╚══╝  ╚═════╝ ╚══════╝╚═╝        ╚═╝╚═════╝ ╚═════╝    ╚═╝  ' });
        newHistory.push({ type: 'system', text: '────────────────────────────────────────────────────────────────────────────' });
        newHistory.push({ type: 'info', text: '[-] 🎮 Hypervisors Games from FitGirl with easy UI to understand' });
        newHistory.push({ type: 'info', text: '[-] 💿 Repacks Games from FitGirl with easy UI to understand' });
        newHistory.push({ type: 'info', text: '[-] 🚂 Steam games With SteamTools One Click Get File without ADS' });
        newHistory.push({ type: 'info', text: '[-] 🔓 Crack Apps From Popular Company' });
        newHistory.push({ type: 'info', text: '[-] 💾 100% save games Files' });
        newHistory.push({ type: 'info', text: '[-] 👤 Free Offline Steam Account' });
        newHistory.push({ type: 'info', text: '[-] 🎁 Free Gifts like Netflix Accounts and more.' });
        newHistory.push({ type: 'success', text: '[+] All this and more without adult pop-up ads and with an easy-to-use user interface.' });
        newHistory.push({ type: 'system', text: '────────────────────────────────────────────────────────────────────────────' });
        newHistory.push({ type: 'error', text: 'Status: CLASSIFIED. Authentication required for decryption.' });
      } else if (lowerCmd === '2') {
        newHistory.push({ type: 'system', text: 'ESTABLISHING SECURE COMMS...' });
        newHistory.push({ 
          type: 'info', 
          text: (
            <div className="flex flex-col space-y-2 mt-1 ml-2">
              <div>[-] <a href="https://wa.me/212723242286" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">WhatsApp</a></div>
              <div>[-] <a href="https://www.instagram.com/nexa1337" target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-300 underline underline-offset-2">Instagram</a></div>
              <div>[-] <a href="mailto:support@nexa1337.com" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">Email (support@nexa1337.com)</a></div>
              <div>[-] <a href="mailto:nexa1337agency@gmail.com" className="text-red-400 hover:text-red-300 underline underline-offset-2">Gmail (nexa1337agency@gmail.com)</a></div>
              <div>[-] <a href="https://linktr.ee/nexa1337" target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300 underline underline-offset-2">N E X A 1337</a></div>
            </div>
          ) 
        });
      } else if (lowerCmd === '4') {
        newHistory.push({ 
          type: 'info', 
          text: (
            <div className="flex flex-col space-y-3 mt-2 ml-2 font-mono">
              <div className="text-[#a6e3a1] font-bold">{"\u003e\u003e\u003e SECURE NETWORKS DETECTED \u003c\u003c\u003c"}</div>
              <div className="flex items-center space-x-2.5">
                <img 
                  src="https://cdn.pixabay.com/photo/2021/12/27/10/50/telegram-6896827_1280.png" 
                  alt="Telegram" 
                  referrerPolicy="no-referrer" 
                  className="w-5 h-5 object-contain" 
                 loading="lazy" />
                <a 
                  href="https://t.me/nexa1337agency" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-bold"
                >
                  Telegram Channel
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <img 
                  src="https://pngimg.com/uploads/discord/discord_PNG8.png" 
                  alt="Discord" 
                  referrerPolicy="no-referrer" 
                  className="w-5 h-5 object-contain" 
                 loading="lazy" />
                <a 
                  href="https://discord.gg/MgqvMyZv2b" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 font-bold"
                >
                  Discord Server
                </a>
              </div>
            </div>
          ) 
        });
      } else if (lowerCmd === '3' || lowerCmd === 'auth') {
        setTerminalMode('password');
      } else if (lowerCmd === 'clear') {
        setTerminalHistory([]);
        setTerminalCleared(true);
        setTerminalInput('');
        return;
      } else if (lowerCmd === 'login wolfspace' || cmd === 'Wolfspace') {
        newHistory.push({ type: 'success', text: 'Access Granted. Decrypting Area...' });
        setIsUnlocked(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'true');
        fetchData();
      } else {
        newHistory.push({ type: 'error', text: `Command not found: ${cmd}. Type "help" for options.` });
      }
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
    
    if (terminalMode !== 'password' && cmd) {
      setCommandHistory(prev => [...prev, cmd]);
    }
    setHistoryIndex(-1);
  };
  
  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      const newHistory = [...terminalHistory];
      if (terminalMode === 'password') {
        newHistory.push({ type: 'user', text: `Please enter the Secret Code:\n^C` });
        newHistory.push({ type: 'error', text: 'Authentication aborted.' });
        newHistory.push({ type: 'success', text: '💡 TIP: Type "help" to see available commands.' });
        setTerminalMode('normal');
      } else {
        newHistory.push({ type: 'user', text: `┌──(guest㉿nexa1337.com)-[~]\n└─$ ${terminalInput}^C` });
      }
      setTerminalHistory(newHistory);
      setTerminalInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (terminalMode !== 'password' && commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setTerminalInput(commandHistory[commandHistory.length - 1 - nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (terminalMode !== 'password' && historyIndex >= 0) {
        const nextIndex = historyIndex - 1;
        if (nextIndex >= 0) {
          setHistoryIndex(nextIndex);
          setTerminalInput(commandHistory[commandHistory.length - 1 - nextIndex]);
        } else {
          setHistoryIndex(-1);
          setTerminalInput('');
        }
      }
    }
  };

  // Global System Filter
  const [globalSpecs, setGlobalSpecs] = useState({
    ram: 16,
    os: '10',
    cpuTier: 3,
    gpuTier: 3,
    isActive: false
  });
  const [showGlobalFilter, setShowGlobalFilter] = useState(false);
  
  // Steam Accounts Feature
  const [steamAccounts, setSteamAccounts] = useState<SteamAccount[]>([]);
  
  // Master Gift Feature
  const [masterGifts, setMasterGifts] = useState<MasterGiftAccount[]>([]);
  const [showMasterGiftModal, setShowMasterGiftModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const intelItems = useMemo(() => {
    const items: IntelItem[] = [];
    let idCounter = 1;

    const addItems = (sourceItems: any[], intelCategory: IntelCategory) => {
      // Sort source items by real date if available
      const sorted = [...sourceItems].sort((a, b) => {
          const dA = new Date(a.dateAdded || 0).getTime();
          const dB = new Date(b.dateAdded || 0).getTime();
          if (!isNaN(dA) && !isNaN(dB)) return dB - dA;
          if (!isNaN(dA)) return -1;
          if (!isNaN(dB)) return 1;
          return 0;
      });
      
      const recent = sorted.slice(0, 4);
      recent.forEach((item) => {
        const v = String(item.version || '').toLowerCase();
        const title = String(item.name || item.title || '').toLowerCase();
        
        // Smart determination of NEW vs UPDATE
        const isUpdate = (v && v !== '1.0' && v !== '1.0.0' && v !== 'v1.0' && v !== 'v1.0.0' && v !== 'release' && v !== 'n/a' && v !== 'tba') || title.includes('update') || title.includes('hotfix') || title.includes('patch');
        const type = isUpdate ? 'UPDATE' : 'NEW';
        const descPrefix = isUpdate ? 'Updated to' : 'New addition:';
        
        items.push({
          id: `intel-${idCounter++}`,
          title: item.name || item.title || 'Unknown',
          description: `${descPrefix} ${item.version ? `(v${item.version})` : item.name || item.title}`,
          timestamp: item.dateAdded || '', // Use exact real date, formatTimeAgo handles empty
          category: intelCategory,
          type: type,
          version: item.version
        });
      });
    };

    addItems(allResources['game'] || [], 'GAME');
    addItems(allResources['hypervisor'] || [], 'HYPERVISOR');
    addItems(allResources['steamtools'] || [], 'STEAMTOOLS');
    addItems(allResources['architect'] || [], 'ARCHITECT');
    addItems(allResources['extra'] || [], 'EXTRA');
    addItems(upcomingGames || [], 'UPCOMING');

    // Sort globally by timestamp descending
    return items.sort((a, b) => {
        const dA = new Date(a.timestamp || 0).getTime();
        const dB = new Date(b.timestamp || 0).getTime();
        if (!isNaN(dA) && !isNaN(dB)) return dB - dA;
        if (!isNaN(dA)) return -1;
        if (!isNaN(dB)) return 1;
        return 0;
    });
  }, [allResources, upcomingGames]);

  const recentProducts = useMemo(() => {
    let all: ResourceItem[] = [];
    ["game", "hypervisor", "steamtools", "architect", "extra"].forEach(cat => {
        all = all.concat(allResources[cat] || []);
    });
    const scoredItems = all.map(item => {
        let score = 0;
        let d = 0;
        if (item.dateAdded) {
            if (!isNaN(Number(item.dateAdded))) d = Number(item.dateAdded);
            else d = new Date(item.dateAdded).getTime();
        }
        if (!isNaN(d) && d > 0) {
            const daysOld = (Date.now() - d) / (1000 * 60 * 60 * 24);
            score += Math.max(0, 100 - (daysOld * 0.5));
        }
        if (["game", "hypervisor"].includes(item.category?.toLowerCase())) score += 15;

        if (item.coverImage && !item.coverImage.includes("placehold.co")) score += 10;
        if (item.ratingPositive && !isNaN(parseInt(item.ratingPositive))) {
            const p = parseInt(item.ratingPositive);
            if (p > 90) score += 20;
            else if (p > 80) score += 10;
            else if (p > 70) score += 5;
        }
        return { item, score, d };
    });
    return scoredItems.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (!isNaN(a.d) && !isNaN(b.d)) return b.d - a.d;
        return 0;
    }).map(s => s.item).slice(0, 20);
  }, [allResources]);

  const [showSteamModal, setShowSteamModal] = useState(false);

  // Math Game State
  const [showMathGame, setShowMathGame] = useState(false);
  const [mathProblem, setMathProblem] = useState({ q: '', a: 0, note: '' });
  const [mathInput, setMathInput] = useState('');
  const [mathStatus, setMathStatus] = useState<'playing' | 'won' | 'lost' | 'locked'>('playing');
  const [mathLockoutTime, setMathLockoutTime] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(2);

  useEffect(() => {
    const accepted = localStorage.getItem('nexa_disclaimer_accepted');
    if (!accepted) {
        setShowDisclaimer(true);
    }
  }, []);

  // --- INITIALIZE LOCKOUT STATE ---
  useEffect(() => {
    const lockout = localStorage.getItem('nexa_math_lockout');
    if (lockout) {
        const time = parseInt(lockout);
        if (time > Date.now()) {
            setMathLockoutTime(time);
            setMathStatus('locked');
        } else {
            localStorage.removeItem('nexa_math_lockout');
        }
    }
  }, []);

  useEffect(() => {
    if (showHackerLoader) {
      setHackerProgress(0);
      setTerminalLines([]);
      
      const lines = [
        "INIT: SECURE_PROTOCOL_V4",
        "CONNECTING TO MAINFRAME...",
        "BYPASSING FIREWALL...",
        "ACCESS GRANTED.",
        "DECRYPTING AREA CONTENTS...",
        "SYNCING ASSETS...",
        "VERIFYING CHECKSUMS...",
        "FINALIZING..."
      ];
      let lineIndex = 0;

      const interval = setInterval(() => {
        setHackerProgress(prev => {
          let nextProgress = prev;
          
          if (loading && prev >= 90) {
            nextProgress = 90;
          } else if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setShowHackerLoader(false), 1200);
            nextProgress = 100;
          } else if (!loading && prev >= 90) {
            nextProgress = Math.min(100, prev + 5);
          } else {
            nextProgress = Math.min(100, prev + Math.floor(Math.random() * 15) + 5);
          }

          if (nextProgress > lineIndex * 12 && lineIndex < lines.length) {
            setTerminalLines(current => {
              const newLines = [...current, `> ${lines[lineIndex]}`];
              return newLines.slice(-4); // Keep only last 4 lines
            });
            lineIndex++;
          }
          
          if (nextProgress === 100 && lineIndex === lines.length) {
            setTerminalLines(current => {
              const newLines = [...current, "> SYNC COMPLETE. WELCOME."];
              return newLines.slice(-4);
            });
            lineIndex++;
          }

          return nextProgress;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [showHackerLoader, loading]);

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem('nexa_disclaimer_accepted', 'true');
  };

  useEffect(() => {
    if (isUnlocked && !showHackerLoader) {
        const hasSeenWolfGreeting = localStorage.getItem('nexa_wolf_greeting_seen');
        if (hasSeenWolfGreeting) return;
        localStorage.setItem('nexa_wolf_greeting_seen', 'true');

        const t1 = setTimeout(() => {
            const id = Date.now();
            setNotifications(prev => [...prev, {
                id,
                title: '🐺 Alpha Protocol Initiated',
                text: 'Welcome to the inner circle.\nOnly the most perceptive navigate this far.\nYour instinct has led you to the pack. 🖤',
                time: 'Just now'
            }]);
            setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 8000);
        }, 5000);

        const t2 = setTimeout(() => {
            const id = Date.now() + 1;
            setNotifications(prev => [...prev, {
                id,
                title: '🐺 تفعيل بروتوكول النخبة',
                text: 'مرحباً بك في الدائرة الداخلية.\nغريزتك قادتك إلى هذا العمق حيث ينتمي الأقوى.\nهنا، لا مكان سوى للذئاب الحقيقية. 🖤',
                time: 'الآن',
                isAr: true
            }]);
            setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 8000);
        }, 14000); 

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isUnlocked, showHackerLoader]);

  // Math Game Functions
  const startMathGame = () => {
    // Check for lockout first
    const lockout = localStorage.getItem('nexa_math_lockout');
    if (lockout) {
        const time = parseInt(lockout);
        if (time > Date.now()) {
            setMathLockoutTime(time);
            setMathStatus('locked');
            setShowMathGame(true);
            return;
        } else {
            localStorage.removeItem('nexa_math_lockout');
        }
    }

    // Reset attempts if starting fresh without lockout
    setAttemptsLeft(2);

    // Advanced math patterns to challenge the user
    const mode = Math.floor(Math.random() * 5); // 5 complex modes
    let q = '';
    let a = 0;
    let note = ''; // Context like "α = 5"

    switch (mode) {
        case 0: // Greek Variables Algebra
            const alpha = Math.floor(Math.random() * 10) + 2; // 2-11
            const omega = Math.floor(Math.random() * 50) + 10;
            note = `Let α = ${alpha}, Ω = ${omega}`;
            // Problem: (Ω - α) * α
            q = `(Ω - α) × α`;
            a = (omega - alpha) * alpha;
            break;
        case 1: // Summation Sequence
            const limit = Math.floor(Math.random() * 3) + 3; // 3 to 5
            const add = Math.floor(Math.random() * 10);
            // Sum k=1 to limit of k
            // sum(3) = 6, sum(4) = 10, sum(5) = 15
            const sum = (limit * (limit + 1)) / 2;
            q = `∑(k=1 to ${limit}) k + ${add}`;
            a = sum + add;
            note = 'Calculate the summation sequence';
            break;
        case 2: // Squares and Roots
            const roots = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            const sqVal = roots[Math.floor(Math.random() * roots.length)];
            const rootVal = Math.sqrt(sqVal);
            const factor = Math.floor(Math.random() * 5) + 2;
            // q: √sqVal * factor^2
            q = `√${sqVal} × ${factor}²`;
            a = rootVal * (factor * factor);
            break;
        case 3: // Fractions and Cube Roots
            const cubes = [8, 27, 64]; // roots: 2, 3, 4
            const cbVal = cubes[Math.floor(Math.random() * cubes.length)];
            const cbRoot = Math.cbrt(cbVal); // 2,3,4
            // q: 1/2 of (∛cbVal * 100)
            q = `½ (∛${cbVal} × 100)`;
            a = 0.5 * (cbRoot * 100);
            break;
        case 4: // Delta Logic
            const delta = Math.floor(Math.random() * 5) + 3; // 3-7
            note = `Given Δ = ${delta}`;
            // q: (Δ³ ÷ Δ) + 10  -> simplifies to Δ^2 + 10
            q = `(Δ³ ÷ Δ) + 10`;
            a = (Math.pow(delta, 3) / delta) + 10;
            break;
    }
    
    setMathProblem({ q, a, note });
    setMathStatus('playing');
    setMathInput('');
    setShowMathGame(true);
  };

  const verifyMath = (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.abs(parseFloat(mathInput) - mathProblem.a) < 0.1) {
        setMathStatus('won');
        // Clear any previous attempts/lockout if won
        localStorage.removeItem('nexa_math_lockout');
    } else {
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        
        if (newAttempts <= 0) {
            // LOCKOUT LOGIC
            const lockTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            localStorage.setItem('nexa_math_lockout', lockTime.toString());
            setMathLockoutTime(lockTime);
            setMathStatus('locked');
        } else {
            // WRONG ANSWER FEEDBACK
            setMathStatus('lost');
            setTimeout(() => {
                setMathStatus('playing');
            }, 1000);
        }
    }
  };

  const copyAndCloseMath = () => {
    setPassword('Wolfspace'); // Pre-fill
    navigator.clipboard.writeText('Wolfspace'); // Copy
    setShowMathGame(false); // Close game
  };

  const filteredUpcoming = useMemo(() => {
    return upcomingGames.filter(g => {
        const p = g.platform ? g.platform.toLowerCase() : '';
        if (upcomingPlatform === 'PlayStation 5') return p.includes('ps5') || p.includes('playstation');
        if (upcomingPlatform === 'Xbox S/X') return p.includes('xbox') || p.includes('series');
        if (upcomingPlatform === 'Steam') return p.includes('steam') || p.includes('pc');
        return false;
    });
  }, [upcomingPlatform, upcomingGames]);

  useEffect(() => {
    const initial = Math.floor(Math.random() * (150000 - 30000 + 1)) + 30000;
    setVisitorCount(initial);
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 21) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (silent = false) => {
    if (!isUnlocked) return;
    if (!silent) setLoading(true);
    setError(null);
    setIsUpcomingMissing(false);
    setScriptError(false);

    try {
      const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          cache: 'no-store',
          redirect: 'follow'
      });
      if (!response.ok) {
          throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      let data;
      try {
          data = await response.json();
      } catch (parseError) {
          setScriptError(true);
          throw new Error("Google Script is down or returned invalid data. Please check code.gs deployment.");
      }
      
      const upcomingKey = Object.keys(data).find(k => k.toLowerCase() === 'upcoming');
      if (!upcomingKey) {
          setIsUpcomingMissing(true);
          setUpcomingGames([]);
      } else if (Array.isArray(data[upcomingKey])) {
         const mappedUpcoming: UpcomingGame[] = data[upcomingKey].map((item: any, index: number) => ({
             id: `ug-${index}`,
             title: item.name || item.title || 'Untitled',
             image: item.image || item.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED',
             platform: formatPlatformDisplay(item.platform || 'TBA'),
             price: item.price || 'TBA',
             icon: getPlatformIcon(item.platform || ''),
             dateAdded: item.date || item.timestamp || item.dateAdded || item.updated || ''
         }));
         setUpcomingGames(mappedUpcoming);
      } else {
         setUpcomingGames([]);
      }

      // Handle Upcoming Lists
      const upcomingListKey = Object.keys(data).find(k => k.toLowerCase() === 'upcominglist');
      if (upcomingListKey && Array.isArray(data[upcomingListKey])) {
          const newLists: { [key: string]: string[] } = {
              game: [],
              hypervisor: [],
              steamtools: [],
              tools: [],
              savegames: []
          };
          data[upcomingListKey].forEach((row: any) => {
              const rowKeys = Object.keys(row);
              Object.keys(newLists).forEach(category => {
                  const matchingKey = rowKeys.find(k => k.toLowerCase().replace(/\s+/g, '') === category);
                  if (matchingKey) {
                      const val = row[matchingKey];
                      if (val && typeof val === 'string' && val.trim() !== '') {
                          newLists[category].unshift(val.trim());
                      }
                  }
              });
          });
          setUpcomingLists(newLists);
      } else {
          setUpcomingLists({
              game: [],
              hypervisor: [],
              steamtools: [],
              tools: [],
              savegames: []
          });
      }

      // Handle Steam Accounts with robust header normalization
      const steamKey = Object.keys(data).find(k => k.toLowerCase() === 'steamaccounts');
      if (steamKey && Array.isArray(data[steamKey])) {
          setSteamAccounts(data[steamKey].map((raw: any) => {
              // Extract values by checking keys that start with the intended name
              const findByPrefix = (prefix: string) => {
                  const key = Object.keys(raw).find(k => k.toLowerCase().trim().startsWith(prefix.toLowerCase()));
                  return key ? raw[key] : undefined;
              };

              return {
                  username: findByPrefix('username') || '',
                  password: findByPrefix('password') || '',
                  games: findByPrefix('games') || '',
                  status: findByPrefix('status') || 'Online'
              };
          }));
      } else {
          setSteamAccounts([]);
      }

      // Handle Master Gift Accounts
      const masterGiftKey = Object.keys(data).find(k => k.toLowerCase().replace(/\s+/g, '') === 'mastergift');
      if (masterGiftKey && Array.isArray(data[masterGiftKey])) {
          setMasterGifts(data[masterGiftKey].map((raw: any) => {
              const findByPrefix = (prefix: string) => {
                  const key = Object.keys(raw).find(k => k.toLowerCase().trim().startsWith(prefix.toLowerCase()));
                  return key ? raw[key] : undefined;
              };
              return {
                  name: findByPrefix('name') || 'Unknown',
                  url: findByPrefix('url') || findByPrefix('link') || '',
                  logo: findByPrefix('logo') || findByPrefix('image') || '',
                  email: findByPrefix('email') || findByPrefix('user') || '',
                  password: findByPrefix('password') || findByPrefix('pass') || '',
                  status: findByPrefix('status') || 'Online'
              };
          }));
      } else {
          setMasterGifts([]);
      }

      // Handle Company Profiles
      const profilKey = Object.keys(data).find(k => {
          const lowerK = k.toLowerCase().trim();
          return lowerK === 'profil' || lowerK === 'profile' || lowerK === 'profiles' || lowerK === 'company';
      });
      if (profilKey && Array.isArray(data[profilKey])) {
          const profiles: CompanyProfile[] = data[profilKey].map((row: any, idx: number) => {
             const getVal = (key: string) => {
                const normalizedSearchKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                const foundKey = Object.keys(row).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearchKey);
                return foundKey ? row[foundKey] : '';
             };
             return {
                 id: row.id || `profile-${idx}`,
                 name: getVal('name') || getVal('company') || getVal('studio') || getVal('developer') || 'Unknown Company',
                 logoUrl: getVal('logourl') || getVal('logo') || getVal('image') || getVal('icon') || '',
                 description: getVal('description') || getVal('info') || '',
                 gameIds: (getVal('gamesid') || getVal('gameids') || getVal('gameid') || '').toString().split(',').map(s => s.trim()).filter(Boolean),
                 hypervisorIds: (getVal('hypervisionid') || getVal('hypervisorid') || getVal('hypervisorids') || '').toString().split(',').map(s => s.trim()).filter(Boolean),
                 steamtoolsIds: (getVal('steamtoolsid') || getVal('steamtoolsids') || '').toString().split(',').map(s => s.trim()).filter(Boolean),
                 architectIds: (getVal('toolsid') || getVal('architectids') || getVal('architectid') || '').toString().split(',').map(s => s.trim()).filter(Boolean)
             };
          });
          setCompanyProfiles(profiles);
      } else {
          setCompanyProfiles([]);
      }

      // Handle Popular Repacks
      const popularKey = Object.keys(data).find(k => k.toLowerCase().replace(/\s+/g, '').includes('popularrepack') || k.toLowerCase().replace(/\s+/g, '') === 'mostpopular');
      if (popularKey && Array.isArray(data[popularKey])) {
          const ids: string[] = [];
          data[popularKey].forEach((row: any) => {
             // Search all values in row for something that looks like an ID, or just extract the first column
             // Sometimes users name columns 'id', 'game', 'hypervisor'
             Object.values(row).forEach((val: any) => {
                if (val && typeof val === 'string' && val.trim() !== '') {
                    // split by comma if they put multiple
                    val.split(',').forEach((v: string) => ids.push(v.trim()));
                } else if (val && typeof val === 'number') {
                    ids.push(String(val));
                }
             });
          });
          setPopularRepackIds(Array.from(new Set(ids)));
      } else {
          setPopularRepackIds([]);
      }

      // Handle Top Games
      const topGamesKey = Object.keys(data).find(k => k.toLowerCase().replace(/\s+/g, '') === 'topgames');
      if (topGamesKey && Array.isArray(data[topGamesKey])) {
          const topGamesList: TopGame[] = data[topGamesKey].map((row: any, idx: number) => {
             const getVal = (keyStr: string) => {
                const normalizedSearchKey = keyStr.toLowerCase().replace(/[^a-z0-9]/g, '');
                const foundKey = Object.keys(row).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearchKey);
                return foundKey ? row[foundKey] : '';
             };
             return {
                 id: row.id || `topgame-${idx}`,
                 rank: Number(getVal('rank') || idx + 1),
                 name: getVal('name') || getVal('gamename') || getVal('title') || 'Unknown Game',
                 bannerUrl: getVal('bannerurl') || getVal('banner') || getVal('image') || '',
                 logoUrl: getVal('logourl') || getVal('logo') || '',
                 symbolUrl: getVal('symbolurl') || getVal('symbol') || getVal('icon') || ''
             };
          }).sort((a: TopGame, b: TopGame) => a.rank - b.rank);
          setTopGames(topGamesList);
      } else {
          setTopGames([]);
      }

      const transformed: Record<string, ResourceItem[]> = { game: [], hypervisor: [], steamtools: [], architect: [], extra: [] };
      Object.keys(data).forEach(tabKey => {
        const normalizedKey = tabKey.toLowerCase();
        let targetKey = '';
        let idPrefix = '';
        
        if (normalizedKey.includes('hypervisor')) { targetKey = 'hypervisor'; idPrefix = 'H'; }
        else if (normalizedKey.includes('upcoming') || normalizedKey.includes('steamaccounts') || normalizedKey.includes('mastergift') || normalizedKey.includes('profil') || normalizedKey.includes('topgames') || normalizedKey.includes('popularrepack')) { return; }
        else if (normalizedKey.includes('game') && !normalizedKey.includes('savegame')) { targetKey = 'game'; idPrefix = 'G'; }
        else if (normalizedKey.includes('steamtools')) { targetKey = 'steamtools'; idPrefix = 'S'; }
        else if (normalizedKey.includes('architect')) { targetKey = 'architect'; idPrefix = 'A'; }
        else if (normalizedKey.includes('extra') || normalizedKey.includes('savegame')) { targetKey = 'extra'; idPrefix = 'E'; }

        if (targetKey && transformed.hasOwnProperty(targetKey)) {
          transformed[targetKey] = data[tabKey].map((row: any, idx: number) => {
            // Robust access: check case-insensitive and ignore non-alphanumeric
            const getVal = (key: string) => {
                const normalizedSearchKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
                const foundKey = Object.keys(row).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSearchKey);
                return foundKey ? row[foundKey] : '';
            };
            
            const reqsStr = getVal('requirements');
            const reqs = (reqsStr || '').toString().split('|').map((s: string) => {
              const parts = s.split(':');
              return { 
                label: parts[0]?.trim() || 'Info', 
                value: parts[1]?.trim() || 'N/A', 
                icon: parts[2]?.trim() || 'Box',
                link: parts[3]?.trim() || undefined
              };
            }).filter((r: any) => r.value && r.value !== 'N/A');

            const steps = (getVal('steps') || '').toString().split('|').map((s: string) => s.trim()).filter((s: string) => s);
            const gallery = (getVal('gallery') || '').toString().split('|').map((s: string) => s.trim()).filter((s: string) => s && s.startsWith('http'));
            const toolsParsed = (getVal('tools') || '').toString().split('|').map((s: string) => {
                const parts = s.split('^');
                return { name: parts[0]?.trim(), url: parts[1]?.trim() };
            }).filter((t: any) => t.name && t.url);

            const partsArr: { id: number, link: string, note?: string }[] = [];
            const mirrorsArr: { id: number, link: string, note?: string }[] = [];
            for (let i = 1; i <= 20; i++) {
                let pVal = getVal(`part${i}`);
                let pNote = getVal(`partNote${i}`) || getVal(`note${i}`);
                
                // Helper to extract note from link string
                const extractNote = (val: string) => {
                    if (!val) return { link: '', note: '' };
                    val = val.trim();
                    
                    // Format: Link | Note
                    if (val.includes('|')) {
                        const parts = val.split('|');
                        return { link: parts[0].trim(), note: parts[1].trim() };
                    }
                    
                    // Format: Link 'Note' or Link "Note"
                    // Added \s* at the end just in case
                    const singleQuoteMatch = val.match(/^(.*?)\s+'([^']+)'\s*$/);
                    if (singleQuoteMatch) {
                        return { link: singleQuoteMatch[1].trim(), note: singleQuoteMatch[2].trim() };
                    }
                    
                    const quoteMatch = val.match(/^(.*?)\s+"([^"]+)"\s*$/);
                    if (quoteMatch) {
                        return { link: quoteMatch[1].trim(), note: quoteMatch[2].trim() };
                    }

                    // Format: Link (Note)
                    const parenMatch = val.match(/^(.*?)\s+\(([^)]+)\)\s*$/);
                    if (parenMatch) {
                        return { link: parenMatch[1].trim(), note: parenMatch[2].trim() };
                    }

                    return { link: val.trim(), note: '' };
                };

                if (pVal) {
                    const extracted = extractNote(pVal);
                    pVal = extracted.link;
                    if (extracted.note) pNote = extracted.note;
                }

                let mVal = getVal(`mirror${i}`);
                let mNote = getVal(`mirrorNote${i}`);

                if (mVal) {
                    const extracted = extractNote(mVal);
                    mVal = extracted.link;
                    if (extracted.note) mNote = extracted.note;
                }

                if (pVal) partsArr.push({ id: i, link: pVal, note: pNote });
                if (mVal) mirrorsArr.push({ id: i, link: mVal, note: mNote });
            }

            const isPinnedRaw = getVal('pinned');
            const isFreeRaw = getVal('price') || getVal('isfree') || getVal('free');

            return {
              id: `${idPrefix}${row.id || (idx + 1)}`,
              category: targetKey,
              name: getVal('name') || 'Secure Fragment',
              version: getVal('version') || 'v1.0',
              repackSize: getVal('repackSize') || 'N/A',
              originalSize: getVal('originalSize') || 'N/A',
              genres: getVal('genres') || '',
              languages: getVal('languages') || 'ENG',
              repackBy: getVal('repackBy') || 'NEXA',
              developer: getVal('developer') || getVal('studio') || getVal('company') || '',
              coverImage: getVal('coverImage') || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED',
              galleryImages: gallery,
              description: getVal('description') || 'No intel available.',
              gameId: getVal('gameId') || '',
              ratingPositive: getVal('ratingPositive') || '',
              ratingNegative: getVal('ratingNegative') || '',
              dateAdded: getVal('date') || getVal('timestamp') || getVal('dateAdded') || getVal('updated') || getVal('time') || getVal('created') || '',
              hasDenuvo: String(getVal('denuvo')).toLowerCase() === 'true',
              hasExternalLauncher: String(getVal('launcher')).toLowerCase() === 'true',
              systemReqs: reqs,
              installSteps: steps,
              isPinned: String(isPinnedRaw).toLowerCase() === 'true' || String(isPinnedRaw).toLowerCase() === 'yes' || String(isPinnedRaw).toLowerCase() === 'on',
              isFree: String(isFreeRaw).toLowerCase() === 'true' || String(isFreeRaw).toLowerCase() === 'yes' || String(isFreeRaw).toLowerCase() === 'free' || String(isFreeRaw) === '0',
              toolsNeeded: toolsParsed,
              links: { 
                parts: partsArr,
                mirrors: mirrorsArr,
                full: getVal('full'), 
                fullNote: getVal('fullNote') || getVal('note'),
                tutorial: getVal('tutorial'), 
                dlc: getVal('dlc'), 
                trailer: getVal('trailer')
              }
            };
          }).reverse();
        }
      });
      
      setAllResources(transformed);
    } catch (err: any) {
      console.warn("Fetch failed, using local offline dummy data. The original Google Sheet is currently unavailable.");
      setUpcomingGames([]);
      setUpcomingLists({
          game: [],
          hypervisor: [],
          steamtools: [],
          tools: [],
          savegames: []
      });
      setSteamAccounts([]);
      setMasterGifts([]);
      setCompanyProfiles([]);
      setAllResources({
        game: [],
        hypervisor: [],
        steamtools: [],
        architect: [],
        extra: []
      });
      setError("CRITICAL ERROR: Google Apps Script Connection Failed. \n\nReason: The Web App URL is returning an HTML error page instead of JSON data. This usually happens if you created the script at script.google.com (standalone) instead of clicking 'Extensions -> Apps Script' directly inside your Google Sheet! So `getActiveSpreadsheet()` is failing.\n\nHOW TO FIX:\n1. Open your Google Sheet.\n2. Click 'Extensions -> Apps Script'.\n3. Paste your code there.\n4. Deploy as Web App (Execute as: Me, Access: Anyone).\n5. Paste the new URL in the code.");
    } finally {
      setLoading(false);
    }
  };

  const getCompanyResources = (profile: CompanyProfile) => {
      const resources: ResourceItem[] = [];
      const isMatch = (item: ResourceItem, ids: string[]) => {
          const lowerIds = (ids || []).map(id => String(id).toLowerCase().trim()).filter(Boolean);
          const numericIds = (ids || []).map(id => String(id).replace(/^[A-Za-z]+[-]?/, '').toLowerCase().trim()).filter(Boolean);
          const itemIdsToMatch = [
              String(item.id || '').toLowerCase().trim(),
              String(item.id || '').replace(/^[A-Za-z]+[-]?/, '').toLowerCase().trim(),
              String(item.gameId || '').toLowerCase().trim()
          ].filter(Boolean);
          
          if (lowerIds.length > 0) {
              return lowerIds.some(id => 
                 itemIdsToMatch.includes(id) || 
                 itemIdsToMatch.some(itemId => itemId === id || itemId.endsWith(`-${id}`) || itemId.endsWith(id))
              ) || numericIds.some(id => itemIdsToMatch.includes(id));
          }
          
          // Fallback strict matching if no IDs were provided (e.g. for temporary profiles)
          const dev = String(item.developer || '').trim().toLowerCase();
          const rep = String(item.repackBy || '').trim().toLowerCase();
          const pname = String(profile.name || '').trim().toLowerCase();
          
          if (dev && pname && (dev === pname || dev.includes(pname) || pname.includes(dev))) return true;
          if (rep && pname && (rep === pname || rep.includes(pname) || pname.includes(rep))) return true;
          
          return false;
      };
      
      if (allResources.game) resources.push(...allResources.game.filter(item => isMatch(item, profile.gameIds || [])));
      if (allResources.hypervisor) resources.push(...allResources.hypervisor.filter(item => isMatch(item, profile.hypervisorIds || [])));
      if (allResources.steamtools) resources.push(...allResources.steamtools.filter(item => isMatch(item, profile.steamtoolsIds || [])));
      if (allResources.architect) resources.push(...allResources.architect.filter(item => isMatch(item, profile.architectIds || [])));
      if (allResources.extra) resources.push(...allResources.extra.filter(item => isMatch(item, profile.extraIds || [])));

      return resources;
  };

  const handleCompanyClick = (companyName: string) => {
      const profile = companyProfiles.find(p => p.name.trim().toLowerCase() === companyName.trim().toLowerCase());
      if (profile) {
          setSelectedCompanyProfile(profile);
      } else {
          setSelectedCompanyProfile({
              id: 'temp-' + companyName,
              name: companyName,
              logoUrl: '',
              description: 'Company Profile not fully established in our database yet. Explore ecosystem tools below.'
          });
      }
  };

  useEffect(() => { 
      if (isUnlocked) {
          fetchData(); 
      }
  }, [isUnlocked]);
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  useEffect(() => {
      const hash = window.location.hash;
      const qIndex = hash.indexOf('?');
      if (qIndex !== -1) {
          const params = new URLSearchParams(hash.substring(qIndex));
          const itemId = params.get('item');
          if (itemId) {
              const allItems = Object.values(allResources).flat();
              if (allItems.length > 0) {
                  const foundItem = allItems.find(i => i.id === itemId);
                  if (foundItem) {
                      setSelectedResource(foundItem);
                      if (['game', 'hypervisor', 'steamtools', 'architect', 'extra'].includes(foundItem.category.toLowerCase())) {
                          setActiveTab(foundItem.category.toLowerCase() as any);
                      }
                      // Remove the query param to prevent reopening on reload
                      const newHash = hash.substring(0, qIndex);
                      window.history.replaceState({}, document.title, window.location.pathname + window.location.search + newHash);
                  }
              }
          }
      }
  }, [allResources, isUnlocked]);

  const filteredData = useMemo(() => {
    let currentTabData: ResourceItem[] = [];
    if (activeTab === 'stash') {
      const allItems = Object.values(allResources).flat();
      currentTabData = allItems.filter(item => stash.includes(item.id));
      // Remove duplicates
      currentTabData = Array.from(new Map(currentTabData.map(item => [item.id, item])).values());
    } else {
      currentTabData = allResources[activeTab] || [];
    }

    const query = searchQuery.toLowerCase();
    const filtered = currentTabData.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.id.toLowerCase().includes(query) ||
      (item.genres && item.genres.toLowerCase().includes(query)) ||
      (item.gameId && String(item.gameId).toLowerCase().includes(query))
    );
    return filtered.sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
    });
  }, [allResources, activeTab, searchQuery, stash]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Wolfspace') {
      setIsUnlocked(true);
      setShowHackerLoader(true);
      setHackerProgress(0);
      localStorage.setItem('secret_area_unlocked', 'true');
    } else {
      setError('AUTHORIZATION FAILED');
      setPassword('');
    }
  };

  const handleRequestSubmit = async (requestData: any) => {
    try {
        await fetch(API_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(requestData)
        });
        
        const notifId = Date.now();
        setNotifications(prev => [...prev, {
            id: notifId,
            title: 'Request Sent',
            text: `Your request for "${requestData.title}" has been submitted to the admin team.`,
            time: 'Just now'
        }]);

        // Auto remove alert after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 5000);

    } catch (err) {
        console.error("Submission failed", err);
        const notifId = Date.now();
        setNotifications(prev => [...prev, {
            id: notifId,
            title: 'Request Error',
            text: 'There was an issue sending your request. Please try again.',
            time: 'Just now'
        }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 5000);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full h-screen fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 overflow-y-auto font-sans transition-colors duration-300">
        <div className="min-h-full w-full flex items-center justify-center p-4 py-8 relative">
          <div className="fixed inset-0 z-0 pointer-events-none">
             {bgImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 dark:opacity-40"
                  style={{ backgroundImage: `url(${bgImage})` }} 
                />
             )}
             <div className="absolute inset-0 bg-slate-50/70 dark:bg-slate-950/70 md:backdrop-blur-[2px]"></div>
             <div 
               className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-900/20 rounded-full md:blur-[120px] blur-[80px]"
             />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="w-[95%] sm:w-[85%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-w-5xl relative z-10"
          >
          <div className="bg-white/90 dark:bg-slate-900/90 md:backdrop-blur-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            {showMathGame ? (
                <div className="p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 text-center relative overflow-hidden">
                    
                    {/* Matrix Digital Rain Effect (Static Visual) */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
                        <div className="animate-pulse text-[10px] font-mono leading-3 text-emerald-500 break-words text-justify p-2 select-none">
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                        </div>
                    </div>

                    <button onClick={() => setShowMathGame(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20">
                        <Icon name="X" size={24} />
                    </button>
                    
                    <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-blue-500/20">
                            <Icon name="Cpu" size={32} className="text-blue-500 animate-pulse" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">Security Challenge</h2>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Advanced Protocol</p>
                    </div>

                    {mathStatus === 'locked' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 relative z-10 py-6">
                            <div className="text-red-500 flex justify-center animate-pulse"><Icon name="Skull" size={64} /></div>
                            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
                                <h3 className="text-lg font-black text-red-500 uppercase mb-2">System Locked</h3>
                                <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase leading-relaxed">
                                    you are a loser contact admin to request secret key
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Retry Available In</span>
                                {mathLockoutTime && <LockoutTimer targetTime={mathLockoutTime} />}
                            </div>
                        </motion.div>
                    )}

                    {mathStatus === 'playing' && (
                        <form onSubmit={verifyMath} className="space-y-4 sm:space-y-6 relative z-10">
                            <div className="py-4 sm:py-6 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                                
                                {mathProblem.note && (
                                    <div className="mb-2 sm:mb-3">
                                        <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
                                            {mathProblem.note}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="px-2">
                                    <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-slate-800 dark:text-slate-100 tracking-wider break-all leading-tight">
                                        {mathProblem.q} = ?
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input Answer</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${attemptsLeft === 1 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                                    {attemptsLeft} Attempts Left
                                </span>
                            </div>

                            <input 
                                type="number" 
                                value={mathInput} 
                                onChange={e => setMathInput(e.target.value)} 
                                placeholder="ENTER RESULT" 
                                autoFocus
                                step="any"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-4 font-mono text-lg sm:text-xl font-bold text-center outline-none focus:border-blue-500 transition-colors shadow-inner"
                            />
                            
                            <button type="submit" className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs sm:text-sm">
                                Verify Calculation
                            </button>
                        </form>
                    )}

                    {mathStatus === 'won' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 relative z-10">
                            <div className="text-emerald-500 flex justify-center"><Icon name="CheckCircle" size={48} /></div>
                            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 px-4">
                                "Intelligence confirmed. Welcome to the inner circle."
                            </p>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                                <span className="block text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Secret Key</span>
                                <span className="font-mono text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 select-all">Wolfspace</span>
                            </div>
                            <button onClick={copyAndCloseMath} className="w-full py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm">
                                <Icon name="Copy" size={18} /> Copy & Enter
                            </button>
                        </motion.div>
                    )}

                    {mathStatus === 'lost' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 relative z-10">
                            <div className="text-red-500 flex justify-center mb-4"><Icon name="AlertTriangle" size={48} /></div>
                            <h3 className="text-xl font-black text-red-500 uppercase">Incorrect</h3>
                            <p className="text-xs font-bold text-slate-500 mt-2">Calculation Error. Be careful.</p>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="p-4 sm:p-8 md:p-10 flex flex-col gap-4 relative overflow-hidden h-full min-h-[500px]">
                   {/* Grid Background Effect */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
                   
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.5 }}
                     className="text-center shrink-0"
                   >
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1 select-none">N E X A INTERFACE</h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 select-none">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                         FORTRESS SECURITY LAYER
                      </p>
                   </motion.div>
                   
                   <motion.div 
                     initial={{ scale: 0.95, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                     className="bg-black/5 dark:bg-black/40 md:backdrop-blur-md rounded-xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col flex-1 shadow-2xl relative group min-h-[300px]"
                   >
                      <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      <div className="bg-[#2E3440] dark:bg-[#20242D] px-3 py-2 flex items-center gap-3 border-b border-[#4C566A] dark:border-[#3B4252] shrink-0 relative z-10">
                        <div className="flex gap-1.5 p-1">
                          <Icon name="Terminal" size={14} className="text-[#D8DEE9]" />
                        </div>
                        <div className="flex-1 text-center text-xs font-sans text-[#E5E9F0] dark:text-[#E5E9F0] py-1">
                          guest@nexa1337.com: ~
                        </div>
                        <div className="flex gap-1.5 p-1 group">
                          <Icon name="X" size={14} className="text-[#D8DEE9] hover:text-[#BF616A] cursor-pointer transition-colors" />
                        </div>
                      </div>
                      <div 
                        className="flex-1 p-4 overflow-y-auto font-mono text-[12px] sm:text-[13px] custom-scrollbar relative z-10 text-[#D8DEE9]" 
                        style={{ 
                          backgroundImage: "linear-gradient(rgba(10, 10, 12, 0.45), rgba(10, 10, 12, 0.55)), url('https://guide-images.cdn.ifixit.com/igi/yIjDodkoTxh26KQx.full')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundColor: '#121212',
                          textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.7)'
                        }}
                        onClick={() => document.getElementById('terminal-input')?.focus()}
                      >
                        {!terminalCleared && (
                          <div className="mb-4">
                             <span className="text-[#89B4FA] font-bold">┌──(</span><span className="text-[#E5E9F0] font-bold">guest㉿nexa1337.com</span><span className="text-[#89B4FA] font-bold">)-[</span><span className="text-[#E5E9F0] font-bold">~</span><span className="text-[#89B4FA] font-bold">]</span><br/>
                             <span className="text-[#89B4FA] font-bold">└─$</span> <span className="text-[#A6E3A1]">N E X A OS - System Online</span>
                          </div>
                        )}
                        {terminalHistory.map((line, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`mb-1.5 leading-relaxed tracking-wide whitespace-pre-wrap ${
                              line.type === 'system' ? 'text-[#89B4FA] font-bold' :
                              line.type === 'user' ? 'text-[#E5E9F0]' :
                              line.type === 'error' ? 'text-[#BF616A]' :
                              line.type === 'success' ? 'text-[#A6E3A1] font-bold' :
                              'text-[#D8DEE9]'
                            }`}
                          >
                            {line.text}
                          </motion.div>
                        ))}
                        <form onSubmit={handleTerminalSubmit} className="flex flex-col mt-2">
                          {terminalMode === 'password' ? (
                            <div className="flex items-center text-[#89B4FA] font-bold mb-1">
                               Please enter the Secret Code:
                            </div>
                          ) : (
                            <div className="flex items-center text-[#89B4FA] font-bold">
                               ┌──(<span className="text-[#E5E9F0]">guest㉿nexa1337.com</span>)-[<span className="text-[#E5E9F0]">~</span>]
                            </div>
                          )}
                          <div className="flex items-center items-stretch">
                            {terminalMode === 'password' ? null : (
                              <span className="text-[#89B4FA] font-bold mr-2 shrink-0 drop-shadow-sm flex items-center">
                                 └─$
                              </span>
                            )}
                            <input 
                              id="terminal-input"
                              type={terminalMode === 'password' ? 'password' : 'text'} 
                              value={terminalInput}
                              onChange={(e) => setTerminalInput(e.target.value)}
                              onKeyDown={handleTerminalKeyDown}
                              className="flex-1 bg-transparent outline-none text-[#E5E9F0] font-mono tracking-wide caret-[#E5E9F0]"
                              autoFocus
                              autoComplete="off"
                              spellCheck="false"
                            />
                          </div>
                        </form>
                        <div ref={terminalEndRef} />
                      </div>
                   </motion.div>
                </div>
            )}
          </div>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 selection:bg-primary-500/30 transition-colors duration-300 overflow-x-hidden">
      
      <AnimatePresence>
        {showHackerLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-300"
          >
            {/* Modern Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
               <div 
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full md:blur-[120px] blur-[80px]"
               />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
               
               {/* Grid overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
              {/* Logo / Icon */}
              <div className="relative mb-10 w-32 h-32 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-dashed border-primary-500/40 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 border border-indigo-500/30 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-6 bg-primary-500/10 rounded-full blur-md"
                />
                <div className="w-20 h-20 bg-white dark:bg-slate-900 border border-primary-500/60 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(14,165,233,0.2)] dark:shadow-[0_0_40px_rgba(14,165,233,0.3)] relative z-10">
                  <Icon name="ShieldAlert" size={32} className="text-primary-500 dark:text-primary-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black tracking-[0.3em] uppercase mb-4 text-center relative">
                <span className="relative z-10">Secret Area</span>
                <motion.span 
                  animate={{ opacity: [0, 1, 0], x: [-5, 5, -5] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                  className="absolute inset-0 text-primary-500 opacity-30 dark:opacity-50 blur-[2px] -z-10"
                >
                  Secret Area
                </motion.span>
              </h2>
              
              {/* Terminal Output */}
              <div className="w-full bg-slate-100/80 dark:bg-black/50 border border-primary-500/20 rounded-lg p-4 mb-8 h-32 flex flex-col justify-end overflow-hidden relative md:backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-50"></div>
                {terminalLines.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary-600 dark:text-primary-400 font-mono text-xs md:text-sm mb-1"
                  >
                    {line}
                  </motion.div>
                ))}
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-4 bg-primary-500 mt-1"
                />
              </div>
              
              {/* Progress Bar */}
              <div className="w-full relative">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden relative border border-slate-300 dark:border-slate-700/50 md:backdrop-blur-sm">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 via-primary-500 to-cyan-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${hackerProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  {/* Glare effect on progress bar */}
                  <motion.div 
                    className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ left: ["-20%", "120%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="w-full flex justify-between mt-4 text-slate-500 dark:text-slate-400 font-mono text-[10px] md:text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping"></span>
                    SYSTEM SYNCHRONIZATION ACTIVE
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 font-bold">{hackerProgress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showHackerLoader && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
            {notifications.map(n => (
                <motion.div
                    key={n.id}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className={`bg-white/80 dark:bg-slate-900/80 md:backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 rounded-2xl w-[300px] pointer-events-auto flex gap-3 items-start ${n.isAr ? 'rtl' : 'ltr'}`}
                    dir={n.isAr ? 'rtl' : 'ltr'}
                >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-xl border border-slate-200 dark:border-slate-700">
                        🐺
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{n.title}</h4>
                            <span className="text-[9px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug whitespace-pre-line font-medium">
                            {n.text}
                        </p>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <DisclaimerModal open={showDisclaimer} onClose={handleCloseDisclaimer} />
      <LatestIntelPanel open={showIntelPanel} onClose={() => setShowIntelPanel(false)} items={intelItems} />
      <DuaPopup />

      <AnimatePresence>
        {selectedResource && (
          <ResourceDetailModal 
            item={selectedResource} 
            onClose={() => setSelectedResource(null)} 
            isHypervisor={selectedResource.category === 'hypervisor'}
            stash={stash}
            toggleStash={toggleStash}
            onCompanyClick={handleCompanyClick}
            onGenreClick={(genre) => {
              setSearchQuery(genre);
              if (['game', 'hypervisor', 'steamtools'].includes(selectedResource.category.toLowerCase())) {
                  setActiveTab(selectedResource.category.toLowerCase() as any);
              }
              setSelectedResource(null);
            }}
            resolvedDev={getResolvedDeveloper(selectedResource)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCompanyProfile && (
            <CompanyProfileModal
                profile={selectedCompanyProfile}
                resources={getCompanyResources(selectedCompanyProfile)}
                onClose={() => setSelectedCompanyProfile(null)}
                onItemClick={(item) => {
                    setSelectedCompanyProfile(null);
                    setSelectedResource(item);
                }}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRequestModal && (
            <RequestModal 
                open={showRequestModal} 
                onClose={() => setShowRequestModal(false)} 
                onSubmit={handleRequestSubmit}
                initialTitle={requestModalInitialTitle}
                allResources={allResources}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSteamModal && (
            <SteamAccountsModal 
                open={showSteamModal} 
                onClose={() => setShowSteamModal(false)} 
                accounts={steamAccounts} 
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMasterGiftModal && (
            <MasterGiftModal 
                open={showMasterGiftModal} 
                onClose={() => setShowMasterGiftModal(false)} 
                accounts={masterGifts} 
            />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDonateModal && (
            <DonateModal 
                open={showDonateModal} 
                onClose={() => setShowDonateModal(false)} 
            />
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-40 relative z-10">
        
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 relative z-[9999] pointer-events-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full pb-1">
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
                 className={`px-3 py-1.5 border rounded-lg flex items-center gap-2.5 shadow-lg whitespace-nowrap shrink-0 relative overflow-hidden group transition-all duration-300 ${
                   networkStatus.isTesting
                     ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-500/40 text-yellow-600 dark:text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]'
                     : networkStatus.quality === 'Excellent' || networkStatus.quality === 'Good' || !networkStatus.quality // default fallback
                       ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-500/40 text-primary-600 dark:text-primary-400 shadow-[0_0_15px_rgba(14,165,233,0.2)] hover:shadow-[0_0_25px_rgba(14,165,233,0.4)]'
                       : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]'
                 }`}
               >
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent -left-full group-hover:animate-[shimmer_1.5s_infinite] ${
                    networkStatus.isTesting ? 'via-yellow-400/10' : (networkStatus.quality === 'Poor' || networkStatus.quality === 'Fair' ? 'via-red-400/10' : 'via-primary-400/10')
                  }`} />
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      networkStatus.isTesting ? 'bg-yellow-400' : (networkStatus.quality === 'Poor' || networkStatus.quality === 'Fair' ? 'bg-red-400' : 'bg-primary-400')
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      networkStatus.isTesting ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,1)]' : (networkStatus.quality === 'Poor' || networkStatus.quality === 'Fair' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,1)]')
                    }`}></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-[0.15em] flex items-center">
                     <motion.span 
                       className="hidden sm:inline"
                       animate={{ opacity: [1, 0.7, 1], textShadow: ["0 0 0px transparent", `0 0 8px ${networkStatus.isTesting ? 'rgba(234,179,8,0.5)' : (networkStatus.quality === 'Poor' || networkStatus.quality === 'Fair' ? 'rgba(239,68,68,0.5)' : 'rgba(14,165,233,0.5)')}`, "0 0 0px transparent"] }}
                       transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                     >
                       {networkStatus.isTesting ? 'ANALYZING CONNECTION...' : (networkStatus.quality === 'Poor' || networkStatus.quality === 'Fair' ? 'CONNECTION UNSTABLE' : 'SECURE CONNECTION ESTABLISHED')}
                     </motion.span>
                     <span className="sm:hidden">{networkStatus.isTesting ? 'ANALYZING' : (networkStatus.quality === 'Poor' || networkStatus.quality === 'Fair' ? 'UNSTABLE' : 'SECURE')}</span>
                  </span>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
                 className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0 relative overflow-hidden group shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -left-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="flex items-center justify-center text-emerald-500"
                  >
                    <Icon name="Loader2" size={12} /> 
                  </motion.div>
                  <span className="tabular-nums tracking-wider">{visitorCount.toLocaleString()}</span> 
                  <motion.span 
                    className="hidden sm:inline tracking-[0.1em]"
                    animate={{ opacity: [0.8, 1, 0.8], textShadow: ["0 0 0px transparent", "0 0 8px rgba(16,185,129,0.6)", "0 0 0px transparent"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    NODES ACTIVE
                  </motion.span>
                  <span className="sm:hidden text-emerald-500 ml-1">
                    <Icon name="Activity" size={12} />
                  </span>
               </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] xl:text-7xl lg:whitespace-nowrap font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase italic relative shrink-0">
              Secret 
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-cyan-300 inline-block ml-2"
                animate={{
                  textShadow: [
                    "0px 0px 0px transparent",
                    "2px 0px 0px rgba(255,0,0,0.8), -2px 0px 0px rgba(0,0,255,0.8)",
                    "0px 0px 0px transparent"
                  ],
                  x: [0, -2, 2, 0],
                  skewX: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.25,
                  repeat: Infinity,
                  repeatDelay: 4,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              >
                Area
              </motion.span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm md:text-base font-medium leading-relaxed border-l-2 border-slate-300 dark:border-slate-800 pl-4">
              Everything you need, from games to tools, collected from trusted sources and presented in a clean experience ad-free.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-[75%] relative z-[90]">
            <button 
                id="btn-free-accounts"
                type="button"
                onClick={(e) => { e.preventDefault(); setShowSteamModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >
                <Icon name="BrandSteam" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Free Accounts
                    {steamAccounts && steamAccounts.length > 0 && (
                        <span className="flex items-center justify-center bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-md border border-red-400">
                            {steamAccounts.length}
                        </span>
                    )}
                </span>
            </button>
            <button 
                id="btn-master-gift"
                type="button"
                onClick={(e) => { e.preventDefault(); setShowMasterGiftModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >
                <Icon name="Gift" size={18} className="text-yellow-300 group-hover:scale-110 transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Master Gift
                    {masterGifts && masterGifts.length > 0 && (
                        <span className="flex items-center justify-center bg-yellow-400 text-yellow-900 text-[9px] px-1.5 py-0.5 rounded-full font-black shadow-md border border-yellow-300">
                            {masterGifts.length}
                        </span>
                    )}
                </span>
            </button>
            <a id="join-community-btn" href={DISCORD_LINK} target="_blank" rel="noreferrer" className="relative z-[100] cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Discord" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" />
                <span className="relative z-10">Join Community</span>
            </a>
            <a id="channel-btn" href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="relative z-[100] cursor-pointer flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-[#229ED9] hover:bg-[#1D85B8] text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Icon name="Telegram" size={18} className="group-hover:scale-110 transition-transform shrink-0 relative z-10" />
                <span className="relative z-10 flex items-center gap-2">
                   Channel
                   <span className="flex h-2 w-2 relative">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" style={{ animation: 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></span>
                   </span>
               </span>
            </a>
            <button 
                onClick={(e) => { e.preventDefault(); setShowDonateModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:shadow-pink-500/20 active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="Heart" size={18} className="text-white group-hover:scale-110 group-hover:animate-pulse transition-transform shrink-0 relative z-10" /> 
                <span className="relative z-10 flex items-center gap-1.5">
                    Support Us
                </span>
            </button>
          </div>
        </header>

        <div className="mb-12 lg:mb-16">
          <NetworkDiagnostic onStatusChange={setNetworkStatus} />
        </div>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow-lg shadow-primary-500/20 text-white">
                    <Icon name="Rocket" size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                    Upcoming Games <span className="text-primary-500">2026+</span>
                </h2>
             </div>
             
             <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar relative z-[90]">
                {['PlayStation 5', 'Xbox S/X', 'Steam'].map((p) => (
                    <button
                        key={p}
                        type="button"
                        id={"btn-platform-" + p.replace(/\s+/g, '-').toLowerCase()}
                        onClick={(e) => { e.preventDefault(); setUpcomingPlatform(p); }}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap cursor-pointer z-[100] ${
                            upcomingPlatform === p 
                            ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }`}
                    >
                        {p}
                    </button>
                ))}
             </div>
          </div>
          
          <div className="relative">
             <GameCarousel 
                games={filteredUpcoming} 
                loading={loading}
                errorState={{ missing: isUpcomingMissing, script: scriptError }}
             />
          </div>
        </section>

        <div className="mb-10 w-full flex justify-center">
            <AdBanner 
                desktopSrc={AD_CONFIG.banner1.desktop} 
                mobileSrc={AD_CONFIG.banner1.mobile} 
                link={AD_CONFIG.banner1.link} 
            />
        </div>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg shadow-lg shadow-emerald-500/20 text-white">
                    <Icon name="Sparkles" size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                    Recent <span className="text-emerald-500">Products</span>
                </h2>
             </div>
          </div>
          
          <div className="relative">
             <RecentProductsCarousel 
                items={recentProducts} 
                loading={loading}
                onSelect={setSelectedResource}
                stash={stash}
                toggleStash={toggleStash}
             />
          </div>
          <div className="mt-10 w-full flex justify-center">
             <AdBanner 
                 desktopSrc={AD_CONFIG.banner2.desktop} 
                 mobileSrc={AD_CONFIG.banner2.mobile} 
                 link={AD_CONFIG.banner2.link} 
             />
          </div>
        </section>

        <section className="mb-16">
           <UpcomingListsDisplay lists={upcomingLists} />
        </section>

        <div className="sticky top-20 z-40 mb-10">
           <div className="bg-white/80 dark:bg-slate-900/80 md:backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-2xl transition-all">
              <div className="flex flex-col gap-3 items-stretch justify-between">
                  <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between w-full min-w-0">
                      <div className="flex overflow-x-auto no-scrollbar p-1 bg-slate-100 dark:bg-slate-950 rounded-xl flex-1 gap-1">
                        {(['game', 'hypervisor', 'steamtools', 'architect', 'extra', 'stash'] as const).map(tab => (
                          <button 
                              key={tab}
                              onClick={() => setActiveTab(tab as any)}
                              className={`shrink-0 relative px-4 py-2.5 sm:px-6 md:px-8 sm:py-3 rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all z-10 flex items-center justify-center ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                          >
                            {activeTab === tab && (
                              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                            )}
                            <span className="relative z-10 flex items-center gap-1.5">
                              {tab === 'hypervisor' ? (
                                <>
                                  GAME
                                  <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black tracking-widest shadow-sm">
                                    HYPERVISOR
                                  </span>
                                </>
                              ) : tab === 'architect' ? (
                                'TOOLS'
                              ) : tab === 'extra' ? (
                                'SAVEGAME'
                              ) : tab === 'stash' ? (
                                <>
                                  <Icon name="Bookmark" size={14} className={activeTab === 'stash' ? 'text-primary-500' : ''} />
                                  MY STASH
                                </>
                              ) : tab}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar min-w-0">
                          <button 
                            onClick={() => setShowIntelPanel(true)}
                            className="relative flex items-center justify-center p-3 sm:p-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all shrink-0"
                            title="Latest Intel (Live Changelog)"
                          >
                            <Icon name="Radar" size={20} className="animate-pulse text-primary-500" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-200 dark:border-slate-800"></div>
                          </button>

                          <button 
                            onClick={() => setShowGlobalFilter(!showGlobalFilter)}
                            className={`flex items-center justify-center p-3 sm:p-3.5 rounded-xl transition-all shrink-0 border ${globalSpecs.isActive ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent'}`}
                            title="Global System Filter"
                          >
                            <Icon name="Cpu" size={20} />
                          </button>

                          <button 
                            onClick={() => fetchData()}
                            className="flex items-center justify-center p-3 sm:p-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all shrink-0"
                            title="Reload Data"
                          >
                            <Icon name="RefreshCw" size={20} className={loading ? "animate-spin" : ""} />
                          </button>

                          <button 
                            onClick={() => {
                                setRequestModalInitialTitle(searchQuery);
                                setShowRequestModal(true);
                            }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all shrink-0 whitespace-nowrap"
                            title="Request a game or tool not listed here"
                          >
                            <Icon name="Plus" size={20} />
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                <span className="inline sm:hidden">Request</span>
                                <span className="hidden sm:inline">Request Item</span>
                            </span>
                          </button>
                      </div>
                  </div>

                  <div className="relative w-full group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <Icon name="Search" size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      placeholder={`SEARCH ${activeTab.toUpperCase()}...`} 
                      className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all truncate"
                    />
                  </div>
              </div>

              {/* Global Filter Panel */}
              <AnimatePresence>
                {showGlobalFilter && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 sm:p-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                          <Icon name="Cpu" size={18} className="text-primary-500" />
                          Global "Can I Run It?" Filter
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
                          <span className="text-xs font-bold text-slate-500 uppercase">Enable Filter</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" checked={globalSpecs.isActive} onChange={(e) => setGlobalSpecs({...globalSpecs, isActive: e.target.checked})} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${globalSpecs.isActive ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${globalSpecs.isActive ? 'translate-x-4' : ''}`}></div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">OS</label>
                          <select 
                            value={globalSpecs.os}
                            onChange={(e) => setGlobalSpecs({...globalSpecs, os: e.target.value})}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                          >
                            <option value="7">Windows 7</option>
                            <option value="8">Windows 8</option>
                            <option value="10">Windows 10</option>
                            <option value="11">Windows 11</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">RAM (GB)</label>
                          <select 
                            value={globalSpecs.ram}
                            onChange={(e) => setGlobalSpecs({...globalSpecs, ram: parseInt(e.target.value)})}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                          >
                            <option value="4">4 GB</option>
                            <option value="8">8 GB</option>
                            <option value="16">16 GB</option>
                            <option value="32">32 GB</option>
                            <option value="64">64+ GB</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">CPU</label>
                          <select 
                            value={globalSpecs.cpuTier}
                            onChange={(e) => setGlobalSpecs({...globalSpecs, cpuTier: parseInt(e.target.value)})}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                          >
                            <option value="1">Basic Dual Core (Older Intel/AMD)</option>
                            <option value="2">Standard Quad Core (i3 / Ryzen 3)</option>
                            <option value="3">Solid 6-Core (i5 / Ryzen 5)</option>
                            <option value="4">High-End 8+ Core (i7 / Ryzen 7)</option>
                  <option value="5">Enthusiast (i9 / Ryzen 9)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">GPU</label>
                          <select 
                            value={globalSpecs.gpuTier}
                            onChange={(e) => setGlobalSpecs({...globalSpecs, gpuTier: parseInt(e.target.value)})}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                          >
                            <option value="1">Integrated (Intel HD / AMD APU)</option>
                            <option value="2">Entry Level (GTX 1050 / RX 560)</option>
                            <option value="3">Mid Range (RTX 3060 / RX 6600)</option>
                            <option value="4">High End (RTX 4070 / RX 7800)</option>
                            <option value="5">Ultra (RTX 4080 / RX 7900 XTX)</option>
                  <option value="6">Enthusiast / Next-Gen (RTX 5090 / 4090)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        <div className="min-h-[50vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
               <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin mb-6"></div>
               <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Decrypting Data Stream...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
               <div className="p-6 bg-white dark:bg-slate-900 rounded-full mb-6 shadow-sm">
                 <Icon name="Database" size={40} className="opacity-20" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-1">No Data Found</h3>
               <p className="text-slate-500 text-xs mb-6">Try adjusting your search or category.</p>
               <button 
                 onClick={() => {
                    setRequestModalInitialTitle(searchQuery);
                    setShowRequestModal(true);
                 }}
                 className="px-6 py-2.5 bg-blue-600 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
               >
                 Request This Item
               </button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedData.map((item, idx) => {
                      const compStatus = globalSpecs.isActive ? checkCompatibilityStatus(globalSpecs, item.systemReqs) : null;
                      const isFail = compStatus === 'fail';
                      const resolvedDev = getResolvedDeveloper(item);
                      
                      return (
                      <motion.div 
                          layout
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          className={`group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary-900/10 hover:border-primary-500/30 transition-all relative flex flex-col ${isFail ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
                          onClick={() => {
                              if (item.category === 'profil') {
                                  handleCompanyClick(resolvedDev || item.name);
                              } else {
                                  setSelectedResource(item);
                              }
                          }}
                      >
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-40 pointer-events-none"></div>
                          <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100"  loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90"></div>
                            
                            {compStatus && compStatus !== 'unknown' && (
                                <div className="absolute top-3 right-3 z-30">
                                    <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 border ${
                                        compStatus === 'pass' ? 'bg-emerald-500/90 text-white border-emerald-400' : 
                                        compStatus === 'warn' ? 'bg-yellow-500/90 text-white border-yellow-400' : 
                                        'bg-red-500/90 text-white border-red-400'
                                    }`}>
                                        <Icon name={compStatus === 'pass' ? 'CheckCircle' : compStatus === 'warn' ? 'AlertTriangle' : 'X'} size={12} />
                                        {compStatus === 'pass' ? 'Runs Great' : compStatus === 'warn' ? 'Might Struggle' : 'Won\'t Run'}
                                    </div>
                                </div>
                            )}

                            {item.isPinned && !compStatus && (
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="bg-yellow-500 text-white p-1.5 rounded-lg shadow-lg border border-white/20">
                                        <Icon name="Pin" size={16} />
                                    </div>
                                </div>
                            )}
                            {item.category === 'steamtools' ? (
                                <>
                                    {item.gameId && (
                                        <div className={`absolute top-3 ${compStatus ? 'left-3' : 'right-3'} px-2 py-1 bg-black/60 md:backdrop-blur-md rounded-md border border-white/10 text-[10px] font-mono font-bold text-white shadow-sm`}>
                                            ID: {item.gameId}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={`absolute top-3 ${compStatus ? 'left-3' : 'right-3'} px-2 py-1 bg-white/90 dark:bg-black/60 md:backdrop-blur-md rounded-md border border-slate-200 dark:border-white/10 text-[10px] font-mono font-bold text-primary-600 dark:text-primary-400`}>
                                    {item.repackSize}
                                </div>
                            )}
                            <div className={`absolute top-3 ${item.isPinned && !compStatus ? 'left-12' : 'left-3'} px-2 py-1 bg-primary-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg transition-all`}>
                              {item.id}
                            </div>
                            {item.category === 'hypervisor' && (
                                <div className={`absolute top-10 ${compStatus ? 'left-3' : 'right-3'} z-20`}>
                                    <div className="bg-red-600 text-white px-2 py-1 rounded-lg shadow-lg border border-red-400/30 text-[10px] font-black tracking-widest">
                                        HV
                                    </div>
                                </div>
                            )}
                            {item.isFree && (
                                <div className={`absolute ${item.category === 'hypervisor' ? 'top-20' : 'top-10'} ${compStatus ? 'left-3' : 'right-3'} px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 z-20`}>
                                    <Icon name="Tag" size={12} /> Free
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                               <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                  <Icon name="ArrowRight" size={24} />
                               </div>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                {resolvedDev && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCompanyClick(resolvedDev);
                                        }}
                                        className="mb-2 flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 md:backdrop-blur-sm text-violet-300 border border-violet-500/30 hover:bg-violet-900/60 transition-colors w-max"
                                    >
                                        <Icon name="Briefcase" size={10} />
                                        {resolvedDev}
                                    </button>
                                )}
                                <h3 className="font-black text-lg text-white leading-tight uppercase italic mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors drop-shadow-md">
                                  {item.name}
                                </h3>
                                <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-1">
                                  <span className="text-[10px] text-slate-200 font-mono font-bold bg-black/40 md:backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                                    {item.category === 'steamtools' ? item.category.toUpperCase() : item.version}
                                  </span>
                                  <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1 text-[10px] text-slate-200 font-mono font-bold bg-black/40 md:backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                                          <Icon name="Download" size={10} /> {getFakeDownloads(item.id)}
                                      </div>
                                      <button
                                          onClick={(e) => toggleStash(item.id, e)}
                                          className={`p-1.5 rounded-md md:backdrop-blur-md transition-all ${
                                              stash.includes(item.id) 
                                              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                                              : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10'
                                          }`}
                                          title={stash.includes(item.id) ? "Remove from Stash" : "Add to Stash"}
                                      >
                                          <Icon name="Bookmark" size={12} className={stash.includes(item.id) ? "fill-current" : ""} />
                                      </button>
                                      <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1 drop-shadow-sm">
                                         Details <Icon name="ChevronRight" size={12} />
                                      </span>
                                  </div>
                                </div>
                            </div>
                          </div>
                      </motion.div>
                      );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 py-10 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 sm:gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-full overflow-x-auto no-scrollbar">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                    >
                      <Icon name="ChevronLeft" size={20} />
                    </button>
                    
                    <div className="flex gap-1 sm:gap-2">
                      {(() => {
                          let pages = [];
                          if (totalPages <= 5) {
                             pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                          } else {
                             if (currentPage <= 3) pages = [1, 2, 3, '...', totalPages];
                             else if (currentPage >= totalPages - 2) pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
                             else pages = [1, '...', currentPage, '...', totalPages];
                          }
                          
                          return pages.map((page, idx) => (
                            typeof page === 'number' ? (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentPage(page)}
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-[10px] sm:text-xs transition-all shrink-0 ${currentPage === page ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                  {page}
                                </button>
                            ) : (
                                <span key={idx} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 text-xs font-bold select-none shrink-0">...</span>
                            )
                          ));
                      })()}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                    >
                      <Icon name="ChevronRight" size={20} />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Sector {currentPage} / {totalPages}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {['game', 'hypervisor', 'steamtools'].includes(activeTab) && (
            <MostPopularRepacksSection 
                gameIds={popularRepackIds}
                allResources={allResources}
                onSelect={setSelectedResource}
            />
        )}
        <div className="mt-8 mb-4 w-full flex justify-center">
            <AdBanner 
                desktopSrc={AD_CONFIG.banner3.desktop} 
                mobileSrc={AD_CONFIG.banner3.mobile} 
                link={AD_CONFIG.banner3.link} 
            />
        </div>

        {['game', 'hypervisor', 'steamtools'].includes(activeTab) && (
            <>
                <BestStudiosCarousel 
                    profiles={companyProfiles}
                    onSelect={setSelectedCompanyProfile}
                    onSeeAll={() => setShowAllProfiles(true)}
                    categoryType="games"
                />
                <div className="mt-8 mb-10 w-full flex justify-center">
                    <AdBanner 
                        desktopSrc={AD_CONFIG.banner4.desktop} 
                        mobileSrc={AD_CONFIG.banner4.mobile} 
                        link={AD_CONFIG.banner4.link} 
                    />
                </div>
                <TopGamesSection games={topGames} />
                <div className="mt-8 mb-2 w-full flex justify-center">
                    <AdBanner 
                        desktopSrc={AD_CONFIG.banner5.desktop} 
                        mobileSrc={AD_CONFIG.banner5.mobile} 
                        link={AD_CONFIG.banner5.link} 
                    />
                </div>
            </>
        )}
        {['architect', 'extra'].includes(activeTab) && (
            <>
                <BestStudiosCarousel 
                    profiles={companyProfiles}
                    onSelect={setSelectedCompanyProfile}
                    onSeeAll={() => setShowAllProfiles(true)}
                    categoryType="tools"
                />
                <div className="mt-8 mb-2 w-full flex justify-center">
                    <AdBanner 
                        desktopSrc={AD_CONFIG.banner4.desktop} 
                        mobileSrc={AD_CONFIG.banner4.mobile} 
                        link={AD_CONFIG.banner4.link} 
                    />
                </div>
            </>
        )}

      </div>
      <Footer onSupportClick={() => setShowDonateModal(true)} />
      </motion.div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-[85px] md:bottom-10 left-6 sm:left-10 z-[90] w-12 h-12 rounded-full bg-slate-900/50 dark:bg-slate-100/10 backdrop-blur-md border border-white/20 hover:bg-slate-900/70 dark:hover:bg-slate-100/20 text-white flex items-center justify-center shadow-xl transition-all hover:-translate-y-1"
          >
            <Icon name="ArrowUp" size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AllProfilesModal 
          isOpen={showAllProfiles}
          profiles={companyProfiles}
          onClose={() => setShowAllProfiles(false)}
          onSelect={(profile) => {
              setShowAllProfiles(false);
              setSelectedCompanyProfile(profile);
          }}
          categoryType={['game', 'hypervisor', 'steamtools'].includes(activeTab) ? 'games' : 'tools'}
      />
    </div>
  );
};

const AllProfilesModal: React.FC<{
    isOpen?: boolean,
    profiles: CompanyProfile[],
    onClose: () => void,
    onSelect: (profile: CompanyProfile) => void,
    categoryType: 'games' | 'tools'
}> = ({ isOpen = true, profiles, onClose, onSelect, categoryType }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PROFILES_PER_PAGE = 30;

    const filteredProfiles = useMemo(() => {
        return profiles
            .map(p => {
                let count = 0;
                if (categoryType === 'games') {
                    count = (p.gameIds?.length || 0) + (p.hypervisorIds?.length || 0) + (p.steamtoolsIds?.length || 0);
                } else {
                    count = (p.architectIds?.length || 0) + (p.extraIds?.length || 0);
                }
                return {
                    ...p,
                    totalGames: count
                };
            })
            .filter(p => p.totalGames > 0 && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => b.totalGames - a.totalGames);
    }, [profiles, categoryType, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE);
    
    const paginatedProfiles = useMemo(() => {
        const start = (currentPage - 1) * PROFILES_PER_PAGE;
        return filteredProfiles.slice(start, start + PROFILES_PER_PAGE);
    }, [filteredProfiles, currentPage]);

    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-0"
                onClick={onClose}
            >

            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-slate-50 dark:bg-slate-950 w-full h-full max-w-none max-h-none rounded-none overflow-hidden shadow-2xl border-none flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-4 sm:p-6 border-b border-blue-200 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                    <div className="relative z-10 flex items-center gap-3">
                        <Icon name="Briefcase" size={28} className="text-blue-500 dark:text-blue-400 sm:w-8 sm:h-8" /> 
                        <div>
                            <h3 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                {categoryType === 'games' ? 'All Studios' : 'All Companies'}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-200 text-[10px] sm:text-sm font-bold mt-1">
                                {filteredProfiles.length} Total Found
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                              <Icon name="Search" size={16} />
                            </div>
                            <input 
                              type="text" 
                              value={searchQuery} 
                              onChange={e => setSearchQuery(e.target.value)} 
                              placeholder="SEARCH PROFILES..." 
                              className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-black/40 border border-slate-300 dark:border-slate-700/50 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider placeholder:text-slate-500 transition-all"
                            />
                        </div>
                        <button onClick={onClose} className="p-2.5 bg-white/60 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 rounded-xl transition-colors text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 shadow">
                            <Icon name="X" size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-950/50">
                    {paginatedProfiles.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {paginatedProfiles.map((profile) => (
                                <div 
                                    key={profile.id}
                                    onClick={() => onSelect(profile as CompanyProfile)}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all h-full group/studio"
                                >
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800 group-hover/studio:border-blue-500/30 group-hover/studio:bg-blue-50 dark:group-hover/studio:bg-blue-900/20 overflow-hidden shrink-0 transition-all shadow-inner">
                                        {profile.logoUrl ? (
                                            <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-contain filter group-hover/studio:brightness-110 transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="font-black text-lg sm:text-xl text-slate-400 dark:text-slate-500 group-hover/studio:text-blue-500 dark:group-hover/studio:text-blue-400 transition-colors">' + profile.name.substring(0, 2).toUpperCase() + '</span>'; }} />
                                        ) : (
                                            <span className="font-black text-lg sm:text-xl text-slate-400 dark:text-slate-500 group-hover/studio:text-blue-500 dark:group-hover/studio:text-blue-400 transition-colors">{profile.name.substring(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="text-center w-full">
                                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover/studio:text-blue-500 dark:group-hover/studio:text-blue-400 transition-colors" title={profile.name}>{profile.name}</h3>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded border border-blue-200 dark:border-blue-500/30 group-hover/studio:shadow-sm">
                                            {profile.totalGames} {profile.totalGames === 1 ? 'Item' : 'Items'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <Icon name="SearchX" size={48} className="text-slate-400 dark:text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Profiles Found</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
                
                {totalPages > 1 && (
                    <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center shrink-0">
                        <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <Icon name="ChevronLeft" size={16} />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                                        currentPage === page 
                                        ? 'bg-blue-600 text-white shadow shadow-blue-500/20' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                            >
                                <Icon name="ChevronRight" size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );
};

export default SecretArea;
