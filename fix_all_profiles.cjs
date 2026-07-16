const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const modalReturnTarget = `    return createPortal(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-0"
            onClick={onClose}
        >`;

const modalReturnReplacement = `    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 md:backdrop-blur-md p-0"
                onClick={onClose}
            >
`;

if (code.includes(modalReturnTarget)) {
    code = code.replace(modalReturnTarget, modalReturnReplacement);
} else {
    console.log("Could not find AllProfilesModal return start");
}

const sectionTarget = `      <AnimatePresence>
          {showAllProfiles && (
              <AllProfilesModal 
                  profiles={companyProfiles}
                  onClose={() => setShowAllProfiles(false)}
                  onSelect={(profile) => {
                      setShowAllProfiles(false);
                      setSelectedCompanyProfile(profile);
                  }}
                  categoryType={['game', 'hypervisor', 'steamtools'].includes(activeTab) ? 'games' : 'tools'}
              />
          )}
      </AnimatePresence>`;

const sectionReplacement = `      <AllProfilesModal 
          isOpen={showAllProfiles}
          profiles={companyProfiles}
          onClose={() => setShowAllProfiles(false)}
          onSelect={(profile) => {
              setShowAllProfiles(false);
              setSelectedCompanyProfile(profile);
          }}
          categoryType={['game', 'hypervisor', 'steamtools'].includes(activeTab) ? 'games' : 'tools'}
      />`;

if (code.includes(sectionTarget)) {
    code = code.replace(sectionTarget, sectionReplacement);
} else {
    console.log("Could not find AllProfilesModal conditional render");
}

const modalDefTarget = `const AllProfilesModal: React.FC<{
    profiles: CompanyProfile[],
    onClose: () => void,
    onSelect: (profile: CompanyProfile) => void,
    categoryType: 'games' | 'tools'
}> = ({ profiles, onClose, onSelect, categoryType }) => {`;

const modalDefReplacement = `const AllProfilesModal: React.FC<{
    isOpen?: boolean,
    profiles: CompanyProfile[],
    onClose: () => void,
    onSelect: (profile: CompanyProfile) => void,
    categoryType: 'games' | 'tools'
}> = ({ isOpen = true, profiles, onClose, onSelect, categoryType }) => {`;

if (code.includes(modalDefTarget)) {
    code = code.replace(modalDefTarget, modalDefReplacement);
} else {
    console.log("Could not find AllProfilesModal definition");
}

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Fixed AllProfilesModal");
