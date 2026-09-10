import re

with open('pages/Settings.tsx', 'r') as f:
    content = f.read()

content = content.replace("    const [isActive, setIsActive] = useState(false);", "    const [isActive, setIsActive] = useState(true);")

with open('pages/Settings.tsx', 'w') as f:
    f.write(content)
