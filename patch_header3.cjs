const fs = require('fs');
let code = fs.readFileSync('components/Header.tsx', 'utf8');

const moreMenuStart = code.indexOf('const MoreMenu =');
const headerStart = code.indexOf('const Header: React.FC =');
if (moreMenuStart === -1 || headerStart === -1) {
    console.error("Could not find boundaries");
    process.exit(1);
}

const beforeMoreMenu = code.substring(0, moreMenuStart);
const afterMoreMenu = code.substring(headerStart);

const newComponents = `
const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  return (
    <button onClick={toggleTheme} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 mx-1">
      {theme === 'light' ? <TbMoon size={22} /> : <TbSun size={22} />}
    </button>
  );
};

const NotificationBell = () => (
  <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 mx-1">
    <Icon name="Bell" size={22} />
  </button>
);

const UserDropdown = ({ isUnlocked, handleLogout, t, user }: { isUnlocked: boolean, handleLogout: () => void, t: any, user: any }) => {
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

  if (!isUnlocked && !user) return null;

  const initial = user?.displayName?.[0] || user?.email?.[0] || 'A';
  const bgColor = user ? '#29b6f6' : '#64748b'; // Light blue color for the avatar

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-500 transition-all ml-1 sm:ml-2"
        style={{ backgroundColor: bgColor }}
      >
        {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : initial.toUpperCase()}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full end-0 mt-3 w-56 bg-[#111623] rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden z-50 py-2 text-[#94a3b8] font-medium text-[15px]"
          >
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">My profile</Link>
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Recently Viewed</Link>
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Liked</Link>
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Favorites</Link>
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Library</Link>
            <div className="h-px bg-slate-700/50 my-2 mx-4" />
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Billing</Link>
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Subscription</Link>
            <div className="h-px bg-slate-700/50 my-2 mx-4" />
            <Link to="#" className="block px-5 py-3 hover:bg-white/5 hover:text-white transition-colors">Settings</Link>
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-start px-5 py-3 hover:bg-white/5 hover:text-red-400 transition-colors">Logout</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
`;

code = beforeMoreMenu + newComponents + afterMoreMenu;

// Now find where actions are grouped
const flexActionsStart = code.indexOf('<div className="flex items-center gap-1 sm:gap-3 md:gap-4">');
if (flexActionsStart !== -1) {
    const flexActionsEnd = code.indexOf('</div>', flexActionsStart) + 6;
    const currentActions = code.substring(flexActionsStart, flexActionsEnd);
    const newActions = `<div className="flex items-center gap-1 sm:gap-2">
            <Flags />
            <DiscoverGameButton />
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationBell />
            <UserDropdown isUnlocked={isUnlocked} handleLogout={handleLogout} t={t} user={user} />
          </div>`;
    code = code.replace(currentActions, newActions);
}

fs.writeFileSync('components/Header.tsx', code);
