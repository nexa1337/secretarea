const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
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
          </div>`;

const replacement = `<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
            {currentItems.map(item => (
               <div 
                  key={item.id} 
                  onClick={() => onItemClick(item)}
                  className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-sm hover:shadow-xl relative aspect-[9/16]"
               >
                  <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover"  loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 inset-x-2 flex justify-between items-start">
                     <div className="flex items-center gap-1">
                         {item.category === 'hypervisor' && (
                             <div className="bg-red-600 text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-md">
                                 HV
                             </div>
                         )}
                         {item.category === 'steamtools' && (
                             <div className="bg-[#171a21] text-[#66c0f4] p-1 rounded shadow-md border border-[#2a475e]">
                                 <Icon name="BrandSteam" size={14} />
                             </div>
                         )}
                         {item.category === 'game' && (
                             <div className="bg-white p-0.5 rounded shadow-md w-6 h-6 flex items-center justify-center overflow-hidden">
                                 <img src="https://fitgirl-repacks.site/wp-content/uploads/2016/08/icon.jpg" alt="FitGirl" className="w-full h-full object-cover rounded-sm" />
                             </div>
                         )}
                         {/* Fallback if category is missing or different */}
                         {!['hypervisor', 'steamtools', 'game'].includes(item.category) && (
                             <div className="bg-primary-600 text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-md">
                                 {(item.category || '').toUpperCase()}
                             </div>
                         )}
                     </div>
                     {item.version && (
                         <div className="bg-slate-900/80 md:backdrop-blur-sm text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold shadow-md truncate ml-2">
                             {item.version}
                         </div>
                     )}
                  </div>
               </div>
            ))}
          </div>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Fixed CompanyProfileModal items grid");
} else {
    console.log("Could not find CompanyProfileModal items grid");
}
