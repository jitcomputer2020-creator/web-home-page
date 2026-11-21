import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Image as ImageIcon,
  Inbox,
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
  CourseCategory,
  EnquiryStatus,
  GalleryCategory,
  GalleryItem,
  GoogleReview,
  InstituteData,
  NoticeItem,
} from '../types';
import { buildWhatsAppUrl, compressImageFile } from '../utils/storage';

interface AdminPanelProps {
  isOpen: boolean;
  data: InstituteData;
  onUpdateData: (updater: (prev: InstituteData) => InstituteData) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

type AdminTab =
  | 'media'
  | 'reviews'
  | 'notices'
  | 'courses'
  | 'enquiries'
  | 'certificates';

const COURSE_CATEGORIES: CourseCategory[] = [
  'Basic & Office',
  'Tally & GST',
  'Web & AI',
  'Share Market Trading',
];

const GALLERY_CATEGORIES: GalleryCategory[] = ['Classroom', 'Events', 'Students'];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  data,
  onUpdateData,
  onResetDefaults,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('media');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Media & Hero states
  const [heroUrlInput, setHeroUrlInput] = useState(data.heroImageUrl);
  const [galImageUrl, setGalImageUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>('Classroom');
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Review states
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revCourse, setRevCourse] = useState('');
  const [revDate, setRevDate] = useState('November 2026');
  const [revText, setRevText] = useState('');

  // Notice states
  const [newNoticeText, setNewNoticeText] = useState('');
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [editingNoticeText, setEditingNoticeText] = useState('');

  // Course states
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<CourseCategory>('Basic & Office');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseSummary, setCourseSummary] = useState('');
  const [courseModulesText, setCourseModulesText] = useState('');

  // Certificate states
  const [certId, setCertId] = useState('');
  const [certStudent, setCertStudent] = useState('');
  const [certCourse, setCertCourse] = useState(data.courses[0]?.title ?? '');
  const [certGrade, setCertGrade] = useState('Grade A+');
  const [certDate, setCertDate] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusFeedback(msg);
    window.setTimeout(() => {
      setStatusFeedback((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // --- Media & Hero Handlers ---
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 1440, 0.82);
      setHeroUrlInput(compressed);
      onUpdateData((prev) => ({ ...prev, heroImageUrl: compressed }));
      showToast('Hero cover photo uploaded and saved.');
    } catch {
      showToast('Unable to process selected image file.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSaveHeroUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroUrlInput.trim()) return;
    onUpdateData((prev) => ({ ...prev, heroImageUrl: heroUrlInput.trim() }));
    showToast('Hero banner URL updated.');
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 1200, 0.8);
      setGalImageUrl(compressed);
      showToast('Image ready — enter a caption and click Add Photo.');
    } catch {
      showToast('Could not read the uploaded image.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galImageUrl.trim() || !galCaption.trim()) {
      showToast('Please provide both an image (upload or URL) and a caption.');
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

  const handleDeleteGalleryItem = (id: string) => {
    onUpdateData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
    showToast('Gallery photo removed.');
  };

  // --- Reviews Handlers ---
  const resetReviewForm = () => {
    setEditingReviewId(null);
    setRevName('');
    setRevRating(5);
    setRevCourse('');
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

  // --- Notices Handlers ---
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeText.trim()) return;
    const item: NoticeItem = {
      id: `notice-${Date.now()}`,
      text: newNoticeText.trim(),
      active: true,
    };
    onUpdateData((prev) => ({ ...prev, notices: [item, ...prev.notices] }));
    setNewNoticeText('');
    showToast('Live notice published.');
  };

  const handleSaveEditedNotice = (id: string) => {
    if (!editingNoticeText.trim()) return;
    onUpdateData((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === id ? { ...n, text: editingNoticeText.trim() } : n
      ),
    }));
    setEditingNoticeId(null);
    setEditingNoticeText('');
    showToast('Notice updated.');
  };

  // --- Courses Handlers ---
  const resetCourseForm = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseCategory('Basic & Office');
    setCourseDuration('');
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
                category: courseCategory,
                duration: courseDuration.trim(),
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
        category: courseCategory,
        duration: courseDuration.trim(),
        summary: courseSummary.trim(),
        modules: parsedModules.length > 0 ? parsedModules : ['Practical Lab Training'],
      };
      onUpdateData((prev) => ({ ...prev, courses: [...prev.courses, newCourse] }));
      showToast('New course added to catalog.');
    }
    resetCourseForm();
  };

  const startEditCourse = (c: Course) => {
    setEditingCourseId(c.id);
    setCourseTitle(c.title);
    setCourseCategory(c.category);
    setCourseDuration(c.duration);
    setCourseSummary(c.summary);
    setCourseModulesText(c.modules.join('\n'));
  };

  // --- Enquiries Handlers ---
  const handleEnquiryStatus = (id: string, status: EnquiryStatus) => {
    onUpdateData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.map((enq) =>
        enq.id === id ? { ...enq, status } : enq
      ),
    }));
    showToast(`Enquiry marked as ${status}.`);
  };

  // --- Certificates Handlers ---
  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedId = certId.trim().toUpperCase();
    if (!normalizedId || !certStudent.trim() || !certCourse.trim() || !certGrade.trim()) {
      return;
    }
    const newCert: CertificateRecord = {
      id: normalizedId,
      studentName: certStudent.trim(),
      course: certCourse.trim(),
      grade: certGrade.trim(),
      issueDate: certDate.trim() || new Date().toLocaleDateString('en-GB', {
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
    showToast(`Certificate ${normalizedId} added.`);
  };

  const TABS: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'media', label: 'Media & Hero', icon: ImageIcon },
    { id: 'reviews', label: 'Google Reviews', icon: Star },
    { id: 'notices', label: 'Live Notices', icon: Megaphone },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'enquiries', label: `Enquiries (${data.enquiries.length})`, icon: Inbox },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="JIT Admin Control Panel"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6"
    >
      <div className="w-full max-w-6xl h-[92vh] rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Admin Header */}
        <div className="bg-blue-950 text-white px-5 py-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight">
              JIT Admin Control Panel
            </h2>
            <p className="text-xs text-blue-200">
              Changes persist automatically in browser storage
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {statusFeedback && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 mr-2">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                {statusFeedback}
              </span>
            )}

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-800 text-xs font-medium text-blue-200 hover:bg-blue-900 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onResetDefaults();
                    setConfirmReset(false);
                    setHeroUrlInput(DEFAULT_HERO_IMAGE);
                    showToast('All institute data restored to defaults.');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Confirm Reset
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
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
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-700 hover:bg-white hover:text-blue-950'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-white">
          {statusFeedback && (
            <div className="md:hidden mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800">
              {statusFeedback}
            </div>
          )}

          {/* TAB 1: MEDIA & HERO */}
          {activeTab === 'media' && (
            <div className="space-y-10">
              {/* Hero Cover Photo Manager */}
              <div className="rounded-xl border border-slate-200 p-5 sm:p-6 bg-slate-50/50">
                <h3 className="font-display font-bold text-lg text-blue-950 mb-1">
                  Hero Banner Cover Photo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-5">
                  Upload a photo directly from your device or paste an image URL for the main Hero section.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 aspect-[16/10]">
                    <img
                      src={data.heroImageUrl}
                      alt="Current Hero Cover Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        <span>{uploadingMedia ? 'Processing Image...' : 'Upload Hero Photo from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroFileUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <form onSubmit={handleSaveHeroUrl} className="space-y-2">
                      <label htmlFor="hero-url-field" className="block text-xs font-semibold text-slate-700">
                        Or Paste Cover Image URL
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          id="hero-url-field"
                          type="text"
                          value={heroUrlInput}
                          onChange={(e) => setHeroUrlInput(e.target.value)}
                          placeholder="https://example.com/campus-photo.jpg"
                          className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                        />
                        <button
                          type="submit"
                          className="min-h-[42px] px-4 py-2 rounded-lg border border-blue-900 text-blue-900 hover:bg-blue-50 text-sm font-semibold cursor-pointer whitespace-nowrap"
                        >
                          Apply URL
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHeroUrlInput(DEFAULT_HERO_IMAGE);
                            onUpdateData((prev) => ({
                              ...prev,
                              heroImageUrl: DEFAULT_HERO_IMAGE,
                            }));
                            showToast('Restored default Hero cover image.');
                          }}
                          className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer whitespace-nowrap"
                        >
                          Use Default
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Gallery Upload & Manager */}
              <div>
                <h3 className="font-display font-bold text-lg text-blue-950 mb-4">
                  Upload Photo to Institute Gallery
                </h3>

                <form
                  onSubmit={handleAddGalleryItem}
                  className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-4 mb-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Upload Photo from Device
                      </label>
                      <label className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-dashed border-blue-800 bg-white hover:bg-blue-50/50 text-blue-900 text-sm font-semibold cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        <span>{uploadingMedia ? 'Processing...' : 'Select Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryFileUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    <div>
                      <label htmlFor="gal-url" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Or Image URL / Data Preview
                      </label>
                      <input
                        id="gal-url"
                        type="text"
                        value={galImageUrl}
                        onChange={(e) => setGalImageUrl(e.target.value)}
                        placeholder="https://... or upload file on left"
                        className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                    <div className="sm:col-span-4">
                      <label htmlFor="gal-cat" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Category
                      </label>
                      <select
                        id="gal-cat"
                        value={galCategory}
                        onChange={(e) => setGalCategory(e.target.value as GalleryCategory)}
                        className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                      >
                        {GALLERY_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-5">
                      <label htmlFor="gal-caption" className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Photo Caption
                      </label>
                      <input
                        id="gal-caption"
                        type="text"
                        value={galCaption}
                        onChange={(e) => setGalCaption(e.target.value)}
                        placeholder="e.g. Tally Prime afternoon lab session"
                        className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        <span>Add Photo</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Existing Gallery List */}
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
                          <p className="text-sm font-medium text-blue-950 truncate">
                            {item.caption}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryItem(item.id)}
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
            </div>
          )}

          {/* TAB 2: GOOGLE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveReview}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-blue-950">
                    {editingReviewId ? 'Edit Google Review' : 'Add New Google Review'}
                  </h3>
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={resetReviewForm}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reviewer Name
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
                    <input
                      type="text"
                      required
                      value={revCourse}
                      onChange={(e) => setRevCourse(e.target.value)}
                      placeholder="e.g. Tally Prime with GST"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Star Rating (1–5)
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
                      placeholder="November 2026"
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
                    placeholder="Authentic student feedback..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingReviewId ? 'Save Review Changes' : 'Publish Review'}</span>
                </button>
              </form>

              <div className="space-y-3">
                {data.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-blue-950">
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

          {/* TAB 3: LIVE NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddNotice}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  required
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  placeholder="Enter scrolling ticker announcement (new batch, exam schedule, holiday)..."
                  className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                />
                <button
                  type="submit"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Notice
                </button>
              </form>

              <div className="space-y-3">
                {data.notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {editingNoticeId === notice.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={editingNoticeText}
                          onChange={(e) => setEditingNoticeText(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEditedNotice(notice.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNoticeId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p
                        className={`text-sm flex-1 ${
                          notice.active ? 'text-slate-900 font-medium' : 'text-slate-400 line-through'
                        }`}
                      >
                        {notice.text}
                      </p>
                    )}

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
                        onClick={() => {
                          setEditingNoticeId(notice.id);
                          setEditingNoticeText(notice.text);
                        }}
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

          {/* TAB 4: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveCourse}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-blue-950">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g. Tally Prime Expert"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value as CourseCategory)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {COURSE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
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
                      placeholder="e.g. 4 Months"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Summary
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={courseSummary}
                      onChange={(e) => setCourseSummary(e.target.value)}
                      placeholder="Concise course overview..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Key Modules (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={courseModulesText}
                      onChange={(e) => setCourseModulesText(e.target.value)}
                      placeholder={'Company Creation & Ledgers\nGST Billing & GSTR-1\nBank Reconciliation'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
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
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-semibold text-amber-700">{c.category}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{c.duration}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-blue-950">{c.title}</h4>
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
                          showToast('Course removed.');
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

          {/* TAB 5: ADMISSION ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-blue-950">
                  Admission Enquiry Inbox
                </h3>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  Total: {data.enquiries.length}
                </span>
              </div>

              {data.enquiries.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
                  <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" aria-hidden="true" />
                  <p className="font-display font-semibold text-blue-950">
                    No admission enquiries received yet
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Submissions from the Online Admission Form appear here automatically.
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
                          <span className="font-display font-bold text-base text-blue-950">
                            {enq.name}
                          </span>
                          <span className="font-mono text-sm text-blue-900 tabular-nums">
                            {enq.mobile}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500 tabular-nums">
                            {new Date(enq.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          <strong className="font-semibold">{enq.course}</strong> ·{' '}
                          {enq.preferredTiming}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <select
                          aria-label={`Status for ${enq.name}`}
                          value={enq.status}
                          onChange={(e) =>
                            handleEnquiryStatus(enq.id, e.target.value as EnquiryStatus)
                          }
                          className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Enrolled">Enrolled</option>
                        </select>

                        <a
                          href={buildWhatsAppUrl(
                            `Hello ${enq.name}, regarding your admission enquiry at JIT Computer for ${enq.course} (${enq.preferredTiming}).`
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
                            showToast('Enquiry deleted.');
                          }}
                          className="p-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                          aria-label={`Delete enquiry from ${enq.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-8">
              <form
                onSubmit={handleAddCertificate}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <h3 className="font-display font-bold text-lg text-blue-950">
                  Add Verified Certificate ID
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Certificate ID
                    </label>
                    <input
                      type="text"
                      required
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="JIT-2026-0215"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      required
                      value={certStudent}
                      onChange={(e) => setCertStudent(e.target.value)}
                      placeholder="Full Name"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Course Completed
                    </label>
                    <input
                      type="text"
                      required
                      value={certCourse}
                      onChange={(e) => setCertCourse(e.target.value)}
                      placeholder="Course Name"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Grade / Score
                    </label>
                    <input
                      type="text"
                      required
                      value={certGrade}
                      onChange={(e) => setCertGrade(e.target.value)}
                      placeholder="Grade A+ (95%)"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="20 Nov 2026"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Verified Record
                </button>
              </form>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Certificate ID</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Grade</th>
                      <th className="px-4 py-3">Issue Date</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-mono font-semibold text-blue-950 tabular-nums whitespace-nowrap">
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
                              showToast('Certificate record removed.');
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
          )}
        </div>
      </div>
    </div>
  );
};
