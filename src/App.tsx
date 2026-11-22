/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { MessageCircle, X } from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel, CloudSyncStatus } from './components/AdminPanel';
import { CampusShowcaseSection } from './components/CampusShowcaseSection';
import { CourseModal } from './components/CourseModal';
import { CoursesSection } from './components/CoursesSection';
import { CustomSectionsRenderer } from './components/CustomSectionsRenderer';
import { DemoBookingModal } from './components/DemoBookingModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LocationMapSection } from './components/LocationMapSection';
import { NoticeBoardSection } from './components/NoticeBoardSection';
import { NoticeTicker } from './components/NoticeTicker';
import { ReviewsSection } from './components/ReviewsSection';
import { VerifyAndAdmissionSection } from './components/VerifyAndAdmissionSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import {
  ADMIN_PRIMARY_EMAIL,
  ENQUIRIES_COLLECTION,
  HOMEPAGE_COLLECTION,
  HOMEPAGE_DOC_ID,
  HOMEPAGE_DOC_PATH,
  OperationType,
  auth,
  db,
  handleFirestoreError,
  isFirebaseConfigured,
} from './firebase';
import { AdmissionEnquiry, Course, EnquiryStatus, InstituteData } from './types';
import {
  checkIsCloudAdmin,
  createEnquiryInFirestore,
  deleteEnquiryInFirestore,
  isPrimaryTokenAdmin,
  saveHomepageToFirestore,
  signInAdminWithGoogle,
  signOutAdminGoogle,
  updateEnquiryStatusInFirestore,
} from './utils/firestoreSync';
import {
  buildStructuredInquiryMessage,
  buildWhatsAppUrl,
  loadInstituteData,
  normalizeData,
  resetInstituteData,
  saveInstituteData,
} from './utils/storage';

export default function App() {
  const [data, setData] = useState<InstituteData>(() => loadInstituteData());
  const dataRef = useRef<InstituteData>(data);
  dataRef.current = data;

  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isCloudAdmin, setIsCloudAdmin] = useState(false);
  const isCloudAdminRef = useRef(false);
  isCloudAdminRef.current = isCloudAdmin;

  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('local-only');
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  // Cache data locally for instant zero-flash startup on reload
  useEffect(() => {
    saveInstituteData(data);
  }, [data]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Track Firebase Authentication readiness and Admin privileges
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      const authorized = await checkIsCloudAdmin(user);
      setIsCloudAdmin(authorized);
      setCloudSyncStatus(authorized ? 'synced' : 'local-only');
      if (authorized) {
        setCloudSyncError(null);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Live real-time listener for public homepage CMS content
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const homepageRef = doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_DOC_ID);
    const unsubscribe = onSnapshot(
      homepageRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }
        const remote = snapshot.data() as Partial<InstituteData>;
        setData((prev) =>
          normalizeData({
            ...remote,
            enquiries: prev.enquiries,
          })
        );
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, HOMEPAGE_DOC_PATH);
        } catch (wrapped) {
          setCloudSyncError(
            wrapped instanceof Error ? wrapped.message : 'Unable to sync homepage from cloud.'
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Admin-only real-time listener for isolated student enquiries
  useEffect(() => {
    if (!isFirebaseConfigured || !authReady || !isPrimaryTokenAdmin(firebaseUser)) {
      return;
    }

    const enquiriesRef = collection(db, ENQUIRIES_COLLECTION);
    const unsubscribe = onSnapshot(
      enquiriesRef,
      (snapshot) => {
        const list: AdmissionEnquiry[] = snapshot.docs.map((docSnap) => {
          const item = docSnap.data() as Partial<AdmissionEnquiry>;
          return {
            id: item.id || docSnap.id,
            name: item.name || '',
            mobile: item.mobile || '',
            course: item.course || '',
            preferredTiming: item.preferredTiming || '',
            message: item.message,
            type: item.type === 'Demo' ? 'Demo' : 'Enroll',
            submittedAt: item.submittedAt || '',
            status:
              item.status === 'Contacted' || item.status === 'Enrolled' ? item.status : 'New',
          };
        });
        list.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
        setData((prev) => ({
          ...prev,
          enquiries: list,
        }));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, ENQUIRIES_COLLECTION);
        } catch (wrapped) {
          setCloudSyncError(
            wrapped instanceof Error ? wrapped.message : 'Unable to load cloud enquiries.'
          );
        }
      }
    );

    return () => unsubscribe();
  }, [authReady, firebaseUser]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const pushHomepageToCloud = useCallback(async (nextData: InstituteData) => {
    if (!isFirebaseConfigured || !isCloudAdminRef.current) return;
    setCloudSyncStatus('saving');
    setCloudSyncError(null);
    try {
      await saveHomepageToFirestore(nextData);
      setCloudSyncStatus('synced');
    } catch (error) {
      setCloudSyncStatus('error');
      setCloudSyncError(error instanceof Error ? error.message : 'Failed to sync changes to cloud.');
    }
  }, []);

  const updateData = useCallback(
    (updater: (prev: InstituteData) => InstituteData) => {
      const next = updater(dataRef.current);
      dataRef.current = next;
      setData(next);
      if (isCloudAdminRef.current) {
        void pushHomepageToCloud(next);
      }
    },
    [pushHomepageToCloud]
  );

  const handleImportData = useCallback(
    (imported: InstituteData) => {
      dataRef.current = imported;
      setData(imported);
      if (isCloudAdminRef.current) {
        void pushHomepageToCloud(imported);
      }
    },
    [pushHomepageToCloud]
  );

  const handleResetDefaults = useCallback(() => {
    const fresh = resetInstituteData();
    dataRef.current = fresh;
    setData(fresh);
    if (isCloudAdminRef.current) {
      void pushHomepageToCloud(fresh);
    }
  }, [pushHomepageToCloud]);

  const handleConnectCloudAdmin = useCallback(async () => {
    setCloudSyncError(null);
    try {
      const { user, isAuthorizedAdmin } = await signInAdminWithGoogle();
      setFirebaseUser(user);
      setIsCloudAdmin(isAuthorizedAdmin);
      if (!isAuthorizedAdmin) {
        setCloudSyncStatus('local-only');
        setCloudSyncError(
          `Signed in as ${user.email || 'unknown user'}. Please sign in with ${ADMIN_PRIMARY_EMAIL} to publish edits globally.`
        );
        return;
      }
      setCloudSyncStatus('saving');
      await saveHomepageToFirestore(dataRef.current);
      setCloudSyncStatus('synced');
      showToast('Connected to Cloud Firestore & synced!');
    } catch (error) {
      setCloudSyncStatus('error');
      setCloudSyncError(
        error instanceof Error ? error.message : 'Google Sign-In failed. Please allow popups.'
      );
    }
  }, [showToast]);

  const handleDisconnectCloudAdmin = useCallback(async () => {
    await signOutAdminGoogle();
    setFirebaseUser(null);
    setIsCloudAdmin(false);
    setCloudSyncStatus('local-only');
    setCloudSyncError(null);
  }, []);

  const handlePushCurrentToCloud = useCallback(async () => {
    await pushHomepageToCloud(dataRef.current);
  }, [pushHomepageToCloud]);

  const handleSubmitEnquiry = useCallback(
    (
      payload: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>
    ): { record: AdmissionEnquiry; waUrl: string } => {
      const record: AdmissionEnquiry = {
        id: `enq-${Date.now()}`,
        ...payload,
        submittedAt: new Date().toISOString(),
        status: 'New',
      };
      setData((prev) => ({
        ...prev,
        enquiries: [record, ...prev.enquiries],
      }));

      void createEnquiryInFirestore(record).catch((err) => {
        console.error('Could not persist enquiry to Firestore:', err);
      });

      const formattedMessage = buildStructuredInquiryMessage({
        name: record.name,
        phone: record.mobile,
        course: record.course,
        message: record.message,
      });

      const waUrl = buildWhatsAppUrl(formattedMessage, data.contact.whatsappNumber);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Redirecting to JIT WhatsApp...');

      return { record, waUrl };
    },
    [data.contact.whatsappNumber, showToast]
  );

  const handleUpdateEnquiryStatus = useCallback(
    (enquiryId: string, status: EnquiryStatus) => {
      setData((prev) => ({
        ...prev,
        enquiries: prev.enquiries.map((item) =>
          item.id === enquiryId ? { ...item, status } : item
        ),
      }));
      if (isCloudAdminRef.current) {
        void updateEnquiryStatusInFirestore(enquiryId, status).catch((err) => {
          setCloudSyncError(err instanceof Error ? err.message : 'Failed to update enquiry status.');
        });
      }
    },
    []
  );

  const handleDeleteEnquiry = useCallback((enquiryId: string) => {
    setData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.filter((item) => item.id !== enquiryId),
    }));
    if (isCloudAdminRef.current) {
      void deleteEnquiryInFirestore(enquiryId).catch((err) => {
        setCloudSyncError(err instanceof Error ? err.message : 'Failed to delete enquiry.');
      });
    }
  }, []);

  const handleSecretAdminTrigger = useCallback(() => {
    if (isAdminLoggedIn) {
      setAdminPanelOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  }, [isAdminLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header
        branding={data.branding}
        ctaLabel={data.hero.secondaryCtaText}
        onSecretAdminTrigger={handleSecretAdminTrigger}
        onOpenDemoModal={() => setDemoModalOpen(true)}
      />
      <NoticeTicker notices={data.notices} />

      <main className="flex-1">
        <HeroSection
          branding={data.branding}
          hero={data.hero}
          portals={data.portals}
          onOpenDemoModal={() => setDemoModalOpen(true)}
        />
        <CustomSectionsRenderer sections={data.customSections} placement="after-hero" />

        <WhyChooseSection features={data.features} />

        <CampusShowcaseSection
          campusShowcase={data.campusShowcase}
          onOpenDemoModal={() => setDemoModalOpen(true)}
        />

        <CoursesSection
          courses={data.courses}
          onSelectCourseModal={(course) => setActiveCourseModal(course)}
        />
        <CustomSectionsRenderer sections={data.customSections} placement="after-courses" />

        <NoticeBoardSection notices={data.notices} />

        <GallerySection gallery={data.gallery} />
        <CustomSectionsRenderer sections={data.customSections} placement="after-gallery" />

        <ReviewsSection reviews={data.reviews} />

        <VerifyAndAdmissionSection
          certificates={data.certificates}
          courses={data.courses}
          contact={data.contact}
          onSubmitEnquiry={handleSubmitEnquiry}
        />
        <CustomSectionsRenderer sections={data.customSections} placement="before-footer" />

        <LocationMapSection branding={data.branding} contact={data.contact} />
      </main>

      <Footer
        branding={data.branding}
        contact={data.contact}
        portals={data.portals}
        onSecretAdminTrigger={handleSecretAdminTrigger}
      />

      <FloatingActions
        whatsappNumber={data.contact.whatsappNumber}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminPanel={() => setAdminPanelOpen(true)}
      />

      <CourseModal
        course={activeCourseModal}
        courses={data.courses}
        whatsappNumber={data.contact.whatsappNumber}
        onClose={() => setActiveCourseModal(null)}
        onSubmitEnquiry={handleSubmitEnquiry}
      />

      <DemoBookingModal
        isOpen={demoModalOpen}
        courses={data.courses}
        whatsappNumber={data.contact.whatsappNumber}
        onClose={() => setDemoModalOpen(false)}
        onSubmitEnquiry={handleSubmitEnquiry}
      />

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onAuthenticated={() => {
          setLoginModalOpen(false);
          setIsAdminLoggedIn(true);
          setAdminPanelOpen(true);
        }}
      />

      <AdminPanel
        isOpen={adminPanelOpen}
        data={data}
        firebaseUserEmail={firebaseUser?.email ?? null}
        isCloudAdmin={isCloudAdmin}
        cloudSyncStatus={cloudSyncStatus}
        cloudSyncError={cloudSyncError}
        onConnectCloudAdmin={handleConnectCloudAdmin}
        onDisconnectCloudAdmin={handleDisconnectCloudAdmin}
        onPushCurrentToCloud={handlePushCurrentToCloud}
        onUpdateData={updateData}
        onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
        onDeleteEnquiry={handleDeleteEnquiry}
        onImportData={handleImportData}
        onResetDefaults={handleResetDefaults}
        onClose={() => setAdminPanelOpen(false)}
        onLogout={() => {
          setAdminPanelOpen(false);
          setIsAdminLoggedIn(false);
        }}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-4 z-[60] max-w-sm rounded-xl bg-emerald-700 text-white px-4 py-3 shadow-2xl border border-emerald-500/60 flex items-center gap-3"
        >
          <MessageCircle className="w-5 h-5 text-emerald-200 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="ml-1 p-1 rounded-md hover:bg-emerald-800 text-emerald-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
