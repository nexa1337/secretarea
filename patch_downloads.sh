#!/bin/bash
sed -i 's/                  {\/\* Download Channels \*\/}/                  {\/\* Download Channels \*\/}\n                  {(item.links.full || (item.links.mirrors \&\& item.links.mirrors.length > 0) || (item.links.parts \&\& item.links.parts.length > 0) || (item.links.ankerParts \&\& item.links.ankerParts.length > 0)) \&\& (\n/' pages/SecretArea.tsx

sed -i 's/                      )}/                      )}\n                  </div>\n                  )}/g' pages/SecretArea.tsx
# wait, the closing tag replacement is too generic.
