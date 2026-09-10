const fs = require('fs');
let content = fs.readFileSync('pages/Profile.tsx', 'utf8');

// 1. Change TbInfoCircle to TbUsers in the Admin Dashboard header
content = content.replace(
    /<TbInfoCircle size=\{20\} \/>/g,
    '<TbUsers size={20} />'
);

// 2. Add TbUsers to imports if not there
if (!content.includes('TbUsers')) {
    content = content.replace(
        /import \{ (.*?) \} from 'react-icons\/tb';/,
        "import { $1, TbUsers } from 'react-icons/tb';"
    );
}

// 3. Implement Pagination logic
const paginationStateStr = `    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
`;
content = content.replace(
    /    const \[allUsers, setAllUsers\] = useState<any\[\]>\(\[\]\);\n    const \[loadingUsers, setLoadingUsers\] = useState\(false\);/,
    paginationStateStr
);

const paginationCalcStr = `
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
`;

content = content.replace(
    /const TABS = \['Overview', 'Liked', 'Library', 'Game history', 'Favorites'\];/,
    "const TABS = ['Overview', 'Liked', 'Library', 'Game history', 'Favorites'];"
);

// We need to inject paginationCalcStr before the return.
content = content.replace(
    /    if \(loading\) return/g,
    paginationCalcStr + '\n    if (loading) return'
);

// Replace allUsers.map with currentUsers.map
content = content.replace(
    /\{allUsers\.map\(\(u, i\) => \(/g,
    '{currentUsers.map((u, i) => ('
);

// Add pagination controls below the table
const paginationControls = `
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-6 border-t border-slate-200 dark:border-slate-700/60 pt-4">
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, allUsers.length)} of {allUsers.length} users
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaAngleLeft size={14} />
                                            </button>
                                            <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                                            <button 
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaAngleRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
`;

content = content.replace(
    /                                    <\/table>\n                                <\/div>/,
    paginationControls
);

fs.writeFileSync('pages/Profile.tsx', content);
console.log("pages/Profile.tsx updated");
