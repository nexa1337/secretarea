const fs = require('fs');
const file = 'pages/SecretArea.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetLogic = `        const handleResize = () => {
            if (window.innerWidth < 640) setDisplayCount(8);
            else if (window.innerWidth < 768) setDisplayCount(12);
            else if (window.innerWidth < 1024) setDisplayCount(16);
            else if (window.innerWidth < 1280) setDisplayCount(15);
            else setDisplayCount(18);
        };`;

const newLogic = `        const handleResize = () => {
            if (window.innerWidth < 640) setDisplayCount(8);
            else if (window.innerWidth < 768) setDisplayCount(12);
            else if (window.innerWidth < 1024) setDisplayCount(16);
            else setDisplayCount(18);
        };`;

content = content.replace(targetLogic, newLogic);

const targetGrid = `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`;
const newGrid = `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`;

content = content.replace(targetGrid, newGrid);

fs.writeFileSync(file, content);
console.log('patched grid');
