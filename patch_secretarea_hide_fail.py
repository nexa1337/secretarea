import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

# Introduce hideFailed filter logic
state_add = """  const [hideFailedGames, setHideFailedGames] = useState(false);"""
content = re.sub(r"(const \[showGlobalFilter, setShowGlobalFilter\] = useState\(false\);)", r"\1\n" + state_add, content)

# Add checkbox inside Global System Filter UI
checkbox_add = """
                        <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto ml-0 sm:ml-4 border-l-0 sm:border-l border-slate-200 dark:border-slate-800 pl-0 sm:pl-4 mt-2 sm:mt-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase">{t('Hide Incompatible')}</span>
                          <div className="relative">
                            <input type="checkbox" className="sr-only" checked={hideFailedGames} onChange={(e) => setHideFailedGames(e.target.checked)} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${hideFailedGames ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                            <div className={`dot absolute start-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${hideFailedGames ? 'translate-x-4 rtl:-translate-x-4' : ''}`}></div>
                          </div>
                        </label>
"""
content = content.replace("                          </div>\n                        </label>\n                      </div>", "                          </div>\n                        </label>\n" + checkbox_add + "                      </div>")

# Modify filter logic
filter_patch = """
        let status = null;
        if (globalSpecs.isActive && hideFailedGames) {
           status = checkCompatibilityStatus({...globalSpecs, cpuTier: getCpuTier(globalSpecs.cpuModel), gpuTier: getGpuTier(globalSpecs.gpuModel)}, r.systemReqs);
        }
        
        return matchesSearch && matchesFilter && (status !== 'fail');
"""

content = re.sub(r"return matchesSearch && matchesFilter;", filter_patch, content)


with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
