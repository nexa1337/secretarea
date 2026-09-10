import re

with open('pages/Settings.tsx', 'r') as f:
    content = f.read()

# Add useLocation to imports
content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, useLocation } from 'react-router-dom';")

# Change state initialization to read from location state
state_replacement = """    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'Profile');"""

content = re.sub(r'const \[activeTab, setActiveTab\] = useState\(\'Profile\'\);', state_replacement, content)

with open('pages/Settings.tsx', 'w') as f:
    f.write(content)
