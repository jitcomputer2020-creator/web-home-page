/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { CourseModal } from './components/CourseModal';
import { CoursesSection } from './components/CoursesSection';
import { CustomSectionsRenderer } from './components/CustomSectionsRenderer';
import { DemoBookingModal } from './components/DemoBookingModal';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NoticeBoardSection } from './components/NoticeBoardSection';
import { NoticeTicker } from './components/NoticeTicker';
import { ReviewsSection } from './components/ReviewsSection';
import { VerifyAndAdmissionSection } from './components/VerifyAndAdmissionSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { AdmissionEnquiry, Course, InstituteData } from './types';
import {
  buildStructuredInquiryMessage,
  buildWhatsAppUrl,
  loadInstituteData,
  resetInstituteData,
  saveInstituteData,
} from './utils/storage';

export default function App() {
  const [data, setData] = useState<InstituteData>(() => loadInstituteData());
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

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

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const updateData = useCallback((updater: (prev: InstituteData) => InstituteData) => {
    setData((prev) => updater(prev));
  }, []);

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

  const handleResetDefaults = useCallback(() => {
    const fresh = resetInstituteData();
    setData(fresh);
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
          onOpenDemoModal={() => setDemoModalOpen(true)}
        />
        <CustomSectionsRenderer sections={data.customSections} placement="after-hero" />

        <WhyChooseSection features={data.features} />

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
      </main>

      <Footer
        branding={data.branding}
        contact={data.contact}
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
        onUpdateData={updateData}
        onImportData={(imported) => setData(imported)}
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
