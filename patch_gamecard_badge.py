import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

replacement = """                                {item.isFree && (
                                    <div className="px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                                        <Icon name="Gift" size={12} /> Free
                                    </div>
                                )}
                                {(item.links?.preInstalled?.download || item.links?.preInstalled?.cloudDrop || item.links?.preInstalled?.torrent) && (
                                    <div className="px-2 py-1 bg-amber-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                                        Pre-Installed
                                    </div>
                                )}"""

pattern = r"\{\s*item\.isFree\s*&&\s*\(\s*<div\s*className=\"px-2\s*py-1\s*bg-emerald-500\s*text-white\s*rounded-md\s*text-\[10px\]\s*font-black\s*uppercase\s*tracking-wider\s*shadow-lg\s*flex\s*items-center\s*gap-1\">\s*<Icon\s*name=\"Gift\"\s*size=\{12\}\s*\/>\s*Free\s*<\/div>\s*\)\s*\}\s*\{\(item\.links\?\.preInstalled\?\.download\s*\|\|\s*item\.links\?\.preInstalled\?\.cloudDrop\s*\|\|\s*item\.links\?\.preInstalled\?\.torrent\)\s*&&\s*\(\s*<div\s*className=\"px-2\s*py-1\s*bg-amber-500\s*text-white\s*rounded-md\s*text-\[10px\]\s*font-black\s*uppercase\s*tracking-wider\s*shadow-lg\s*flex\s*items-center\s*gap-1\">\s*<Icon\s*name=\"Gamepad2\"\s*size=\{12\}\s*\/>\s*Pre-Installed\s*<\/div>\s*\)\s*\}"

content = re.sub(pattern, replacement, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
