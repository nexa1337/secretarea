const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetHelp = `        newHistory.push({ type: 'info', text: '  [3] AUTH    : Enter Secret Code' });
        newHistory.push({ type: 'info', text: '  [4] NETWORK : Join Telegram' });
        newHistory.push({ type: 'info', text: '  clear       : Flush memory' });`;
const replacementHelp = `        newHistory.push({ type: 'info', text: '  [3] AUTH    : Enter Secret Code' });
        newHistory.push({ type: 'info', text: '  [4] NETWORK : Join Telegram' });
        newHistory.push({ type: 'info', text: '  [5] GUEST   : Login as Guest' });
        newHistory.push({ type: 'info', text: '  clear       : Flush memory' });`;
code = code.replace(targetHelp, replacementHelp);

const targetOption4 = `      } else if (lowerCmd === '4') {
        newHistory.push({ 
          type: 'info', 
          text: (
            <div className="flex flex-col space-y-2 mt-1 ml-2">
              <div>[-] <a href="https://t.me/NEXA_1337" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Join N E X A 1337</a></div>
            </div>
          ) 
        });
      } else if (lowerCmd === 'clear') {`;
const replacementOption4 = `      } else if (lowerCmd === '4') {
        newHistory.push({ 
          type: 'info', 
          text: (
            <div className="flex flex-col space-y-2 mt-1 ml-2">
              <div>[-] <a href="https://t.me/NEXA_1337" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">Join N E X A 1337</a></div>
            </div>
          ) 
        });
      } else if (lowerCmd === '5') {
        newHistory.push({ type: 'success', text: 'Guest Access Granted. Loading limited preview...' });
        setIsUnlocked(true);
        setIsGuestMode(true);
        setShowHackerLoader(true);
        setHackerProgress(0);
        localStorage.setItem('secret_area_unlocked', 'guest');
        localStorage.setItem('nexa_guest_mode', 'true');
        fetchData();
      } else if (lowerCmd === 'clear') {`;
code = code.replace(targetOption4, replacementOption4);

fs.writeFileSync('pages/SecretArea.tsx', code);
