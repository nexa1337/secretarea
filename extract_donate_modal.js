const fs = require('fs');
const content = fs.readFileSync('pages/SecretArea.tsx', 'utf8');
const startStr = 'const DonateModal: React.FC<{';
const startIdx = content.indexOf(startStr);
if (startIdx === -1) {
    console.error("Not found");
    process.exit(1);
}
let openBraces = 0;
let started = false;
let endIdx = -1;
for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') {
        openBraces++;
        started = true;
    } else if (content[i] === '}') {
        openBraces--;
    }
    
    if (started && openBraces === 0) {
        endIdx = i + 1;
        // check if next is semicolon
        if (content[endIdx] === ';') {
            endIdx++;
        }
        break;
    }
}
if (endIdx !== -1) {
    fs.writeFileSync('components/DonateModal.tsx', `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { useLanguage } from '../src/contexts/LanguageContext';

` + content.substring(startIdx, endIdx) + `

export default DonateModal;`);
    console.log("Extracted to components/DonateModal.tsx");
}
