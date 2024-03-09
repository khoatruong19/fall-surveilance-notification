import * as admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json";

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

export { app as admin };
