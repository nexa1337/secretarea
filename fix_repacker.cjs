const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove showUploaderPopup from SecretArea component
content = content.replace("const [password, setPassword] = useState('');\n  const [showUploaderPopup, setShowUploaderPopup] = useState(false);", "const [password, setPassword] = useState('');");

// 2. Remove UploaderProfilePopup from SecretArea render
content = content.replace(
    `<UploaderProfilePopup isOpen={showUploaderPopup} onClose={() => setShowUploaderPopup(false)} user={currentUser} />\n      {/* Main Navigation */}`,
    `{/* Main Navigation */}`
);

// 3. Add showUploaderPopup to ResourceDetailModal
const modalStart = `}> = ({ item, onClose, isHypervisor, stash, toggleStash, onCompanyClick, onGenreClick, resolvedDev, isGuestMode, showGuestNotification, globalSpecs, initialScrollTarget, onDonateClick, allResources, onItemSelect, currentGenreContext }) => {
  const { dir, t } = useLanguage();`;

const modalStartWithState = `}> = ({ item, onClose, isHypervisor, stash, toggleStash, onCompanyClick, onGenreClick, resolvedDev, isGuestMode, showGuestNotification, globalSpecs, initialScrollTarget, onDonateClick, allResources, onItemSelect, currentGenreContext }) => {
  const { dir, t } = useLanguage();
  const [showUploaderPopup, setShowUploaderPopup] = useState(false);
  const currentUser = auth.currentUser;`;

if (content.includes(modalStart)) {
    content = content.replace(modalStart, modalStartWithState);
} else {
    console.log("Could not find modal start");
}

// 4. Add UploaderProfilePopup to ResourceDetailModal render
const modalReturnEnd = `                 </div>
             </div>
         </motion.div>
     </>
    ), document.body);
};`;

const modalReturnEndWithPopup = `                 </div>
             </div>
         </motion.div>
         <UploaderProfilePopup isOpen={showUploaderPopup} onClose={() => setShowUploaderPopup(false)} user={currentUser} />
     </>
    ), document.body);
};`;

if (content.includes(modalReturnEnd)) {
    content = content.replace(modalReturnEnd, modalReturnEndWithPopup);
} else {
    console.log("Could not find modal return end");
}

fs.writeFileSync(file, content);
console.log("Done fixing repacker");
