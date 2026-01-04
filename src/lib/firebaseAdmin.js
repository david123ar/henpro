import { getApps } from "firebase-admin/app";
import admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDB = admin.firestore();
export { FieldValue };
