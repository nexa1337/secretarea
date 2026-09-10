const fs = require('fs');
let content = fs.readFileSync('pages/SecretArea.tsx', 'utf8');

const originalEnd = `      {noteModalContent && (
          <NoteModal content={noteModalContent} onClose={() => setNoteModalContent(null)} />
      )}
  </AnimatePresence>
</motion.div>
  );
};`;

const newEnd = `      {noteModalContent && (
          <NoteModal content={noteModalContent} onClose={() => setNoteModalContent(null)} />
      )}
  </AnimatePresence>
  <UploaderProfilePopup isOpen={showUploaderPopup} onClose={() => setShowUploaderPopup(false)} user={auth.currentUser} />
</motion.div>
  );
};`;

if (content.includes(originalEnd)) {
    content = content.replace(originalEnd, newEnd);
    fs.writeFileSync('pages/SecretArea.tsx', content);
    console.log("Fixed popup position");
} else {
    console.log("Could not find ResourceDetailModal end!");
}
