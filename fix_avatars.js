import fs from 'fs';

let header = fs.readFileSync('components/Header.tsx', 'utf8');
header = header.replace(
  '<img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />',
  '<img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />'
);
fs.writeFileSync('components/Header.tsx', header);

let profile = fs.readFileSync('pages/Profile.tsx', 'utf8');
profile = profile.replace(
  '<img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />',
  '<img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />'
);
fs.writeFileSync('pages/Profile.tsx', profile);

console.log('Avatars fixed');
