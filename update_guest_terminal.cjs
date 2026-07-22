const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetPassword = `      } else if (cmd === 'Wolfspace') {
        newHistory.push({ type: 'success', text: 'Access Granted. Decrypting Area...' });
        setIsUnlocked(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'true');
        fetchData();
        setFailedAttempts(0);
        setTerminalMode('normal');
      } else {`;
const replacementPassword = `      } else if (cmd === 'Wolfspace') {
        newHistory.push({ type: 'success', text: 'Access Granted. Decrypting Area...' });
        setIsUnlocked(true);
        setIsGuestMode(false);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'true');
        localStorage.setItem('nexa_guest_mode', 'false');
        fetchData();
        setFailedAttempts(0);
        setTerminalMode('normal');
      } else if (lowerCmd === 'guest') {
        newHistory.push({ type: 'success', text: 'Guest Access Granted. Loading limited preview...' });
        setIsUnlocked(true);
        setIsGuestMode(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'guest');
        localStorage.setItem('nexa_guest_mode', 'true');
        fetchData();
        setFailedAttempts(0);
        setTerminalMode('normal');
      } else {`;
code = code.replace(targetPassword, replacementPassword);

const targetCommand = `      } else if (lowerCmd === 'login wolfspace' || cmd === 'Wolfspace') {
        newHistory.push({ type: 'success', text: 'Access Granted. Decrypting Area...' });
        setIsUnlocked(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'true');
        fetchData();
      } else {`;
const replacementCommand = `      } else if (lowerCmd === 'login wolfspace' || cmd === 'Wolfspace') {
        newHistory.push({ type: 'success', text: 'Access Granted. Decrypting Area...' });
        setIsUnlocked(true);
        setIsGuestMode(false);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'true');
        localStorage.setItem('nexa_guest_mode', 'false');
        fetchData();
      } else if (lowerCmd === 'login guest' || lowerCmd === 'guest') {
        newHistory.push({ type: 'success', text: 'Guest Access Granted. Loading limited preview...' });
        setIsUnlocked(true);
        setIsGuestMode(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'guest');
        localStorage.setItem('nexa_guest_mode', 'true');
        fetchData();
      } else {`;
code = code.replace(targetCommand, replacementCommand);

fs.writeFileSync('pages/SecretArea.tsx', code);
