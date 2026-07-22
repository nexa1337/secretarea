const fs = require('fs');
let code = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const target1 = `                      <a 
                        href={item.links.full}
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQBitWarning(false);
                        }}`;
const replacement1 = `                      <a 
                        href={item.links.full}
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isGuestMode) {
                              e.preventDefault();
                              showGuestNotification();
                              return;
                          }
                          setShowQBitWarning(false);
                        }}`;

const target2 = `                      <a 
                        href={item.links.full}
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQBitWarning(false);
                          setTimeout(() => setQBitSuccess(false), 500);
                        }}`;
const replacement2 = `                      <a 
                        href={item.links.full}
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isGuestMode) {
                              e.preventDefault();
                              showGuestNotification();
                              return;
                          }
                          setShowQBitWarning(false);
                          setTimeout(() => setQBitSuccess(false), 500);
                        }}`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
fs.writeFileSync('pages/SecretArea.tsx', code);
