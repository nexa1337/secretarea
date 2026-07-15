const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const targetHeader = `<div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <h3 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon name="MessageSquare" size={24} className="text-blue-500" /> 
        Intel Reviews & Chatter
      </h3>`;

const replaceHeader = `<motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8"
    >
      <h3 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon name="MessageSquare" size={24} className="text-blue-500" /> 
        Join the Conversation
      </h3>`;

code = code.replace(targetHeader, replaceHeader);

// We also need to change the closing </div> to </motion.div> at the very end of CommentsSection.tsx.
// Let's just do a regex for the last </div> before the end of the file.
const endRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/;
// actually I'll just replace the last </div> with </motion.div>
code = code.replace(/<\/div>\s*\);\s*};\s*$/, '</motion.div>\n  );\n};\n');

fs.writeFileSync('components/CommentsSection.tsx', code);
