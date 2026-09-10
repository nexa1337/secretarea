const fs = require('fs');
let content = fs.readFileSync('pages/Profile.tsx', 'utf8');

// The block that is currently broken:
//                             ) : (
//                                 <div className="overflow-x-auto">
//                                     ...
//                                     </table>
//                                 </div>
//                                 {totalPages > 1 && (
//                                    ...
//                                 )}
//                             )}

content = content.replace(
    /\) : \(\n\s*<div className="overflow-x-auto">/,
    ") : (\n                                <>\n                                <div className=\"overflow-x-auto\">"
);

content = content.replace(
    /                                \)}\n                            \)}/,
    "                                )}\n                                </>\n                            )}"
);

fs.writeFileSync('pages/Profile.tsx', content);
console.log("pages/Profile.tsx patched");
