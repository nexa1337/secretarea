import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function test() {
    try {
        console.log("Testing read...");
        await getDocs(collection(db, 'SecretArea'));
        console.log("Read successful!");
        
        console.log("Testing write...");
        await setDoc(doc(db, 'SecretArea', 'test-doc'), { test: true });
        console.log("Write successful!");
        
        process.exit(0);
    } catch(e) {
        console.error("Firestore Error:", e);
        process.exit(1);
    }
}
test();
