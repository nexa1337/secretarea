#!/bin/bash
sed -i 's/                  {\/\* Tools You Need \*\/}/                  {item.toolsNeeded \&\& item.toolsNeeded.length > 0 \&\& (\n                  <>\n                  {\/\* Tools You Need \*\/}/' pages/SecretArea.tsx

sed -i 's/                  {\/\* N E X A 1337 Alert \*\/}/                  <\/>\n                  )}\n                  {\/\* N E X A 1337 Alert \*\/}/' pages/SecretArea.tsx
