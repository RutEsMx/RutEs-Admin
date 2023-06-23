var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    private_key: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    client_Email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    type: "service_account",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mhbzn%40rutesmx.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  })
});
// if(!admin.apps.length) {
//   try {
    
//   } catch (error) {
//     console.log(error);
//   }
// }


export const firestore = admin.firestore();