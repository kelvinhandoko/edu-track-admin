import { initializeApp, getApps, cert } from "firebase-admin/app";
import { env } from "@/env";

const firebaseAdminConfig = {
  credential: cert({
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
    projectId: env.FIREBASE_ADMIN_PROJECT_ID,
  }),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    return initializeApp(firebaseAdminConfig);
  }
}
