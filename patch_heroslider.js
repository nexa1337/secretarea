import fs from 'fs';
let code = fs.readFileSync('components/HeroSlider.tsx', 'utf8');

const target = `  if (games.length === 0) return null;

  const currentItem = games[currentIndex];
  
  // Decide what image to use as background. Usually coverImage or a galleryImage.
  const bgImage = currentItem.galleryImages && currentItem.galleryImages.length > 0 
    ? currentItem.galleryImages[0] 
    : currentItem.coverImage;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % games.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);

  useEffect(() => {
    if (games.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [games.length, currentIndex]);`;

const replacement = `  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % games.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);

  useEffect(() => {
    if (games.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [games.length, currentIndex]);

  if (games.length === 0) return null;

  const currentItem = games[currentIndex];
  
  // Decide what image to use as background. Usually coverImage or a galleryImage.
  const bgImage = currentItem.galleryImages && currentItem.galleryImages.length > 0 
    ? currentItem.galleryImages[0] 
    : currentItem.coverImage;`;

code = code.replace(target, replacement);
fs.writeFileSync('components/HeroSlider.tsx', code);
