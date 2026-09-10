import re

with open('components/HardwareCompatibility.tsx', 'r') as f:
    content = f.read()

# Fix CircularProgress text color and background stroke color
content = content.replace('className="text-slate-800"', 'className="text-slate-200 dark:text-slate-800"')
content = content.replace('className="absolute text-sm font-bold text-white"', 'className="absolute text-sm font-bold text-slate-900 dark:text-white"')

# Add the "inactive" state handler
inactive_ui = """
  if (globalSpecs && !globalSpecs.isActive) {
    return (
      <Link to="/settings" className="block relative group cursor-pointer overflow-hidden rounded-xl bg-slate-50 dark:bg-[#0f151e] border border-slate-200 dark:border-slate-800/50 hover:border-primary-500/50 transition-colors p-4 flex flex-col items-center text-center gap-3">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-400 group-hover:text-primary-500 transition-colors">
          <Icon name="Cpu" size={24} />
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold">{t('Can I Run It?')}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('Click here to enable compatibility checker in your hardware settings.')}</p>
        </div>
      </Link>
    );
  }
"""

content = re.sub(r'(const HardwareCompatibility: React\.FC<.*?> = \(\{ requirements, globalSpecs \}\) => \{\n  const \{ t \} = useLanguage\(\);\n  const \[isOpen, setIsOpen\] = useState\(false\);\n  const \[parsedSpecs, setParsedSpecs\] = useState<any>\(null\);)', r'\1\n' + inactive_ui, content)


with open('components/HardwareCompatibility.tsx', 'w') as f:
    f.write(content)
