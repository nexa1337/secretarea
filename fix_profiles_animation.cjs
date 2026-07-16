const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Change SecretArea conditional rendering for AllProfilesModal
const sectionTarget = `      <AnimatePresence>
          {showAllProfiles && (
              <AllProfilesModal 
                  profiles={companyProfiles}
                  onClose={() => setShowAllProfiles(false)}
                  onSelect={(profile) => {
                      setShowAllProfiles(false);
                      handleCompanyClick(profile.name);
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
              handleCompanyClick(profile.name);
          }}
          categoryType={['game', 'hypervisor', 'steamtools'].includes(activeTab) ? 'games' : 'tools'}
      />`;

if (code.includes(sectionTarget)) {
    code = code.replace(sectionTarget, sectionReplacement);
    console.log("Fixed AllProfilesModal conditional render");
} else {
    console.log("Could not find AllProfilesModal conditional render");
}

// 2. Change AllProfilesModal definition
const modalDefTarget = `const AllProfilesModal: React.FC<{
    profiles: CompanyProfile[],
    onClose: () => void,
    onSelect: (profile: CompanyProfile) => void,
    categoryType: 'games' | 'tools'
}> = ({ profiles, onClose, onSelect, categoryType }) => {`;

const modalDefReplacement = `const AllProfilesModal: React.FC<{
    isOpen: boolean,
    profiles: CompanyProfile[],
    onClose: () => void,
    onSelect: (profile: CompanyProfile) => void,
    categoryType: 'games' | 'tools'
}> = ({ isOpen, profiles, onClose, onSelect, categoryType }) => {`;

if (code.includes(modalDefTarget)) {
    code = code.replace(modalDefTarget, modalDefReplacement);
    console.log("Fixed AllProfilesModal definition");
} else {
    console.log("Could not find AllProfilesModal definition");
}

// 3. Wrap Modal return with AnimatePresence
const modalReturnTarget = `    return createPortal(
        <motion.div `;

const modalReturnReplacement = `    return createPortal(
        <AnimatePresence>
        {isOpen && (
            <motion.div `;

// Wait, since MostPopularRepacksModal is also using createPortal(<motion.div, we have to make sure we replace the correct one. Let's be more specific.
