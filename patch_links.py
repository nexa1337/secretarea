import re

with open('pages/SecretArea.tsx', 'r') as f:
    content = f.read()

# Add to ResourceItem
replacement1 = """    tutorial?: string; 
    dlc?: string;
    trailer?: string;
    preInstalled?: {
        download?: string;
        cloudDrop?: string;
        torrent?: string;
    };
  };"""
content = re.sub(r'tutorial\?: string;\s*dlc\?: string;\s*trailer\?: string;\s*};\s*', replacement1, content)

# Add to processRawData mapping
replacement2 = """              tutorial: getVal('tutorial'), 
              dlc: getVal('dlc'), 
              trailer: getVal('trailer'),
              preInstalled: {
                  download: getVal('First button (Download with game size)'),
                  cloudDrop: getVal('2 button (CloudDrop Mirror)'),
                  torrent: getVal('3 button (utorrent File)')
              }
            }"""
content = re.sub(r'tutorial: getVal\(\'tutorial\'\),\s*dlc: getVal\(\'dlc\'\),\s*trailer: getVal\(\'trailer\'\)\s*\}', replacement2, content)

with open('pages/SecretArea.tsx', 'w') as f:
    f.write(content)
