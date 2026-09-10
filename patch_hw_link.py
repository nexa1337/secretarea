import re

with open('components/HardwareCompatibility.tsx', 'r') as f:
    content = f.read()

content = content.replace('<Link to="/settings"', '<Link to="/settings" state={{ tab: \'Hardware\' }}')

with open('components/HardwareCompatibility.tsx', 'w') as f:
    f.write(content)
