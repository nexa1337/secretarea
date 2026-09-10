import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

replacement = """{(item.links.full || (item.links.mirrors && item.links.mirrors.length > 0) || (item.links.parts && item.links.parts.length > 0) || (item.links.ankerParts && item.links.ankerParts.length > 0) || (item.links.preInstalled && (item.links.preInstalled.download || item.links.preInstalled.cloudDrop || item.links.preInstalled.torrent))) && ("""

pattern = r"\{\(\s*item\.links\.full\s*\|\|\s*\(\s*item\.links\.mirrors\s*&&\s*item\.links\.mirrors\.length\s*>\s*0\s*\)\s*\|\|\s*\(\s*item\.links\.parts\s*&&\s*item\.links\.parts\.length\s*>\s*0\s*\)\s*\|\|\s*\(\s*item\.links\.ankerParts\s*&&\s*item\.links\.ankerParts\.length\s*>\s*0\s*\)\s*\)\s*&&\s*\("
new_content = re.sub(pattern, replacement, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(new_content)
