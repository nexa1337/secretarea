import re

with open('components/HardwareCompatibility.tsx', 'r') as f:
    content = f.read()

# Fix the broken button tags:
# Line 266 should be </div>
content = content.replace('                  </button>\n                </div>\n              </div>\n              <div className="px-6 py-4 bg-slate-50', '                  </div>\n                </div>\n              </div>\n              <div className="px-6 py-4 bg-slate-50')

# Line 273 should be </Link>
content = content.replace('                  {t(\'Update your PC Specifications\')}\n                </button>', '                  {t(\'Update your PC Specifications\')}\n                </Link>')
content = content.replace('                  {t(\'System requirements are based on the global filter\')}\n                </button>', '                  {t(\'Update your PC Specifications\')}\n                </Link>')

with open('components/HardwareCompatibility.tsx', 'w') as f:
    f.write(content)
