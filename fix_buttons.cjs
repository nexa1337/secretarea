const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

code = code.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-[75%]"',
  'className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-start xl:justify-end gap-3 w-full xl:w-auto shrink-0 mt-6 xl:mt-0 xl:max-w-[75%] relative z-[100]"'
);

code = code.replace(
  'onClick={() => setShowSteamModal(true)}',
  'id="free-accounts-btn"\n                onClick={() => setShowSteamModal(true)}'
);

code = code.replace(
  'onClick={() => setShowMasterGiftModal(true)}',
  'id="master-gift-btn"\n                onClick={() => setShowMasterGiftModal(true)}'
);

code = code.replace(
  'href={DISCORD_LINK}',
  'id="join-community-btn" href={DISCORD_LINK}'
);

code = code.replace(
  'href={TELEGRAM_LINK}',
  'id="telegram-btn" href={TELEGRAM_LINK}'
);

code = code.replace(
  'className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar"',
  'className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar relative z-[100]"'
);

fs.writeFileSync('pages/SecretArea.tsx', code);
