const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `  const [activeCategory, setActiveCategory] = useState<string>('all');
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
      : resources.filter(r => r.category === activeCategory);`;

const replacement1 = `  const categories = useMemo(() => Array.from(new Set(resources.map(r => r.category))), [resources]);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [imgError, setImgError] = useState(false);
  const itemsPerPage = 24;

  useEffect(() => {
    setImgError(false);
  }, [profile.logoUrl]);

  const filteredResources = resources.filter(r => r.category === activeCategory);`;

if (code.includes(target1)) {
    code = code.replace(target1, replacement1);
    console.log("Fixed state and categories logic");
} else {
    console.log("Could not find target1");
}

const target2 = `                 {cat === 'all' ? 'All Products' : (cat === 'steamtools' ? 'SteamTools' : cat)}
                 <span className={\`font-mono text-[10px] px-1.5 py-0.5 rounded \${activeCategory === cat ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}\`}>
                     {cat === 'all' ? resources.length : resources.filter(r => r.category === cat).length}
                 </span>`;

const replacement2 = `                 {cat === 'steamtools' ? 'SteamTools' : cat}
                 <span className={\`font-mono text-[10px] px-1.5 py-0.5 rounded \${activeCategory === cat ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}\`}>
                     {resources.filter(r => r.category === cat).length}
                 </span>`;

if (code.includes(target2)) {
    code = code.replace(target2, replacement2);
    console.log("Fixed categories buttons text");
} else {
    console.log("Could not find target2");
}

const target3 = `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6`;
const replacement3 = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8`;

if (code.includes(target3)) {
    code = code.replace(target3, replacement3);
    console.log("Fixed grid columns");
} else {
    console.log("Could not find target3");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
