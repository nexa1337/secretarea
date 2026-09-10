import re

with open('components/Header.tsx', 'r') as f:
    content = f.read()

replacement = """const NotificationBell = () => {
  const [hasNew, setHasNew] = useState(false);
  
  useEffect(() => {
    const handleIntelUpdate = (e: any) => {
      const latestTimestamp = e.detail;
      const lastSeen = localStorage.getItem('last_seen_intel');
      if (latestTimestamp && latestTimestamp !== lastSeen) {
        setHasNew(true);
      }
    };
    
    const handleIntelOpened = () => {
      setHasNew(false);
    };

    window.addEventListener('intel-updated', handleIntelUpdate);
    window.addEventListener('intel-opened', handleIntelOpened);
    
    return () => {
      window.removeEventListener('intel-updated', handleIntelUpdate);
      window.removeEventListener('intel-opened', handleIntelOpened);
    };
  }, []);

  return (
    <button 
      onClick={() => window.dispatchEvent(new Event('open-intel-panel'))} 
      className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 ml-1 mr-0 sm:ml-2 sm:mr-1"
    >
      <Icon name="Bell" size={22} className={hasNew ? "animate-pulse" : ""} />
      {hasNew && (
        <span className="absolute top-1 right-1.5 sm:top-2 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
      )}
    </button>
  );
};"""

content = re.sub(r"const NotificationBell = \(\) => \([\s\S]*?<\/button>\s*\);", replacement, content)

with open('components/Header.tsx', 'w') as f:
    f.write(content)
