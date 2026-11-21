/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { CoursesSection } from './components/CoursesSection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NoticeTicker } from './components/NoticeTicker';
import { ReviewsSection } from './components/ReviewsSection';
import { VerifyAndAdmissionSection } from './components/VerifyAndAdmissionSection';
import { AdmissionEnquiry, InstituteData } from './types';
import {
  loadInstituteData,
  resetInstituteData,
  saveInstituteData,
} from './utils/storage';

export default function App() {
  const [data, setData] = useState<InstituteData>(() => loadInstituteData());
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<string>('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    saveInstituteData(data);
  }, [data]);

  const updateData = useCallback((updater: (prev: InstituteData) => InstituteData) => {
    setData((prev) => updater(prev));
  }, []);

  const handleEnquireCourse = useCallback((courseTitle: string) => {
    setSelectedCourseForEnquiry(courseTitle);
    const admissionsEl = document.getElementById('admissions');
    if (admissionsEl) {
      admissionsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header onSecretAdminTrigger={() => setLoginModalOpen(true)} />
      <NoticeTicker notices={data.notices} />

      <main className="flex-1">
        <HeroSection heroImageUrl={data.heroImageUrl} />
        <CoursesSection courses={data.courses} onEnquireCourse={handleEnquireCourse} />
        <GallerySection gallery={data.gallery} />
        <ReviewsSection reviews={data.reviews} />
        <VerifyAndAdmissionSection
          certificates={data.certificates}
          courses={data.courses}
          selectedCourseForEnquiry={selectedCourseForEnquiry}
          onSubmitEnquiry={handleSubmitEnquiry}
        />
      </main>

      <Footer />
      <FloatingWhatsApp />

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onAuthenticated={() => {
          setLoginModalOpen(false);
          setAdminPanelOpen(true);
        }}
      />

      <AdminPanel
        isOpen={adminPanelOpen}
        data={data}
        onUpdateData={updateData}
        onResetDefaults={handleResetDefaults}
        onClose={() => setAdminPanelOpen(false)}
      />
    </div>
  );
}
