#!/bin/bash
sed -i 's/                      <button onClick={() => {/                      {item.galleryImages \&\& item.galleryImages.length > 0 \&\& (\n                      <button onClick={() => {/g' pages/SecretArea.tsx
