const fs = require('fs');
let code = fs.readFileSync('pages/Profile.tsx', 'utf8');

// 1. Add search state
code = code.replace(
    "const [allUsers, setAllUsers] = useState<any[]>([]);",
    "const [allUsers, setAllUsers] = useState<any[]>([]);\n    const [searchUserTerm, setSearchUserTerm] = useState('');\n    const [copied, setCopied] = useState(false);"
);

// 2. Filter logic for admin users
code = code.replace(
    "const indexOfLastUser = currentPage * usersPerPage;\n    const indexOfFirstUser = indexOfLastUser - usersPerPage;\n    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);\n    const totalPages = Math.ceil(allUsers.length / usersPerPage);",
    `const filteredUsers = allUsers.filter(u => 
        (u.displayName || '').toLowerCase().includes(searchUserTerm.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(searchUserTerm.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(searchUserTerm.toLowerCase())
    );
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);`
);

// 3. Update ResourceDetailModal to pass globalSpecs
const defaultSpecsBlock = `                    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
                        <ResourceDetailModal
                            item={selectedGame}
                            onClose={() => setSelectedGame(null)}
                            stash={favorites.map((f: any) => f.id)}
                            toggleStash={() => {}}
                            isGuestMode={false}
                            allResources={{}}
                            globalSpecs={profileData?.pcSpecs || { ram: 16, os: '10', cpuModel: 'Core i5-12400', gpuModel: 'GeForce RTX 3060', isActive: false }}
                        />
                    </div>`;

code = code.replace(/<div className="fixed inset-0 z-\[100\] flex flex-col overflow-hidden">[\s\S]*?<\/div>/, defaultSpecsBlock);

fs.writeFileSync('pages/Profile.tsx', code);
console.log("Successfully patched state, filter, and modal specs");
