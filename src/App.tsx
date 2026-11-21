/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { CourseModal } from './components/CourseModal';
import { CoursesSection } from './components/CoursesSection';
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

  useEffect(() => {
    saveInstituteData(data);
  }, [data]);

  const updateData = useCallback((updater: (prev: InstituteData) => InstituteData) => {
    setData((prev) => updater(prev));
  }, []);

  const handleSubmitEnquiry = useCallback(
    (payload: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>): AdmissionEnquiry => {
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
      return record;
    },
    []
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
        onSecretAdminTrigger={handleSecretAdminTrigger}
        onOpenDemoModal={() => setDemoModalOpen(true)}
      />
      <NoticeTicker notices={data.notices} />

      <main className="flex-1">
        <HeroSection
          hero={data.hero}
          onOpenDemoModal={() => setDemoModalOpen(true)}
        />
        <WhyChooseSection />
        <CoursesSection
          courses={data.courses}
          onSelectCourseModal={(course) => setActiveCourseModal(course)}
        />
        <NoticeBoardSection notices={data.notices} />
        <GallerySection gallery={data.gallery} />
        <ReviewsSection reviews={data.reviews} />
        <VerifyAndAdmissionSection
          certificates={data.certificates}
          courses={data.courses}
          contact={data.contact}
          onSubmitEnquiry={handleSubmitEnquiry}
        />
      </main>

      <Footer
        contact={data.contact}
        onSecretAdminTrigger={handleSecretAdminTrigger}
      />

      <FloatingActions
        contactPhone={data.contact.phone}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminPanel={() => setAdminPanelOpen(true)}
      />

      <CourseModal
        course={activeCourseModal}
        contactPhone={data.contact.phone}
        onClose={() => setActiveCourseModal(null)}
        onSubmitEnquiry={handleSubmitEnquiry}
      />

      <DemoBookingModal
        isOpen={demoModalOpen}
        courses={data.courses}
        contactPhone={data.contact.phone}
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
    </div>
  );
}
