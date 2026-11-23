import { User, signInWithPopup, signOut } from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  ADMIN_PRIMARY_EMAIL,
  ENQUIRIES_COLLECTION,
  HOMEPAGE_COLLECTION,
  HOMEPAGE_DOC_ID,
  HOMEPAGE_DOC_PATH,
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isFirebaseConfigured,
} from '../firebase';
import { AdmissionEnquiry, EnquiryStatus, InstituteData } from '../types';

const MAX_FIRESTORE_DOC_BYTES = 900_000;

export class PayloadTooLargeError extends Error {
  constructor(byteSize: number) {
    super(
      `Site content size (${Math.round(byteSize / 1024)} KB) exceeds Firestore's safe ~900 KB document limit. Please use image/video URLs instead of large embedded files.`
    );
    this.name = 'PayloadTooLargeError';
  }
}

function stripUndefinedDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
      if (val !== undefined) {
        out[key] = stripUndefinedDeep(val);
      }
    }
    return out as T;
  }
  return input;
}

export function extractPublicSiteContent(data: InstituteData) {
  return stripUndefinedDeep({
    branding: data.branding,
    hero: data.hero,
    portals: data.portals.slice(0, 10),
    campusShowcase: data.campusShowcase,
    features: data.features.slice(0, 20),
    contact: data.contact,
    courses: data.courses.slice(0, 50),
    gallery: data.gallery.slice(0, 100),
    reviews: data.reviews.slice(0, 100),
    notices: data.notices.slice(0, 50),
    customSections: data.customSections.slice(0, 30),
    certificates: data.certificates.slice(0, 200),
  });
}

export async function checkIsCloudAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) return false;
  if (user.email?.toLowerCase() === ADMIN_PRIMARY_EMAIL) {
    return true;
  }
  if (!db) return false;
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists();
  } catch {
    return false;
  }
}

export function isPrimaryTokenAdmin(user: User | null): boolean {
  return Boolean(
    user && user.emailVerified && user.email?.toLowerCase() === ADMIN_PRIMARY_EMAIL
  );
}

export async function signInAdminWithGoogle(): Promise<{
  user: User;
  isAuthorizedAdmin: boolean;
}> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      'Firebase environment variables (VITE_FIREBASE_*) are not configured for this deployment.'
    );
  }
  const credential = await signInWithPopup(auth, googleProvider);
  const isAuthorizedAdmin = await checkIsCloudAdmin(credential.user);
  return { user: credential.user, isAuthorizedAdmin };
}

export async function signOutAdminGoogle(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export async function saveHomepageToFirestore(data: InstituteData): Promise<void> {
  if (!isFirebaseConfigured || !db || !auth) return;
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sign in with your Google Admin account to save changes to the cloud.');
  }

  const publicFields = extractPublicSiteContent(data);
  const payloadByteSize = new Blob([JSON.stringify(publicFields)]).size;
  if (payloadByteSize > MAX_FIRESTORE_DOC_BYTES) {
    throw new PayloadTooLargeError(payloadByteSize);
  }

  const payload = {
    ...publicFields,
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  };

  try {
    await setDoc(doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_DOC_ID), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, HOMEPAGE_DOC_PATH);
  }
}

export async function createEnquiryInFirestore(record: AdmissionEnquiry): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  const cleanDigits = record.mobile.replace(/\D/g, '');
  const trimmedName = record.name.trim().slice(0, 120);
  if (cleanDigits.length < 10 || cleanDigits.length > 15 || trimmedName.length < 2) {
    return;
  }

  const sanitizedId = record.id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128) || `enq-${Date.now()}`;
  const cleanMessage = record.message?.trim().slice(0, 600);

  const payload: Record<string, string> = {
    id: sanitizedId,
    name: trimmedName,
    mobile: cleanDigits,
    course: (record.course.trim() || 'General Enquiry').slice(0, 160),
    preferredTiming: (record.preferredTiming.trim() || 'Flexible').slice(0, 80),
    type: record.type === 'Demo' ? 'Demo' : 'Enroll',
    submittedAt: record.submittedAt.slice(0, 40),
    status: 'New',
  };

  if (cleanMessage) {
    payload.message = cleanMessage;
  }

  const path = `${ENQUIRIES_COLLECTION}/${sanitizedId}`;
  try {
    await setDoc(doc(db, ENQUIRIES_COLLECTION, sanitizedId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateEnquiryStatusInFirestore(
  enquiryId: string,
  status: EnquiryStatus
): Promise<void> {
  if (!isFirebaseConfigured || !db || !auth?.currentUser) return;
  const path = `${ENQUIRIES_COLLECTION}/${enquiryId}`;
  try {
    await updateDoc(doc(db, ENQUIRIES_COLLECTION, enquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEnquiryInFirestore(enquiryId: string): Promise<void> {
  if (!isFirebaseConfigured || !db || !auth?.currentUser) return;
  const path = `${ENQUIRIES_COLLECTION}/${enquiryId}`;
  try {
    await deleteDoc(doc(db, ENQUIRIES_COLLECTION, enquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
