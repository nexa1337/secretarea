import re

with open('pages/Profile.tsx', 'r') as f:
    content = f.read()

pattern = r"\s*\{activeTab === 'Library' && \([\s\S]*?\}\s*<\/div>\s*\)\}"
content = re.sub(pattern, "", content)

with open('pages/Profile.tsx', 'w') as f:
    f.write(content)
