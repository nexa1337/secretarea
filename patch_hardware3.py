import re

with open('components/HardwareCompatibility.tsx', 'r') as f:
    content = f.read()

content = content.replace('                  <SpecCard item={specs.os} icon="BrandWindows" fallbackIcon="Layout" fullWidth />\n                </button>\n              </div>', '                  <SpecCard item={specs.os} icon="BrandWindows" fallbackIcon="Layout" fullWidth />\n                </div>\n              </div>')

with open('components/HardwareCompatibility.tsx', 'w') as f:
    f.write(content)
