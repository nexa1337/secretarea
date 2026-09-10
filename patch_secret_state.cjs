const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = `  const [selectedResourceAction, setSelectedResourceAction] = useState<string | undefined>(undefined);`;

const inject = `  const [selectedResourceAction, setSelectedResourceAction] = useState<string | undefined>(undefined);

  const location = window.location; // using window.location if useLocation is not imported
  useEffect(() => {
    // If there's a state passed via history
    const state = window.history.state?.usr;
    if (state?.openGameId && Object.keys(allResources).length > 0) {
      const allItems = Object.values(allResources).flat();
      const gameToOpen = allItems.find(g => g.id === state.openGameId);
      if (gameToOpen) {
        setSelectedResource(gameToOpen);
        // Clear state so it doesn't reopen on refresh
        window.history.replaceState({ usr: { ...state, openGameId: null } }, '');
      }
    }
  }, [Object.keys(allResources).length]);`;

code = code.replace(target, inject);
fs.writeFileSync('pages/SecretArea.tsx', code);
