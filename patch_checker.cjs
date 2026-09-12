const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target = "const SystemChecker: React.FC<{ reqs: {label: string, value: string}[] }> = ({ reqs }) => {";
const replacement = "const SystemChecker: React.FC<{ reqs: {label: string, value: string}[], globalSpecs?: { ram: number, os: string, cpuModel: string, gpuModel: string, isActive: boolean } }> = ({ reqs, globalSpecs }) => {";

code = code.replace(target, replacement);

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Patched SystemChecker signature");
