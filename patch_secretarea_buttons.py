import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

pattern_like = r"<button onClick=\{\(e\) => \{\s*e\.currentTarget\.classList\.add\('text-rose-500'[\s\S]*?className=\"[^\"]*\" title=\"Like\">\s*<Icon name=\"Heart\" size=\{20\} />\s*<\/button>"
content = re.sub(pattern_like, "", content)

pattern_favorite = r"<button onClick=\{\(e\) => \{\s*e\.currentTarget\.classList\.add\('text-yellow-500'[\s\S]*?className=\"[^\"]*\" title=\"Add to Favorites\">\s*<Icon name=\"Bookmark\" size=\{20\} />\s*<\/button>"
content = re.sub(pattern_favorite, "", content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
