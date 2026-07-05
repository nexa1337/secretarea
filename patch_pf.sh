#!/bin/bash
sed -i "s/if (password.toLowerCase() === 'nexa.1337' || password.toLowerCase() === 'nexa1337' || password === '1337') {/if (password === 'Marouan.anouar1') {/g" pages/PersonalFinance.tsx
sed -i 's/<br\/><span className="text-\[10px\] text-slate-400 dark:text-slate-500 mt-2 block">(Hint: Nexa.1337)<\/span>//g' pages/PersonalFinance.tsx
sed -i 's/ID: Nexa.1337 | Access:/ID: Admin | Access:/g' pages/PersonalFinance.tsx
sed -i 's/console.error("Failed to fetch notes:", error);//g' pages/PersonalFinance.tsx
