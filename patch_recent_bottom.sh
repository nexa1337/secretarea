#!/bin/bash

# We want to remove from {/* Bottom Content Area */} to </div> just before </div> \n </motion.div> \n ))}

sed -i '/{\/\* Bottom Content Area \*\/}/,/<\/div>/ {
  /{\/\* Bottom Content Area \*\/}/ d
  /<div className="absolute bottom-0 start-0 end-0 p-4 z-20 flex flex-col justify-end">/,/<\/div>/ {
    /<\/div>/ {
      # Wait, this is tricky to do safely with sed due to nested divs.
    }
  }
}' pages/SecretArea.tsx
