import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

# Replace the layout classes of the Hide Incompatible label
content = content.replace("self-start sm:self-auto ml-0 sm:ml-4 border-l-0 sm:border-l border-slate-200 dark:border-slate-800 pl-0 sm:pl-4 mt-2 sm:mt-0", "self-start sm:self-auto ml-0 sm:ml-4 rtl:sm:ml-0 rtl:sm:mr-4 border-l-0 sm:border-l rtl:sm:border-l-0 rtl:sm:border-r border-slate-200 dark:border-slate-800 pl-0 sm:pl-4 rtl:sm:pl-0 rtl:sm:pr-4 mt-2 sm:mt-0")

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
