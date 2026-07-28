const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const maintenanceBlock = `  if (maintenanceConfig === undefined) {
      return (
          <div className="w-full h-screen fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
              <div className="animate-spin text-slate-900 dark:text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></div>
          </div>
      );
  }

  if (maintenanceConfig?.active) {
    // Admin bypass: append ?bypass=nexa to the URL
    const urlParams = new URLSearchParams(window.location.search);
    const isBypass = urlParams.get('bypass') === 'nexa';
    
    if (!isBypass) {
        return <MaintenancePage endTime={maintenanceConfig.endTime} message={maintenanceConfig.message} />;
    }
  }`;

const terminalBlockStart = `  if (!isUnlocked) {
    return (
      <div className=\`w-full h-screen fixed inset-0 z-[200]`;

if (code.includes(maintenanceBlock) && code.includes(terminalBlockStart)) {
    // We want to extract the entire if (!isUnlocked) block.
    // It's quite long, so let's find its start and end.
    // Actually, we can just move the maintenanceBlock to AFTER the if (!isUnlocked) block.
}
