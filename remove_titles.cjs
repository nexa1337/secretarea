const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight drop-shadow-md">
                                                {game.name}
                                            </h3>
                                        </div>`;

const target2 = `<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight drop-shadow-md">
                                        {game.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded backdrop-blur-sm border border-blue-500/30">
                                            View Details
                                        </span>
                                    </div>
                                </div>`;

if (code.includes(target1)) {
    code = code.replace(target1, '');
}
if (code.includes(target2)) {
    code = code.replace(target2, '');
}

fs.writeFileSync('pages/SecretArea.tsx', code);
console.log("Removed titles");
