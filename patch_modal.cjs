const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(12);
            else if (window.innerWidth < 1024) setItemsPerPage(16);
            else setItemsPerPage(20);
        };`,
`        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(12);
            else if (window.innerWidth < 768) setItemsPerPage(12);
            else if (window.innerWidth < 1024) setItemsPerPage(16);
            else setItemsPerPage(18);
        };`
);

content = content.replace(
`<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {paginatedGames.map((game, index) => {`,
`<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                        {paginatedGames.map((game, index) => {`
);

fs.writeFileSync(file, content);
console.log('patched modal');
