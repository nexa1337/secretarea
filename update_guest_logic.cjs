const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

// 1. Add guest state
if (!code.includes("const [isGuestMode, setIsGuestMode]")) {
  code = code.replace(
    /const \[isUnlocked, setIsUnlocked\] = useState\(\(\) => localStorage.getItem\('secret_area_unlocked'\) === 'true'\);/,
    `const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true' || localStorage.getItem('nexa_guest_mode') === 'true');\n  const [isGuestMode, setIsGuestMode] = useState(() => localStorage.getItem('nexa_guest_mode') === 'true');`
  );
  console.log("Added isGuestMode state.");
}

// 2. Add showGuestNotification
if (!code.includes("const showGuestNotification")) {
  code = code.replace(
    /const toggleStash = \(id: string, e\?: React.MouseEvent\) => {/,
    `const showGuestNotification = () => {
    const notifId = Date.now();
    setNotifications(prev => [...prev, {
        id: notifId,
        title: '🔑 Access Denied - Guest Mode',
        text: 'Please login with Secret Key To get Full Access. If you don\\'t have a Secret Key, contact Admin from TikTok, Instagram, or Email.',
        time: 'Just now'
    }]);
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notifId));
    }, 8000);
  };

  const toggleStash = (id: string, e?: React.MouseEvent) => {`
  );
  console.log("Added showGuestNotification.");
}

// 3. Update Download button logic in TopCompaniesDisplay (no wait, TopCompaniesDisplay is not here? It's inside ResourceModal or something)
fs.writeFileSync('pages/SecretArea.tsx', code);
