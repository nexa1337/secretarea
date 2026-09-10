const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const targetLine = "const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true' || localStorage.getItem('nexa_guest_mode') === 'true');";
const injectCode = `
  useEffect(() => {
    import('../src/firebase').then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setIsUnlocked(true);
          localStorage.setItem('secret_area_unlocked', 'true');
          window.dispatchEvent(new Event('authChange'));
        }
      });
      return () => unsubscribe();
    });
  }, []);
`;

if (!code.includes('auth.onAuthStateChanged((user) => {') && code.includes(targetLine)) {
    code = code.replace(targetLine, targetLine + injectCode);
    fs.writeFileSync('pages/SecretArea.tsx', code);
}
