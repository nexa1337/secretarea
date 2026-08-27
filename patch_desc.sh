#!/bin/bash
sed -i 's/                 {\/\* Description \*\/}/                 {item.description \&\& (\n                 <>\n                 {\/\* Description \*\/}/' pages/SecretArea.tsx
sed -i 's/                 {\/\* Metadata Boxes \*\/}/                 <\/>\n                 )}\n                 {\/\* Metadata Boxes \*\/}/' pages/SecretArea.tsx
