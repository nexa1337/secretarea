const fs = require('fs');
let code = fs.readFileSync('components/HeroSlider.tsx', 'utf8');

// The problematic lines:
//   if (games.length === 0) return null;
//   
//   const currentItem = games[currentIndex];
// ...
//   useEffect(() => { ... })

// We can simply move the useEffect up.
// Or just let's rewrite the beginning of the component.
const lines = code.split('\\n');
const newCode = [];
let useEffectFound = false;

// Actually it's easier to use a regex or string replacement.
const matchStr = \`  if (games.length === 0) return null;

  const currentItem = games[currentIndex];
  
  // Decide what image to use as background. Usually coverImage or a galleryImage.
  const bgImage = currentItem.galleryImages && currentItem.galleryImages.length > 0 
    ? currentItem.galleryImages[0] 
    : currentItem.coverImage;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % games.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);

  useEffect(() => {
    if (games.length === 0) return;
    const interval = setInterval(handleNext, 8000); // Auto-slide every 8s
    return () => clearInterval(interval);
  }, [games.length, handleNext]);\`;

const replaceStr = \`  const handleNext = React.useCallback(() => setCurrentIndex((prev) => (prev + 1) % games.length), [games.length]);
  const handlePrev = React.useCallback(() => setCurrentIndex((prev) => (prev - 1 + games.length) % games.length), [games.length]);

  useEffect(() => {
    if (games.length === 0) return;
    const interval = setInterval(handleNext, 8000); // Auto-slide every 8s
    return () => clearInterval(interval);
  }, [games.length, handleNext]);

  if (games.length === 0) return null;

  const currentItem = games[currentIndex];
  
  // Decide what image to use as background. Usually coverImage or a galleryImage.
  const bgImage = currentItem.galleryImages && currentItem.galleryImages.length > 0 
    ? currentItem.galleryImages[0] 
    : currentItem.coverImage;\`;

if (code.includes('if (games.length === 0) return null;')) {
    code = code.replace(matchStr, replaceStr);
    fs.writeFileSync('components/HeroSlider.tsx', code);
}
