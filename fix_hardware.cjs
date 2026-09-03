const fs = require('fs');
let code = fs.readFileSync('./components/HardwareCompatibility.tsx', 'utf8');

if (!code.includes('createPortal')) {
    code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");
}

const originalModal = `{isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">`;
          
const newModal = `{isOpen && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">`;

code = code.replace(originalModal, newModal);

const originalClose = `</motion.div>
          </div>
        )}
      </AnimatePresence>`;
const newClose = `</motion.div>
          </div>
        , document.body)}
      </AnimatePresence>`;
      
code = code.replace(originalClose, newClose);

const originalHeader = `<div className="p-6 md:p-8 flex items-start gap-6 border-b border-slate-200 dark:border-slate-800/50 shrink-0">
                <CircularProgress progress={score} colorClass={colorClass} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">`;
                  
const newHeader = `<div className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-800/50 shrink-0 text-center sm:text-start relative">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 end-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 sm:hidden"
                >
                  <Icon name="X" size={20} />
                </button>
                <CircularProgress progress={score} colorClass={colorClass} />
                <div className="flex-1 w-full flex flex-col items-center sm:items-start">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">`;

code = code.replace(originalHeader, newHeader);

const originalButton = `<button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
                >
                  <Icon name="X" size={20} />
                </button>`;
const newButton = `<button 
                  onClick={() => setIsOpen(false)}
                  className="hidden sm:block p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
                >
                  <Icon name="X" size={20} />
                </button>`;
code = code.replace(originalButton, newButton);


fs.writeFileSync('./components/HardwareCompatibility.tsx', code);
