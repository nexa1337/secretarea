#!/bin/bash
sed -i 's/className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 saturate-100 group-hover:saturate-150"/className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110 saturate-100 group-hover:saturate-150"/g' pages/SecretArea.tsx

sed -i '/<div className="absolute inset-0 bg-gradient-to-t from-slate-900\/90 via-slate-900\/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"><\/div>/d' pages/SecretArea.tsx
