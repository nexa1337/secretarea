const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = "}> = ({ item, onClose, isHypervisor, stash, toggleStash, onCompanyClick, onGenreClick, resolvedDev, isGuestMode, showGuestNotification, globalSpecs, initialScrollTarget, onDonateClick, allResources, onItemSelect, currentGenreContext }) => {";
const replacement = "}> = ({ item: _rawItem, onClose, isHypervisor, stash, toggleStash, onCompanyClick, onGenreClick, resolvedDev, isGuestMode, showGuestNotification, globalSpecs, initialScrollTarget, onDonateClick, allResources, onItemSelect, currentGenreContext }) => { const item = { ..._rawItem, links: _rawItem.links || {} as any };";

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('pages/SecretArea.tsx', code);
    console.log("Replaced safely");
} else {
    console.log("Target not found");
}
