const fs = require('fs');
let content = fs.readFileSync('components/Footer.tsx', 'utf8');

// Add imports
content = content.replace("import { useLanguage } from '../src/contexts/LanguageContext';", "import { useLanguage } from '../src/contexts/LanguageContext';\nimport { useState } from 'react';\nimport { AnimatePresence } from 'framer-motion';\nimport DonateModal from './DonateModal';");

// Add state
content = content.replace("const Footer: React.FC = () => {\n  const { dir, t } = useLanguage();", "const Footer: React.FC = () => {\n  const { dir, t } = useLanguage();\n  const [showDonateModal, setShowDonateModal] = useState(false);");

// Replace ko-fi link with button
const oldLink = '<a href="https://ko-fi.com/mrwolfzonex" target="_blank" rel="noreferrer" className="h-10 px-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:scale-105 transition-all shadow-sm">';
const newBtn = '<button onClick={(e) => { e.preventDefault(); setShowDonateModal(true); }} className="h-10 px-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:scale-105 transition-all shadow-sm cursor-pointer z-50 relative">';
content = content.replace(oldLink, newBtn);
content = content.replace('<span className="text-sm font-bold">{t(\'Support Us\')}</span>\n              </a>\n            </div>', '<span className="text-sm font-bold">{t(\'Support Us\')}</span>\n              </button>\n            </div>');

// Add DonateModal to end of Footer
const modalContent = `
        {/* Modals */}
        <AnimatePresence>
          {showDonateModal && (
            <DonateModal open={showDonateModal} onClose={() => setShowDonateModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </footer>
`;
content = content.replace('      </div>\n    </footer>', modalContent);

fs.writeFileSync('components/Footer.tsx', content);
