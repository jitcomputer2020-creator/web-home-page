import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import rawFirebaseConfig from '../firebase-applet-config.json';

/**
 * Firebase Configuration
 *
 * Loaded from the provisioned firebase-applet-config.json file.
 * If migrating to a different Firebase project later, update firebase-applet-config.json
 * or replace the values below.
 */
export const firebaseConfig = {
  apiKey: rawFirebaseConfig.apiKey || 'YOUR_API_KEY',
  authDomain: rawFirebaseConfig.authDomain || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: rawFirebaseConfig.projectId || 'YOUR_PROJECT_ID',
  storageBucket: rawFirebaseConfig.storageBucket || 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: rawFirebaseConfig.messagingSenderId || 'YOUR_MESSAGING_SENDER_ID',
  appId: rawFirebaseConfig.appId || 'YOUR_APP_ID',
  firestoreDatabaseId: rawFirebaseConfig.firestoreDatabaseId || '(default)',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith('YOUR_') &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.startsWith('YOUR_')
);

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const HOMEPAGE_COLLECTION = 'siteContent';
export const HOMEPAGE_DOC_ID = 'homepage';
export const HOMEPAGE_DOC_PATH = `${HOMEPAGE_COLLECTION}/${HOMEPAGE_DOC_ID}`;
export const ENQUIRIES_COLLECTION = 'enquiries';
export const ADMIN_PRIMARY_EMAIL = 'jitcomputer2020@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  const serialized = JSON.stringify(errInfo);
  console.error('Firestore Error: ', serialized);
  throw new Error(serialized);
}

async function testConnection(): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();

export default app;
