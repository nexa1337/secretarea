const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Change SecretArea conditional rendering for AllProfilesModal
const sectionTarget = `<AnimatePresence>
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

const sectionReplacement = `<AllProfilesModal 
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
    console.log("Fixed AllProfilesModal conditional render");
} else {
    console.log("Could not find AllProfilesModal conditional render");
}

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
    console.log("Fixed AllProfilesModal return start");
} else {
    console.log("Could not find AllProfilesModal return start");
}

const modalEndTarget = `                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>,
        document.body
    );`;

const modalEndReplacement = `                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
        )}
        </AnimatePresence>,
        document.body
    );`;

// Need to be careful because MostPopularRepacksModal has exact same end target.
// So we will just replace the second occurrence if there are two, or let's use a more specific target for AllProfilesModal.
