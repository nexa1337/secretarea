const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Download Full Version link
const targetDownload = `                                onClick={(e) => {
                                    if (['game', 'hypervisor'].includes(item.category?.toLowerCase())) {
                                        e.preventDefault();
                                        setShowQBitWarning(true);
                                    }
                                }}`;

const replacementDownload = `                                onClick={(e) => {
                                    if (isGuestMode) {
                                        e.preventDefault();
                                        showGuestNotification();
                                        return;
                                    }
                                    if (['game', 'hypervisor'].includes(item.category?.toLowerCase())) {
                                        e.preventDefault();
                                        setShowQBitWarning(true);
                                    }
                                }}`;
code = code.replace(targetDownload, replacementDownload);

// 2. Telegram link inside ResourceModal
const targetTelegram = `                            <a 
                                href={TELEGRAM_LINK} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="col-span-1 md:col-span-2 group relative overflow-hidden bg-gradient-to-r from-[#229ED9] to-[#1D85B8] p-3 sm:p-5 rounded-xl shadow-lg shadow-[#229ED9]/20 hover:shadow-[#229ED9]/40 transition-all hover:-translate-y-1 active:scale-95"
                            >`;
const replacementTelegram = `                            <a 
                                href={TELEGRAM_LINK} 
                                target="_blank" 
                                rel="noreferrer" 
                                onClick={(e) => {
                                    if (isGuestMode) {
                                        e.preventDefault();
                                        showGuestNotification();
                                    }
                                }}
                                className="col-span-1 md:col-span-2 group relative overflow-hidden bg-gradient-to-r from-[#229ED9] to-[#1D85B8] p-3 sm:p-5 rounded-xl shadow-lg shadow-[#229ED9]/20 hover:shadow-[#229ED9]/40 transition-all hover:-translate-y-1 active:scale-95"
                            >`;
code = code.replace(targetTelegram, replacementTelegram);

// 3. Free Accounts Button
const targetFreeAccounts = `            <button 
                id="btn-free-accounts"
                type="button"
                onClick={(e) => { e.preventDefault(); setShowSteamModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >`;
const replacementFreeAccounts = `            <button 
                id="btn-free-accounts"
                type="button"
                onClick={(e) => { 
                    e.preventDefault(); 
                    if (isGuestMode) { showGuestNotification(); return; }
                    setShowSteamModal(true); 
                }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >`;
code = code.replace(targetFreeAccounts, replacementFreeAccounts);

// 4. Master Gift Button
const targetMasterGift = `            <button 
                id="btn-master-gift"
                type="button"
                onClick={(e) => { e.preventDefault(); setShowMasterGiftModal(true); }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >`;
const replacementMasterGift = `            <button 
                id="btn-master-gift"
                type="button"
                onClick={(e) => { 
                    e.preventDefault(); 
                    if (isGuestMode) { showGuestNotification(); return; }
                    setShowMasterGiftModal(true); 
                }}
                className="relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95 group text-center whitespace-nowrap overflow-hidden z-[100] cursor-pointer"
            >`;
code = code.replace(targetMasterGift, replacementMasterGift);

fs.writeFileSync('pages/SecretArea.tsx', code);
