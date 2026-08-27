#!/bin/bash

# Remove the scale-110 from the image
sed -i 's/className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover\/card:scale-110"/className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"/g' pages/SecretArea.tsx

# Change the gradient overlay
sed -i 's/className="absolute inset-0 bg-gradient-to-t from-black\/95 via-black\/40 to-black\/10 opacity-80 group-hover\/card:opacity-90 transition-opacity duration-500"/className="absolute inset-0 bg-gradient-to-b from-black\/60 via-transparent to-transparent opacity-80 group-hover\/card:opacity-100 transition-opacity duration-500"/g' pages/SecretArea.tsx

