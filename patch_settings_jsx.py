import re

with open('pages/Settings.tsx', 'r') as f:
    content = f.read()

content = content.replace("{isSaving ? {t('Saving...') || 'Saving...'} : {t('Save Changes') || 'Save Changes'}}", "{isSaving ? (t('Saving...') || 'Saving...') : (t('Save Changes') || 'Save Changes')}")

# Also check other potential nested braces I created.
content = re.sub(r'placeholder={({t\([^}]*})}', r'placeholder=\1', content)

with open('pages/Settings.tsx', 'w') as f:
    f.write(content)
