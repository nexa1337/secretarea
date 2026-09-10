import admin from 'firebase-admin';

// Initialize the Firebase Admin SDK using application default credentials.
// The container has a service account injected.
admin.initializeApp({
  projectId: 'ai-studio-nexa1337secretar-3c91f419-59a1-4f62-a245-ae1e59ea92db',
});

const db = admin.firestore();

async function clearFavorites() {
  const snapshot = await db.collection('SecretArea').get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { favoriteGames: [] });
  });
  await batch.commit();
  console.log('Successfully cleared favoriteGames for all users.');
}

clearFavorites().catch(console.error);
