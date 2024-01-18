import { initializeApp, getApps, cert } from "firebase-admin/app";
import { env } from "@/env";
const firebaseAdminConfig = {
  credential: cert(env.SECRET_PATH),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    return initializeApp(firebaseAdminConfig);
  }
}
