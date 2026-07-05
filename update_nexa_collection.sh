#!/bin/bash
cat pages/CategoryDetail.tsx | sed -n '1,419p' > pages/CategoryDetail.tsx.tmp
cat << 'INNER_EOF' >> pages/CategoryDetail.tsx.tmp
          {/* NEXA BUSINESS SERVICES COLLECTION */}
          {isBusiness && category.nexaServices && (
             <motion.section variants={item} className="relative p-4 md:p-8 rounded-[40px] overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-slate-50 dark:bg-[#030712] -z-20"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[100px] -z-10"></div>

                <div className="text-center mb-12 relative z-10">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    Solutions
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">N E X A 1337 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400">Collection</span></h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {category.nexaServices.map((service, idx) => (
                    <a 
                      key={idx} 
                      href="https://nexa1337.github.io/nexa1337"
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <motion.div 
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="group relative p-[1px] rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800"
                      >
                        {/* Animated border gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 group-hover:from-emerald-400 group-hover:to-cyan-400 dark:group-hover:from-emerald-500 dark:group-hover:to-cyan-500 transition-all duration-500 opacity-50 dark:opacity-100"></div>
                        
                        {/* Card Content */}
                        <div className="relative h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-[23px] flex flex-col justify-between overflow-hidden">
                          
                          {/* Glow effect on hover */}
                          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          <div>
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/30 dark:group-hover:border-emerald-500/50 transition-colors">
                                    <Icon name={service.category.includes('AI') ? 'Cpu' : service.category.includes('WEB') ? 'Code' : service.category.includes('BRAND') ? 'PenTool' : 'Target'} size={14} />
                                 </div>
                                 <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 tracking-wider uppercase transition-colors">{service.category}</span>
                              </div>
                              {service.discount && (
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 dark:to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)] dark:shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                  {service.discount}
                                </div>
                              )}
                            </div>
                            
                            <h4 className="font-bold text-xl md:text-2xl text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-cyan-600 dark:group-hover:from-emerald-300 dark:group-hover:to-cyan-300 transition-all duration-300">{service.title}</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                              {service.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                             <div className="flex flex-col">
                               <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">Investment</span>
                               <span className="font-bold text-slate-900 dark:text-white text-lg font-mono">
                                 {service.price}
                               </span>
                             </div>
                             
                             <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-transparent flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
                                <Icon name="ArrowRight" size={16} />
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    </a>
                  ))}
                </div>
             </motion.section>
          )}
INNER_EOF
cat pages/CategoryDetail.tsx | sed -n '489,$p' >> pages/CategoryDetail.tsx.tmp
mv pages/CategoryDetail.tsx.tmp pages/CategoryDetail.tsx
