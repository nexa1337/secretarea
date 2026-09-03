const fs = require('fs');
let code = fs.readFileSync('./pages/SecretArea.tsx', 'utf8');

code = code.replace('{showScrollTop && (', '{showScrollTop && !selectedResource && !selectedCompanyProfile && !showAllProfiles && !showAllModal && !showRequestModal && !showDonateModal && !showSteamModal && !showMasterGiftModal && !showDisclaimer && !showIntelPanel && (');

fs.writeFileSync('./pages/SecretArea.tsx', code);
