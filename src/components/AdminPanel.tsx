import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Download,
  Image as ImageIcon,
  Inbox,
  LayoutTemplate,
  LogOut,
  Megaphone,
  MessageCircle,
  Pencil,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { DEFAULT_HERO_IMAGE } from '../data/defaultData';
import {
  CertificateRecord,
  Course,
  EnquiryStatus,
  GalleryCategory,
  GalleryItem,
  GoogleReview,
  InstituteData,
  NoticeBadge,
  NoticeItem,
} from '../types';
import {
  buildWhatsAppUrl,
  compressImageFile,
  validateImportedData,
} from '../utils/storage';

interface AdminPanelProps {
  isOpen: boolean;
  data: InstituteData;
  onUpdateData: (updater: (prev: InstituteData) => InstituteData) => void;
  onImportData: (imported: InstituteData) => void;
  onResetDefaults: () => void;
  onClose: () => void;
  onLogout: () => void;
}

type AdminTab =
  | 'hero'
  | 'courses'
  | 'notices'
  | 'gallery'
  | 'reviews'
  | 'inquiries';

const GALLERY_CATEGORIES: GalleryCategory[] = ['Classroom', 'Events', 'Students'];
const NOTICE_BADGES: NoticeBadge[] = ['New', 'Exam', 'Batch', 'Holiday'];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  data,
  onUpdateData,
  onImportData,
  onResetDefaults,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Hero & Contact form state
  const [heroHeadline, setHeroHeadline] = useState(data.hero.headline);
  const [heroSubheadline, setHeroSubheadline] = useState(data.hero.subheadline);
  const [heroUrlInput, setHeroUrlInput] = useState(data.hero.heroImageUrl);
  const [contactPhone, setContactPhone] = useState(data.contact.phone);
  const [contactEmail, setContactEmail] = useState(data.contact.email);
  const [contactAddress, setContactAddress] = useState(data.contact.address);
  const [contactTimings, setContactTimings] = useState(data.contact.timings);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Courses state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Computer & Coding');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseFee, setCourseFee] = useState('Contact for Fee Details');
  const [courseSummary, setCourseSummary] = useState('');
  const [courseModulesText, setCourseModulesText] = useState('');

  // Notice Board state
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDate, setNoticeDate] = useState('Today');
  const [noticeBadge, setNoticeBadge] = useState<NoticeBadge>('New');

  // Photo Gallery state
  const [galImageUrl, setGalImageUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>('Classroom');

  // Reviews state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revCourse, setRevCourse] = useState(data.courses[0]?.title ?? '');
  const [revDate, setRevDate] = useState('November 2026');
  const [revText, setRevText] = useState('');

  // Certificates state
  const [certId, setCertId] = useState('');
  const [certStudent, setCertStudent] = useState('');
  const [certCourse, setCertCourse] = useState(data.courses[0]?.title ?? '');
  const [certGrade, setCertGrade] = useState('Grade A+');
  const [certDate, setCertDate] = useState('');

  useEffect(() => {
    setHeroHeadline(data.hero.headline);
    setHeroSubheadline(data.hero.subheadline);
    setHeroUrlInput(data.hero.heroImageUrl);
    setContactPhone(data.contact.phone);
    setContactEmail(data.contact.email);
    setContactAddress(data.contact.address);
    setContactTimings(data.contact.timings);
  }, [data.hero, data.contact]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusFeedback(msg);
    window.setTimeout(() => {
      setStatusFeedback((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // --- JSON Export / Import ---
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jit-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Settings exported as JSON backup.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      const validated = validateImportedData(content);
      if (!validated) {
        showToast('Invalid JSON backup file.');
        return;
      }
      onImportData(validated);
      showToast('Settings imported and applied live.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Hero & Contact Handlers ---
  const handleSaveHeroAndContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData((prev) => ({
      ...prev,
      hero: {
        headline: heroHeadline.trim() || prev.hero.headline,
        subheadline: heroSubheadline.trim() || prev.hero.subheadline,
        heroImageUrl: heroUrlInput.trim() || DEFAULT_HERO_IMAGE,
      },
      contact: {
        phone: contactPhone.trim() || prev.contact.phone,
        email: contactEmail.trim() || prev.contact.email,
        address: contactAddress.trim() || prev.contact.address,
        timings: contactTimings.trim() || prev.contact.timings,
      },
    }));
    showToast('Hero & Contact details saved.');
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 1440, 0.82);
      setHeroUrlInput(compressed);
      onUpdateData((prev) => ({
        ...prev,
        hero: { ...prev.hero, heroImageUrl: compressed },
      }));
      showToast('Hero image uploaded (base64) and saved.');
    } catch {
      showToast('Unable to process selected image file.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  // --- Courses Handlers ---
  const resetCourseForm = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseCategory('Computer & Coding');
    setCourseDuration('');
    setCourseFee('Contact for Fee Details');
    setCourseSummary('');
    setCourseModulesText('');
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDuration.trim() || !courseSummary.trim()) return;
    const parsedModules = courseModulesText
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean);

    if (editingCourseId) {
      onUpdateData((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === editingCourseId
            ? {
                ...c,
                title: courseTitle.trim(),
                category: courseCategory.trim() || 'Specialized Program',
                duration: courseDuration.trim(),
                fee: courseFee.trim() || 'Contact for Fee Details',
                summary: courseSummary.trim(),
                modules: parsedModules.length > 0 ? parsedModules : ['Practical Lab Training'],
              }
            : c
        ),
      }));
      showToast('Course updated.');
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseTitle.trim(),
        category: courseCategory.trim() || 'Specialized Program',
        duration: courseDuration.trim(),
        fee: courseFee.trim() || 'Contact for Fee Details',
        summary: courseSummary.trim(),
        modules: parsedModules.length > 0 ? parsedModules : ['Practical Lab Training'],
      };
      onUpdateData((prev) => ({ ...prev, courses: [...prev.courses, newCourse] }));
      showToast('New course added.');
    }
    resetCourseForm();
  };

  const startEditCourse = (c: Course) => {
    setEditingCourseId(c.id);
    setCourseTitle(c.title);
    setCourseCategory(c.category);
    setCourseDuration(c.duration);
    setCourseFee(c.fee);
    setCourseSummary(c.summary);
    setCourseModulesText(c.modules.join('\n'));
  };

  // --- Notice Board Handlers ---
  const resetNoticeForm = () => {
    setEditingNoticeId(null);
    setNoticeTitle('');
    setNoticeDate('Today');
    setNoticeBadge('New');
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    if (editingNoticeId) {
      onUpdateData((prev) => ({
        ...prev,
        notices: prev.notices.map((n) =>
          n.id === editingNoticeId
            ? {
                ...n,
                title: noticeTitle.trim(),
                date: noticeDate.trim() || 'Recent',
                badge: noticeBadge,
              }
            : n
        ),
      }));
      showToast('Notice updated.');
    } else {
      const item: NoticeItem = {
        id: `notice-${Date.now()}`,
        title: noticeTitle.trim(),
        date: noticeDate.trim() || 'Recent',
        badge: noticeBadge,
        active: true,
      };
      onUpdateData((prev) => ({ ...prev, notices: [item, ...prev.notices] }));
      showToast('Notice published.');
    }
    resetNoticeForm();
  };

  const startEditNotice = (n: NoticeItem) => {
    setEditingNoticeId(n.id);
    setNoticeTitle(n.title);
    setNoticeDate(n.date);
    setNoticeBadge(n.badge);
  };

  // --- Gallery Handlers ---
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 1200, 0.8);
      setGalImageUrl(compressed);
      showToast('Image converted — add a caption and click Add Photo.');
    } catch {
      showToast('Could not process selected image.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImageUrl.trim() || !galCaption.trim()) {
      showToast('Provide an image (URL or upload) and caption.');
      return;
    }
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      imageUrl: galImageUrl.trim(),
      caption: galCaption.trim(),
      category: galCategory,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    onUpdateData((prev) => ({ ...prev, gallery: [newItem, ...prev.gallery] }));
    setGalImageUrl('');
    setGalCaption('');
    showToast('Photo added to gallery.');
  };

  // --- Reviews Handlers ---
  const resetReviewForm = () => {
    setEditingReviewId(null);
    setRevName('');
    setRevRating(5);
    setRevCourse(data.courses[0]?.title ?? '');
    setRevDate('November 2026');
    setRevText('');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revCourse.trim() || !revText.trim()) return;

    if (editingReviewId) {
      onUpdateData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === editingReviewId
            ? {
                ...r,
                reviewerName: revName.trim(),
                rating: revRating,
                courseTaken: revCourse.trim(),
                dateLabel: revDate.trim() || 'Recent',
                reviewText: revText.trim(),
              }
            : r
        ),
      }));
      showToast('Review updated.');
    } else {
      const newRev: GoogleReview = {
        id: `rev-${Date.now()}`,
        reviewerName: revName.trim(),
        rating: revRating,
        courseTaken: revCourse.trim(),
        dateLabel: revDate.trim() || 'Recent',
        reviewText: revText.trim(),
      };
      onUpdateData((prev) => ({ ...prev, reviews: [newRev, ...prev.reviews] }));
      showToast('Google review added.');
    }
    resetReviewForm();
  };

  const startEditReview = (review: GoogleReview) => {
    setEditingReviewId(review.id);
    setRevName(review.reviewerName);
    setRevRating(review.rating);
    setRevCourse(review.courseTaken);
    setRevDate(review.dateLabel);
    setRevText(review.reviewText);
  };

  // --- Enquiries & Certificates ---
  const handleEnquiryStatus = (id: string, status: EnquiryStatus) => {
    onUpdateData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.map((enq) =>
        enq.id === id ? { ...enq, status } : enq
      ),
    }));
    showToast(`Inquiry marked as ${status}.`);
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedId = certId.trim().toUpperCase();
    if (!normalizedId || !certStudent.trim() || !certCourse.trim() || !certGrade.trim()) return;

    const newCert: CertificateRecord = {
      id: normalizedId,
      studentName: certStudent.trim(),
      course: certCourse.trim(),
      grade: certGrade.trim(),
      issueDate:
        certDate.trim() ||
        new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    };
    onUpdateData((prev) => ({
      ...prev,
      certificates: [
        newCert,
        ...prev.certificates.filter((c) => c.id.toUpperCase() !== normalizedId),
      ],
    }));
    setCertId('');
    setCertStudent('');
    setCertDate('');
    showToast(`Certificate ${normalizedId} saved.`);
  };

  const TABS: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'hero', label: 'Hero & Contact', icon: LayoutTemplate },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'notices', label: 'Notice Board', icon: Megaphone },
    { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Google Reviews', icon: Star },
    { id: 'inquiries', label: `Inquiries (${data.enquiries.length})`, icon: Inbox },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="JIT Admin CMS Editor"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5"
    >
      <div className="w-full max-w-6xl h-[92vh] rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Admin Header */}
        <div className="bg-[#0A2463] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight">
              JIT Admin CMS Dashboard
            </h2>
            <p className="text-xs text-blue-200">
              All changes save automatically to localStorage · Export JSON to sync across devices
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statusFeedback && (
              <span className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 mr-1">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                {statusFeedback}
              </span>
            )}

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 border border-blue-700 text-xs font-semibold text-white cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
              <span>Export Settings (JSON)</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 border border-blue-700 text-xs font-semibold text-white cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
              <span>Import Settings (JSON)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportJson}
                className="sr-only"
              />
            </label>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-800 text-xs font-medium text-blue-200 hover:bg-blue-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    onResetDefaults();
                    setConfirmReset(false);
                    showToast('Restored default institute data.');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F59E0B] text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1.5 rounded-lg border border-blue-700 text-xs text-blue-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <span>View Site</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Lock Admin Session"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-800 text-blue-200 hover:bg-rose-900/60 hover:text-white text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 py-2.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0A2463] text-white'
                      : 'text-slate-700 hover:bg-white hover:text-[#0A2463]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-white">
          {statusFeedback && (
            <div className="lg:hidden mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800">
              {statusFeedback}
            </div>
          )}

          {/* TAB 1: HERO & CONTACT */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveHeroAndContact} className="space-y-8">
              <div className="rounded-xl border border-slate-200 p-5 sm:p-6 bg-slate-50/50 space-y-5">
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Hero Section Content &amp; Visual
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Headline
                      </label>
                      <input
                        type="text"
                        required
                        value={heroHeadline}
                        onChange={(e) => setHeroHeadline(e.target.value)}
                        className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Subheadline
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={heroSubheadline}
                        onChange={(e) => setHeroSubheadline(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hero Image URL or Base64
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={heroUrlInput}
                          onChange={(e) => setHeroUrlInput(e.target.value)}
                          className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroFileUpload}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Hero Image Preview</p>
                    <div className="aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                      <img
                        src={heroUrlInput || DEFAULT_HERO_IMAGE}
                        alt="Hero preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 sm:p-6 bg-slate-50/50 space-y-4">
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Contact &amp; Footer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institute Address
                    </label>
                    <input
                      type="text"
                      required
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institute Timings
                    </label>
                    <input
                      type="text"
                      required
                      value={contactTimings}
                      onChange={(e) => setContactTimings(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
              >
                Save Hero &amp; Contact Settings
              </button>
            </form>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveCourse}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#0A2463]">
                    {editingCourseId ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  {editingCourseId && (
                    <button
                      type="button"
                      onClick={resetCourseForm}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. Basic & Advance Computer Application"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      placeholder="e.g. Computer & Coding"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="e.g. 6 Months"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fee Label
                    </label>
                    <input
                      type="text"
                      value={courseFee}
                      onChange={(e) => setCourseFee(e.target.value)}
                      placeholder="e.g. Contact for Fee Details"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={courseSummary}
                      onChange={(e) => setCourseSummary(e.target.value)}
                      placeholder="Brief program summary..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Syllabus Points (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={courseModulesText}
                      onChange={(e) => setCourseModulesText(e.target.value)}
                      placeholder={'MS Office & Excel\nTally Prime with GST\nCoding Fundamentals'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingCourseId ? 'Save Course Changes' : 'Add Course'}</span>
                </button>
              </form>

              <div className="space-y-3">
                {data.courses.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-semibold text-amber-700">{c.category}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{c.duration}</span>
                        <span>·</span>
                        <span>{c.fee}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-[#0A2463]">{c.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{c.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditCourse(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateData((prev) => ({
                            ...prev,
                            courses: prev.courses.filter((item) => item.id !== c.id),
                          }));
                          showToast('Course deleted.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NOTICE BOARD */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveNotice}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#0A2463]">
                    {editingNoticeId ? 'Edit Notice' : 'Add Notice Board Update'}
                  </h3>
                  {editingNoticeId && (
                    <button
                      type="button"
                      onClick={resetNoticeForm}
                      className="text-xs text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Notice Title / Announcement
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="New batch starting Monday..."
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeDate}
                      onChange={(e) => setNoticeDate(e.target.value)}
                      placeholder="25 Nov 2026"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Badge
                    </label>
                    <select
                      value={noticeBadge}
                      onChange={(e) => setNoticeBadge(e.target.value as NoticeBadge)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {NOTICE_BADGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingNoticeId ? 'Update Notice' : 'Publish Notice'}</span>
                </button>
              </form>

              <div className="space-y-3">
                {data.notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-[#0A2463]">[{notice.badge}]</span>
                        <span className="font-mono text-slate-500">{notice.date}</span>
                      </div>
                      <p
                        className={`text-sm ${
                          notice.active ? 'text-slate-900 font-medium' : 'text-slate-400 line-through'
                        }`}
                      >
                        {notice.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateData((prev) => ({
                            ...prev,
                            notices: prev.notices.map((n) =>
                              n.id === notice.id ? { ...n, active: !n.active } : n
                            ),
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          notice.active
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-slate-300 bg-slate-100 text-slate-600'
                        }`}
                      >
                        {notice.active ? 'Active' : 'Paused'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditNotice(notice)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                        aria-label="Edit notice"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateData((prev) => ({
                            ...prev,
                            notices: prev.notices.filter((n) => n.id !== notice.id),
                          }));
                          showToast('Notice deleted.');
                        }}
                        className="p-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddGalleryItem}
                className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-4"
              >
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Add Photo to Student Gallery
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Upload Local Image (Converted to Base64)
                    </label>
                    <label className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-dashed border-[#0A2463] bg-white hover:bg-blue-50/50 text-[#0A2463] text-sm font-semibold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingMedia ? 'Processing...' : 'Select Image from Device'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryFileUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Or Paste Image URL
                    </label>
                    <input
                      type="text"
                      value={galImageUrl}
                      onChange={(e) => setGalImageUrl(e.target.value)}
                      placeholder="https://... or upload file on left"
                      className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category
                    </label>
                    <select
                      value={galCategory}
                      onChange={(e) => setGalCategory(e.target.value as GalleryCategory)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {GALLERY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Caption
                    </label>
                    <input
                      type="text"
                      value={galCaption}
                      onChange={(e) => setGalCaption(e.target.value)}
                      placeholder="e.g. Teacher's Day celebration with students"
                      className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Photo</span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.gallery.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-amber-700">
                          {item.category}
                        </span>
                        <p className="text-sm font-medium text-[#0A2463] truncate">
                          {item.caption}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateData((prev) => ({
                            ...prev,
                            gallery: prev.gallery.filter((g) => g.id !== item.id),
                          }));
                          showToast('Photo removed.');
                        }}
                        aria-label={`Delete ${item.caption}`}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveReview}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#0A2463]">
                    {editingReviewId ? 'Edit Student Review' : 'Add Student Google Review'}
                  </h3>
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={resetReviewForm}
                      className="text-xs text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="Student Name"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Course Taken
                    </label>
                    <select
                      value={revCourse}
                      onChange={(e) => setRevCourse(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {data.courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Star Rating
                    </label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} Stars
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date Label
                    </label>
                    <input
                      type="text"
                      value={revDate}
                      onChange={(e) => setRevDate(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Review Text
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={revText}
                    onChange={(e) => setRevText(e.target.value)}
                    placeholder="Student feedback..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingReviewId ? 'Save Changes' : 'Publish Review'}</span>
                </button>
              </form>

              <div className="space-y-3">
                {data.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-[#0A2463]">
                        <span>{rev.reviewerName}</span>
                        <span className="text-amber-600 tabular-nums">· {rev.rating} ★</span>
                        <span className="text-xs font-normal text-slate-500">· {rev.courseTaken}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{rev.reviewText}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditReview(rev)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateData((prev) => ({
                            ...prev,
                            reviews: prev.reviews.filter((r) => r.id !== rev.id),
                          }));
                          showToast('Review deleted.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: INQUIRIES & CERTIFICATES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-10">
              {/* Inquiries */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-[#0A2463]">
                    Demo &amp; Enrollment Inquiries
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    Total: {data.enquiries.length}
                  </span>
                </div>

                {data.enquiries.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" aria-hidden="true" />
                    <p className="font-display font-semibold text-[#0A2463]">
                      No inquiries received yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="rounded-xl border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-amber-700">
                              [{enq.type}]
                            </span>
                            <span className="font-display font-bold text-base text-[#0A2463]">
                              {enq.name}
                            </span>
                            <span className="font-mono text-sm text-[#1E40AF] tabular-nums">
                              {enq.mobile}
                            </span>
                            <span className="text-xs text-slate-500 tabular-nums">
                              · {new Date(enq.submittedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            <strong className="font-semibold">{enq.course}</strong> ·{' '}
                            {enq.preferredTiming}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              handleEnquiryStatus(enq.id, e.target.value as EnquiryStatus)
                            }
                            className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Enrolled">Enrolled</option>
                          </select>

                          <a
                            href={buildWhatsAppUrl(
                              `Hello ${enq.name}, regarding your ${enq.type} inquiry at JIT Computer Training Institute for ${enq.course}.`,
                              enq.mobile
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              onUpdateData((prev) => ({
                                ...prev,
                                enquiries: prev.enquiries.filter((e) => e.id !== enq.id),
                              }));
                              showToast('Inquiry deleted.');
                            }}
                            className="p-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                            aria-label={`Delete inquiry from ${enq.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificates */}
              <div className="pt-6 border-t border-slate-200 space-y-5">
                <form
                  onSubmit={handleAddCertificate}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0A2463]" aria-hidden="true" />
                    <h3 className="font-display font-bold text-lg text-[#0A2463]">
                      Verified Certificate Records
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      type="text"
                      required
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="ID (e.g. JIT-2026-0301)"
                      className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono uppercase"
                    />
                    <input
                      type="text"
                      required
                      value={certStudent}
                      onChange={(e) => setCertStudent(e.target.value)}
                      placeholder="Student Name"
                      className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                    <select
                      value={certCourse}
                      onChange={(e) => setCertCourse(e.target.value)}
                      className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {data.courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      required
                      value={certGrade}
                      onChange={(e) => setCertGrade(e.target.value)}
                      placeholder="Grade A+ (95%)"
                      className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="Issue Date"
                      className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Certificate Record
                  </button>
                </form>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Certificate ID</th>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Grade</th>
                        <th className="px-4 py-3">Issue Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {data.certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-3 font-mono font-semibold text-[#0A2463] tabular-nums whitespace-nowrap">
                            {cert.id}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {cert.studentName}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{cert.course}</td>
                          <td className="px-4 py-3 font-semibold text-amber-700 tabular-nums whitespace-nowrap">
                            {cert.grade}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                            {cert.issueDate}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateData((prev) => ({
                                  ...prev,
                                  certificates: prev.certificates.filter((c) => c.id !== cert.id),
                                }));
                                showToast('Certificate removed.');
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                              aria-label={`Delete certificate ${cert.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
