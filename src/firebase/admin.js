import { initializeApp, getApps, cert } from 'firebase-admin/app';

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp({
      credential: cert({
        private_key: JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        type: "service_account",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mhbzn%40rutesmx.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
      })
    });
  }
}
