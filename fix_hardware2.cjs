const fs = require('fs');
let code = fs.readFileSync('./components/HardwareCompatibility.tsx', 'utf8');

const oldStart = `<AnimatePresence>
        {isOpen && typeof document !== 'undefined' && createPortal(`;
const newStart = `{typeof document !== 'undefined' && createPortal(
      <AnimatePresence>
        {isOpen && (`;

code = code.replace(oldStart, newStart);

const oldEnd = `        , document.body)}
      </AnimatePresence>`;
const newEnd = `        )}
      </AnimatePresence>, document.body)}`;

code = code.replace(oldEnd, newEnd);

fs.writeFileSync('./components/HardwareCompatibility.tsx', code);
