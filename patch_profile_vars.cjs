const fs = require('fs');
let content = fs.readFileSync('pages/Profile.tsx', 'utf8');

const targetStr = `    if (loading) {
        return <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-white dark:bg-[#0a0f18]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    if (!user || !profileData) return null;`;

const replacementStr = targetStr + `

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(allUsers.length / usersPerPage);`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('pages/Profile.tsx', content);
console.log("pages/Profile.tsx patched variables");
