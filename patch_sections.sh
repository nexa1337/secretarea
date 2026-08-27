#!/bin/bash
sed -i 's/                  {\/\* System Requirements \*\/}/                  {item.systemReqs \&\& item.systemReqs.length > 0 \&\& (\n                  <>\n                  {\/\* System Requirements \*\/}/' pages/SecretArea.tsx

sed -i 's/                  {\/\* Installation Steps \*\/}/                  <\/>\n                  )}\n                  {\/\* Installation Steps \*\/}/' pages/SecretArea.tsx
