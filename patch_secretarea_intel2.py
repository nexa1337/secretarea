import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

effect_addition = """
  useEffect(() => {
    const handleOpenIntelPanel = () => {
        setShowIntelPanel(true);
        if (intelItems.length > 0) {
            localStorage.setItem('last_seen_intel', String(new Date(intelItems[0].timestamp || 0).getTime()));
        }
        window.dispatchEvent(new Event('intel-opened'));
    };
    window.addEventListener('open-intel-panel', handleOpenIntelPanel);
    return () => window.removeEventListener('open-intel-panel', handleOpenIntelPanel);
  }, [intelItems]);

  useEffect(() => {
    if (intelItems.length > 0) {
        window.dispatchEvent(new CustomEvent('intel-updated', { detail: String(new Date(intelItems[0].timestamp || 0).getTime()) }));
    }
  }, [intelItems]);

"""

# Let's insert it before `const intelItems = useMemo(() => {` but after intelItems is defined so we need it AFTER useMemo.
content = re.sub(r"(const paginatedData = useMemo)", effect_addition + r"\1", content)

# Change setShowIntelPanel(true) in the Radar button
content = re.sub(r"onClick=\{\(\) => setShowIntelPanel\(true\)\}", "onClick={() => window.dispatchEvent(new Event('open-intel-panel'))}", content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
