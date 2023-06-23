var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

if(!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        private_key: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        client_Email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        ...serviceAccount
      })
    });
  } catch (error) {
    console.log(error);
  }
}


export const firestore = admin.firestore();