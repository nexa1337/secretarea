const fs = require('fs');
let content = fs.readFileSync('components/Icon.tsx', 'utf-8');

// Add TbBrandReddit to imports
if (!content.includes('TbBrandReddit')) {
    content = content.replace('TbBrandYoutube, TbBrandInstagram,', 'TbBrandYoutube, TbBrandInstagram, TbBrandReddit,');
}

// Add BrandReddit to map
if (!content.includes('BrandReddit: TbBrandReddit')) {
    content = content.replace('Youtube: TbBrandYoutube,', 'Youtube: TbBrandYoutube,\n  Reddit: TbBrandReddit,\n  BrandReddit: TbBrandReddit,');
}

fs.writeFileSync('components/Icon.tsx', content);
console.log("Patched Icon.tsx with Reddit");
