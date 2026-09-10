import re

with open('components/HardwareCompatibility.tsx', 'r') as f:
    content = f.read()

# Fix the tags
content = content.replace("                </div>\n              </div>", "                </button>\n              </div>")
content = content.replace("                </div>\n                <CircularProgress", "                </button>\n                <CircularProgress")

# Fix the Link tag
content = content.replace("                <Link to=\"/settings\"", "                <Link to=\"/settings\"")
content = content.replace("                  {t('System requirements are based on the global filter')}\n                </div>", "                  {t('Update your PC Specifications')}\n                </Link>")

with open('components/HardwareCompatibility.tsx', 'w') as f:
    f.write(content)
