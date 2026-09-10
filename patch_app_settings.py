import re

with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import Profile from './pages/Profile';", "import Profile from './pages/Profile';\nimport Settings from './pages/Settings';")
content = content.replace('<Route path="/profile" element={<Profile />} />', '<Route path="/profile" element={<Profile />} />\n          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />')

with open('App.tsx', 'w') as f:
    f.write(content)
