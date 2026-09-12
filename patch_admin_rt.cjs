const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

const newAdminEffect = `
    useEffect(() => {
        let unsub = () => {};
        if (activeTab === 'Admin Users' && profileData?.role === 'admin') {
            setLoadingUsers(true);
            unsub = onSnapshot(collection(db, 'SecretArea'), (snap) => {
                const usersData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                usersData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                setAllUsers(usersData);
                setLoadingUsers(false);
            }, (err) => {
                console.error("Error fetching users:", err);
                setLoadingUsers(false);
            });
        }
        return () => unsub();
    }, [activeTab, profileData]);
`;

code = code.replace(
    /useEffect\(\(\) => \{\n        if \(activeTab === 'Admin Users' && profileData\?\.role === 'admin'\) \{\n            fetchUsers\(\);\n        \}\n    \}, \[activeTab, profileData\]\);\n\n    const fetchUsers = async \(\) => {[\s\S]*?setLoadingUsers\(false\);\n    \};/,
    newAdminEffect
);

fs.writeFileSync('pages/Profile.tsx', code);
