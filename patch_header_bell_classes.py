import re

with open('components/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 ml-1 mr-0 sm:ml-2 sm:mr-1"',
    'className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 mx-1"'
)

with open('components/Header.tsx', 'w') as f:
    f.write(content)
