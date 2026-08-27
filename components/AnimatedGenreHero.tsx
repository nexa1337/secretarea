import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../src/contexts/LanguageContext';
import Icon from './Icon';

interface ResourceItem {
  id: string;
  name: string;
  coverImage: string;
}

interface AnimatedGenreHeroProps {
  onBack: () => void;
  genre: string;
  games: ResourceItem[];
}

const AnimatedGenreHero: React.FC<AnimatedGenreHeroProps> = ({ genre, games, onBack }) => {
  const { t } = useLanguage();
  const animationGames = useMemo(() => {
    let shuffled = [...games].sort(() => 0.5 - Math.random());
    // Limit to max 60 games for performance, but if fewer, tile them up so columns aren't empty
    if (shuffled.length > 150) {
      shuffled = shuffled.slice(0, 150);
    } else if (shuffled.length > 1) {
      let tiled = [...shuffled];
      while(tiled.length < 30) {
        tiled = [...tiled, ...shuffled];
      }
      shuffled = tiled;
    }
    return shuffled;
  }, [games]);

  if (games.length === 0) return null;

  // Smart UI for single game
  if (games.length === 1) {
    const singleGame = games[0];
    return (
      <div className="w-full bg-transparent flex flex-col lg:flex-row items-center relative mb-12 min-h-[400px] sm:min-h-[500px] pt-16 sm:pt-20 lg:px-8">
          <div className="w-full lg:w-3/5 xl:w-1/2 px-6 sm:px-8 md:px-12 lg:px-16 pt-0 pb-6 sm:pb-8 z-10 flex flex-col justify-center min-h-[400px] sm:min-h-[500px] relative pointer-events-none before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-slate-50/90 before:via-slate-50/70 before:to-transparent dark:before:from-slate-950/90 dark:before:via-slate-950/70 dark:before:to-transparent before:-z-10">
              <div className="pointer-events-auto w-fit mb-8">
                  <button 
                      onClick={onBack}
                      className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-wider group"
                  >
                      <Icon name="ArrowLeft" size={16} className="rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" /> {t('Back to Dashboard')}
                  </button>
              </div>
              
              <div className="mb-4 relative inline-block text-start pointer-events-auto">
                  <h1 
                      className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] text-slate-900 dark:text-white drop-shadow-2xl uppercase leading-none" 
                      style={{ fontFamily: "'Permanent Marker', cursive", letterSpacing: '0.05em' }}
                  >
                      <span className="text-slate-900 dark:text-white block mb-[-0.1em]">{genre}</span>
                      <span className="text-[#38BDF8]">{t('GAMES')}</span>
                  </h1>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium mb-8 max-w-md">
                  Dive into the ultimate {genre} experience. We found this exclusive masterpiece just for you!
              </p>
          </div>
          
          <div className="w-full md:w-1/2 p-6 sm:p-8 z-10 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 dark:border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500 group">
                <img src={singleGame.coverImage} alt={singleGame.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white font-bold text-2xl drop-shadow-md">{singleGame.name}</h3>
                </div>
                <div className="absolute top-4 end-4 bg-emerald-500 text-white font-black px-3 py-1 rounded-full text-xs uppercase tracking-widest shadow-lg">
                  Featured
                </div>
            </div>
          </div>
      </div>
    );
  }

  // Split into 3 columns
  const colSize = Math.ceil(animationGames.length / 3);
  const col1 = animationGames.slice(0, colSize);
  const col2 = animationGames.slice(colSize, colSize * 2);
  const col3 = animationGames.slice(colSize * 2);

  // Duplicate for smooth infinite scroll
  const col1Dup = [...col1, ...col1];
  const col2Dup = [...col2, ...col2];
  const col3Dup = [...col3, ...col3];

  return (
    <div className="w-full bg-transparent flex flex-col md:flex-row items-center relative mb-12 min-h-[500px] -mt-16 pt-24 lg:px-8">
        {/* Left Side Content */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-16 z-10 flex flex-col justify-center min-h-[500px] relative pointer-events-none">
            <div className="pointer-events-auto w-fit mb-8">
                <button 
                    onClick={onBack}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 font-bold text-sm uppercase tracking-wider group"
                >
                    <Icon name="ArrowLeft" size={16} className="rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" /> {t('Back to Dashboard')}
                </button>
            </div>
            
            <div className="mb-4 relative inline-block text-start pointer-events-auto">
                <h1 
                    className="text-6xl md:text-8xl lg:text-[8rem] text-slate-900 dark:text-white drop-shadow-2xl uppercase leading-none" 
                    style={{ fontFamily: "'Permanent Marker', cursive", letterSpacing: '0.05em' }}
                >
                    <span className="text-slate-900 dark:text-white block mb-[-0.1em]">{genre}</span>
                    <span className="text-[#38BDF8]">{t('GAMES')}</span>
                </h1>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium mb-8 max-w-md">
                {t('Dive into the best')} {genre} {t('games available. Explore, download, and enjoy hand-picked titles!')}
            </p>
            
            
            
            <div className="flex flex-col xl:flex-row xl:items-end gap-12 xl:gap-24 w-full pointer-events-auto mt-4">
                <div className="flex items-center gap-8">
                    <div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white">{games.length}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">{t('Total Games')}</div>
                    </div>
                    <div className="w-px h-10 bg-slate-300 dark:bg-slate-800"></div>
                    <div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center"><Icon name="Zap" size={24} className="text-emerald-500 me-1" /></div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">{t('Pre-installed')}</div>
                    </div>
                </div>

                <div className="flex flex-col items-center text-slate-500 dark:text-slate-400 pb-2 xl:mx-auto">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3">{t('Scroll For Updates')}</span>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-5 h-8 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center p-1">
                            <motion.div 
                                className="w-1 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
                                animate={{ 
                                    y: [0, 8, 0],
                                    opacity: [1, 0, 1]
                                }}
                                transition={{ 
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Icon name="ArrowDown" size={14} />
                        </motion.div>
                    </div>
                </div>
            </div>


        </div>

        {/* Right Side Animation */}
        {/* Calculate duration: let's say 2.5 seconds per item in one column copy */}
        <div 
            className="flex w-full lg:w-1/2 absolute -top-[10vh] -bottom-[10vh] end-0 overflow-hidden gap-3 sm:gap-4 p-2 sm:p-4 opacity-30 lg:opacity-100 mask-image-linear-gradient z-0 pointer-events-none"
            style={{ '--duration': `${col1.length * 0.8}s` } as React.CSSProperties}
        >
            <style dangerouslySetInnerHTML={{__html: `
                .mask-image-linear-gradient {
                    mask-image: linear-gradient(to right, transparent 0%, black 40%, black 100%), linear-gradient(to bottom, black 0%, black 85%, transparent);
                    mask-composite: intersect;
                    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 40%, black 100%), linear-gradient(to bottom, black 0%, black 85%, transparent);
                    -webkit-mask-composite: source-in;
                }
                @keyframes scroll-up {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes scroll-down {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0); }
                }
                .animate-scroll-up {
                    animation: scroll-up var(--duration) linear infinite;
                }
                .animate-scroll-down {
                    animation: scroll-down var(--duration) linear infinite;
                }
            `}} />
            
            {/* Column 1 (Scrolls Up) */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 animate-scroll-up">
                {col1Dup.map((game, idx) => (
                    <div key={'col1-' + idx} className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/5 shrink-0 bg-slate-800">
                        <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                ))}
            </div>

            {/* Column 2 (Scrolls Down) */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 animate-scroll-down">
                {col2Dup.map((game, idx) => (
                    <div key={'col2-' + idx} className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/5 shrink-0 bg-slate-800">
                        <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                ))}
            </div>
            
            {/* Column 3 (Scrolls Up) - visible on larger screens */}
            <div className="hidden md:flex flex-1 flex-col gap-3 sm:gap-4 animate-scroll-up" style={{ animationDelay: `-${(col1.length * 0.8) / 2}s` }}>
                {col3Dup.map((game, idx) => (
                    <div key={'col3-' + idx} className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/5 shrink-0 bg-slate-800">
                        <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AnimatedGenreHero;
