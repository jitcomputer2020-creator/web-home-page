import React, { useEffect, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Download,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  LogOut,
  Megaphone,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Type,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { DEFAULT_HERO_IMAGE } from '../data/defaultData';
import {
  CertificateRecord,
  Course,
  CustomSectionBlock,
  CustomSectionPlacement,
  CustomSectionTheme,
  EnquiryStatus,
  FeatureIconKey,
  FeatureItem,
  GalleryCategory,
  GalleryItem,
  GoogleReview,
  InstituteData,
  MediaType,
  NoticeBadge,
  NoticeItem,
} from '../types';
import {
  buildWhatsAppUrl,
  compressImageFile,
  getYouTubeThumbnailUrl,
  readVideoFileAsDataUrl,
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
  | 'branding'
  | 'hero-media'
  | 'courses'
  | 'gallery'
  | 'notices-features'
  | 'reviews'
  | 'custom-sections'
  | 'contact';

const GALLERY_CATEGORIES: GalleryCategory[] = ['Classroom', 'Events', 'Students'];
const NOTICE_BADGES: NoticeBadge[] = ['New', 'Exam', 'Batch', 'Holiday'];
const FEATURE_ICONS: FeatureIconKey[] = [
  'Laptop',
  'Users',
  'Award',
  'Briefcase',
  'ShieldCheck',
  'TrendingUp',
  'BookOpen',
  'Globe',
];

const PLACEMENT_OPTIONS: Array<{ value: CustomSectionPlacement; label: string }> = [
  { value: 'after-hero', label: 'After Hero Section' },
  { value: 'after-courses', label: 'After Courses Section' },
  { value: 'after-gallery', label: 'After Photo & Video Gallery' },
  { value: 'before-footer', label: 'Before Footer' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  data,
  onUpdateData,
  onImportData,
  onResetDefaults,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('branding');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // 1. Branding & Texts
  const [customLogoUrl, setCustomLogoUrl] = useState(data.branding.customLogoUrl);
  const [instituteName, setInstituteName] = useState(data.branding.instituteName);
  const [instituteSubtitle, setInstituteSubtitle] = useState(data.branding.instituteSubtitle);
  const [heroHeadline, setHeroHeadline] = useState(data.hero.headline);
  const [heroSubheadline, setHeroSubheadline] = useState(data.hero.subheadline);
  const [primaryCtaText, setPrimaryCtaText] = useState(data.hero.primaryCtaText);
  const [secondaryCtaText, setSecondaryCtaText] = useState(data.hero.secondaryCtaText);
  const [trustItemsText, setTrustItemsText] = useState(data.hero.trustItems.join(' | '));

  // 2. Hero Media
  const [heroMediaType, setHeroMediaType] = useState<MediaType>(data.hero.mediaType);
  const [heroImageUrl, setHeroImageUrl] = useState(data.hero.heroImageUrl);
  const [heroVideoUrl, setHeroVideoUrl] = useState(data.hero.heroVideoUrl);
  const [heroCaption, setHeroCaption] = useState(data.hero.mediaCaption);

  // 3. Courses
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Computer & Coding');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseFee, setCourseFee] = useState('Contact for Fee Details');
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [courseSummary, setCourseSummary] = useState('');
  const [courseModulesText, setCourseModulesText] = useState('');

  // 4. Gallery
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galMediaType, setGalMediaType] = useState<MediaType>('image');
  const [galMediaUrl, setGalMediaUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galCategory, setGalCategory] = useState<GalleryCategory>('Classroom');

  // 5. Notices & Features
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDate, setNoticeDate] = useState('Today');
  const [noticeBadge, setNoticeBadge] = useState<NoticeBadge>('New');

  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [featTitle, setFeatTitle] = useState('');
  const [featDescription, setFeatDescription] = useState('');
  const [featIcon, setFeatIcon] = useState<FeatureIconKey>('Laptop');

  // 6. Reviews
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revCourse, setRevCourse] = useState(data.courses[0]?.title ?? '');
  const [revDate, setRevDate] = useState('November 2026');
  const [revText, setRevText] = useState('');

  // 7. Custom Sections
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customType, setCustomType] = useState<'text' | 'image' | 'video'>('text');
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [customCtaLabel, setCustomCtaLabel] = useState('');
  const [customCtaUrl, setCustomCtaUrl] = useState('');
  const [customPlacement, setCustomPlacement] = useState<CustomSectionPlacement>('after-courses');
  const [customTheme, setCustomTheme] = useState<CustomSectionTheme>('light');

  // 8. Contact, Footer, Inquiries & Certs
  const [contactPhone, setContactPhone] = useState(data.contact.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(data.contact.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(data.contact.email);
  const [contactAddress, setContactAddress] = useState(data.contact.address);
  const [contactTimings, setContactTimings] = useState(data.contact.timings);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(data.contact.googleMapsUrl);
  const [mapQuery, setMapQuery] = useState(data.contact.mapQuery);
  const [facebookUrl, setFacebookUrl] = useState(data.contact.facebookUrl);
  const [instagramUrl, setInstagramUrl] = useState(data.contact.instagramUrl);
  const [youtubeUrl, setYoutubeUrl] = useState(data.contact.youtubeUrl);

  const [certId, setCertId] = useState('');
  const [certStudent, setCertStudent] = useState('');
  const [certCourse, setCertCourse] = useState(data.courses[0]?.title ?? '');
  const [certGrade, setCertGrade] = useState('Grade A+');
  const [certDate, setCertDate] = useState('');

  useEffect(() => {
    setCustomLogoUrl(data.branding.customLogoUrl);
    setInstituteName(data.branding.instituteName);
    setInstituteSubtitle(data.branding.instituteSubtitle);
    setHeroHeadline(data.hero.headline);
    setHeroSubheadline(data.hero.subheadline);
    setPrimaryCtaText(data.hero.primaryCtaText);
    setSecondaryCtaText(data.hero.secondaryCtaText);
    setTrustItemsText(data.hero.trustItems.join(' | '));
    setHeroMediaType(data.hero.mediaType);
    setHeroImageUrl(data.hero.heroImageUrl);
    setHeroVideoUrl(data.hero.heroVideoUrl);
    setHeroCaption(data.hero.mediaCaption);
    setContactPhone(data.contact.phone);
    setWhatsappNumber(data.contact.whatsappNumber);
    setContactEmail(data.contact.email);
    setContactAddress(data.contact.address);
    setContactTimings(data.contact.timings);
    setGoogleMapsUrl(data.contact.googleMapsUrl);
    setMapQuery(data.contact.mapQuery);
    setFacebookUrl(data.contact.facebookUrl);
    setInstagramUrl(data.contact.instagramUrl);
    setYoutubeUrl(data.contact.youtubeUrl);
  }, [data.branding, data.hero, data.contact]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setStatusFeedback(msg);
    window.setTimeout(() => {
      setStatusFeedback((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // --- Backup Controls ---
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jit-cms-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported JSON backup.');
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
      showToast('Imported JSON backup successfully.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- Tab 1: Branding & Texts ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 512, 0.9);
      setCustomLogoUrl(compressed);
      onUpdateData((prev) => ({
        ...prev,
        branding: { ...prev.branding, customLogoUrl: compressed },
      }));
      showToast('Custom logo uploaded.');
    } catch {
      showToast('Failed to process logo image.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSaveBrandingAndTexts = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTrust = trustItemsText
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);

    onUpdateData((prev) => ({
      ...prev,
      branding: {
        customLogoUrl: customLogoUrl.trim(),
        instituteName: instituteName.trim() || prev.branding.instituteName,
        instituteSubtitle: instituteSubtitle.trim() || prev.branding.instituteSubtitle,
      },
      hero: {
        ...prev.hero,
        headline: heroHeadline.trim() || prev.hero.headline,
        subheadline: heroSubheadline.trim() || prev.hero.subheadline,
        primaryCtaText: primaryCtaText.trim() || prev.hero.primaryCtaText,
        secondaryCtaText: secondaryCtaText.trim() || prev.hero.secondaryCtaText,
        trustItems: parsedTrust.length > 0 ? parsedTrust : prev.hero.trustItems,
      },
    }));
    showToast('Branding & hero texts saved.');
  };

  // --- Tab 2: Hero Media ---
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 1440, 0.82);
      setHeroImageUrl(compressed);
      setHeroMediaType('image');
      onUpdateData((prev) => ({
        ...prev,
        hero: { ...prev.hero, mediaType: 'image', heroImageUrl: compressed },
      }));
      showToast('Hero photo uploaded & activated.');
    } catch {
      showToast('Could not process hero image.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const dataUrl = await readVideoFileAsDataUrl(file);
      setHeroVideoUrl(dataUrl);
      setHeroMediaType('video');
      onUpdateData((prev) => ({
        ...prev,
        hero: { ...prev.hero, mediaType: 'video', heroVideoUrl: dataUrl },
      }));
      showToast('Hero video uploaded & activated.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to upload video.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSaveHeroMedia = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        mediaType: heroMediaType,
        heroImageUrl: heroImageUrl.trim() || DEFAULT_HERO_IMAGE,
        heroVideoUrl: heroVideoUrl.trim(),
        mediaCaption: heroCaption.trim() || prev.hero.mediaCaption,
      },
    }));
    showToast('Hero media settings saved.');
  };

  // --- Tab 3: Courses ---
  const resetCourseForm = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseCategory('Computer & Coding');
    setCourseDuration('');
    setCourseFee('Contact for Fee Details');
    setCourseImageUrl('');
    setCourseSummary('');
    setCourseModulesText('');
  };

  const handleCourseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 960, 0.8);
      setCourseImageUrl(compressed);
      showToast('Course thumbnail ready.');
    } catch {
      showToast('Could not process course thumbnail.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
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
                category: courseCategory.trim() || 'Program',
                duration: courseDuration.trim(),
                fee: courseFee.trim() || 'Contact for Fee Details',
                imageUrl: courseImageUrl.trim() || undefined,
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
        category: courseCategory.trim() || 'Program',
        duration: courseDuration.trim(),
        fee: courseFee.trim() || 'Contact for Fee Details',
        imageUrl: courseImageUrl.trim() || undefined,
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
    setCourseImageUrl(c.imageUrl || '');
    setCourseSummary(c.summary);
    setCourseModulesText(c.modules.join('\n'));
  };

  // --- Tab 4: Photo & Video Gallery ---
  const resetGalleryForm = () => {
    setEditingGalleryId(null);
    setGalMediaType('image');
    setGalMediaUrl('');
    setGalCaption('');
    setGalCategory('Classroom');
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      if (galMediaType === 'video') {
        const videoUrl = await readVideoFileAsDataUrl(file);
        setGalMediaUrl(videoUrl);
        showToast('Video file ready — add a caption and save.');
      } else {
        const compressed = await compressImageFile(file, 1200, 0.8);
        setGalMediaUrl(compressed);
        showToast('Photo ready — add a caption and save.');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to process media file.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galMediaUrl.trim() || !galCaption.trim()) {
      showToast('Provide a media URL/file and caption.');
      return;
    }

    if (editingGalleryId) {
      onUpdateData((prev) => ({
        ...prev,
        gallery: prev.gallery.map((g) =>
          g.id === editingGalleryId
            ? {
                ...g,
                mediaType: galMediaType,
                mediaUrl: galMediaUrl.trim(),
                caption: galCaption.trim(),
                category: galCategory,
              }
            : g
        ),
      }));
      showToast('Gallery item updated.');
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        mediaType: galMediaType,
        mediaUrl: galMediaUrl.trim(),
        caption: galCaption.trim(),
        category: galCategory,
        addedAt: new Date().toISOString().slice(0, 10),
      };
      onUpdateData((prev) => ({ ...prev, gallery: [newItem, ...prev.gallery] }));
      showToast('Gallery item added.');
    }
    resetGalleryForm();
  };

  const startEditGalleryItem = (g: GalleryItem) => {
    setEditingGalleryId(g.id);
    setGalMediaType(g.mediaType);
    setGalMediaUrl(g.mediaUrl);
    setGalCaption(g.caption);
    setGalCategory(g.category);
  };

  // --- Tab 5: Notices & Features ---
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
            ? { ...n, title: noticeTitle.trim(), date: noticeDate.trim() || 'Recent', badge: noticeBadge }
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
      showToast('Notice added.');
    }
    resetNoticeForm();
  };

  const resetFeatureForm = () => {
    setEditingFeatureId(null);
    setFeatTitle('');
    setFeatDescription('');
    setFeatIcon('Laptop');
  };

  const handleSaveFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featTitle.trim() || !featDescription.trim()) return;
    if (editingFeatureId) {
      onUpdateData((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.id === editingFeatureId
            ? { ...f, title: featTitle.trim(), description: featDescription.trim(), icon: featIcon }
            : f
        ),
      }));
      showToast('Feature card updated.');
    } else {
      const newFeat: FeatureItem = {
        id: `feat-${Date.now()}`,
        title: featTitle.trim(),
        description: featDescription.trim(),
        icon: featIcon,
      };
      onUpdateData((prev) => ({ ...prev, features: [...prev.features, newFeat] }));
      showToast('Feature card added.');
    }
    resetFeatureForm();
  };

  // --- Tab 6: Reviews ---
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
      showToast('Review published.');
    }
    resetReviewForm();
  };

  // --- Tab 7: Custom Sections ---
  const resetCustomForm = () => {
    setEditingCustomId(null);
    setCustomTitle('');
    setCustomBody('');
    setCustomType('text');
    setCustomMediaUrl('');
    setCustomCtaLabel('');
    setCustomCtaUrl('');
    setCustomPlacement('after-courses');
    setCustomTheme('light');
  };

  const handleCustomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const compressed = await compressImageFile(file, 1280, 0.82);
      setCustomMediaUrl(compressed);
      showToast('Custom section image ready.');
    } catch {
      showToast('Unable to process image.');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSaveCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    if (editingCustomId) {
      onUpdateData((prev) => ({
        ...prev,
        customSections: prev.customSections.map((s) =>
          s.id === editingCustomId
            ? {
                ...s,
                title: customTitle.trim(),
                bodyText: customBody.trim(),
                blockType: customType,
                mediaUrl: customMediaUrl.trim(),
                ctaLabel: customCtaLabel.trim(),
                ctaUrl: customCtaUrl.trim(),
                placement: customPlacement,
                theme: customTheme,
              }
            : s
        ),
      }));
      showToast('Custom section updated.');
    } else {
      const newBlock: CustomSectionBlock = {
        id: `custom-${Date.now()}`,
        title: customTitle.trim(),
        bodyText: customBody.trim(),
        blockType: customType,
        mediaUrl: customMediaUrl.trim(),
        ctaLabel: customCtaLabel.trim(),
        ctaUrl: customCtaUrl.trim(),
        placement: customPlacement,
        theme: customTheme,
      };
      onUpdateData((prev) => ({
        ...prev,
        customSections: [...prev.customSections, newBlock],
      }));
      showToast('Custom section added to home page.');
    }
    resetCustomForm();
  };

  const startEditCustomSection = (s: CustomSectionBlock) => {
    setEditingCustomId(s.id);
    setCustomTitle(s.title);
    setCustomBody(s.bodyText);
    setCustomType(s.blockType);
    setCustomMediaUrl(s.mediaUrl);
    setCustomCtaLabel(s.ctaLabel);
    setCustomCtaUrl(s.ctaUrl);
    setCustomPlacement(s.placement);
    setCustomTheme(s.theme);
  };

  // --- Tab 8: Contact, Footer, Inquiries & Certs ---
  const handleSaveContactFooter = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData((prev) => ({
      ...prev,
      contact: {
        phone: contactPhone.trim() || prev.contact.phone,
        whatsappNumber: whatsappNumber.trim() || prev.contact.whatsappNumber,
        email: contactEmail.trim() || prev.contact.email,
        address: contactAddress.trim() || prev.contact.address,
        timings: contactTimings.trim() || prev.contact.timings,
        googleMapsUrl: googleMapsUrl.trim() || prev.contact.googleMapsUrl,
        mapQuery: mapQuery.trim() || prev.contact.mapQuery,
        facebookUrl: facebookUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
      },
    }));
    showToast('Contact, location & WhatsApp settings updated.');
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
    showToast(`Certificate ${normalizedId} added.`);
  };

  const TABS: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'branding', label: 'Branding & Texts', icon: Type },
    { id: 'hero-media', label: 'Hero Media', icon: LayoutTemplate },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'gallery', label: 'Photo & Video Gallery', icon: ImageIcon },
    { id: 'notices-features', label: 'Notices & Features', icon: Megaphone },
    { id: 'reviews', label: 'Student Reviews', icon: Star },
    { id: 'custom-sections', label: 'Custom Sections', icon: Layers },
    { id: 'contact', label: `Contact & Inquiries (${data.enquiries.length})`, icon: Phone },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="JIT Full CMS Control Panel"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5"
    >
      <div className="w-full max-w-6xl h-[92vh] rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-[#0A2463] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight">
              JIT Admin CMS Control Panel
            </h2>
            <p className="text-xs text-blue-200">
              Auto-saved to browser storage · Full live site control
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
              <span>Export Data (JSON)</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 border border-blue-700 text-xs font-semibold text-white cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#F59E0B]" aria-hidden="true" />
              <span>Import Data (JSON)</span>
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-800 text-xs font-medium text-blue-200 hover:bg-blue-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset to Default</span>
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              <span>View Site</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-800 text-blue-200 hover:bg-rose-900/60 hover:text-white text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* 8-Tab Navigation */}
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
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0A2463] text-white'
                      : 'text-slate-700 hover:bg-white hover:text-[#0A2463]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Workspace */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-white">
          {statusFeedback && (
            <div className="lg:hidden mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-800">
              {statusFeedback}
            </div>
          )}

          {/* TAB 1: BRANDING & TEXTS */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBrandingAndTexts} className="space-y-6">
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Institute Logo &amp; Brand Identity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institute Name (Header &amp; Hero)
                    </label>
                    <input
                      type="text"
                      required
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subtitle (Below Institute Name)
                    </label>
                    <input
                      type="text"
                      required
                      value={instituteSubtitle}
                      onChange={(e) => setInstituteSubtitle(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Custom Logo Override (Leave empty to use Official JIT Swirling Logo)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customLogoUrl}
                      onChange={(e) => setCustomLogoUrl(e.target.value)}
                      placeholder="https://... or upload logo image"
                      className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingMedia ? 'Uploading...' : 'Upload Logo'}</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                    </label>
                    {customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomLogoUrl('');
                          onUpdateData((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, customLogoUrl: '' },
                          }));
                          showToast('Restored official JIT swirling logo.');
                        }}
                        className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 cursor-pointer"
                      >
                        Use Official SVG
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Hero Headlines, Buttons &amp; Trust Strip
                </h3>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      required
                      value={primaryCtaText}
                      onChange={(e) => setPrimaryCtaText(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Secondary CTA Button Text (Header &amp; Hero)
                    </label>
                    <input
                      type="text"
                      required
                      value={secondaryCtaText}
                      onChange={(e) => setSecondaryCtaText(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trust Badges (separated by &ldquo;|&rdquo;)
                  </label>
                  <input
                    type="text"
                    value={trustItemsText}
                    onChange={(e) => setTrustItemsText(e.target.value)}
                    placeholder="Govt. Registered | ISO Certified | 100% Practical Training | Valid Certification"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
              >
                Save Branding &amp; Texts
              </button>
            </form>
          )}

          {/* TAB 2: HERO MEDIA (PHOTO / VIDEO) */}
          {activeTab === 'hero-media' && (
            <form onSubmit={handleSaveHeroMedia} className="space-y-6">
              <div className="rounded-xl border border-slate-200 p-5 sm:p-6 bg-slate-50/50 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0A2463]">
                      Hero Media Switcher (Photo or Video)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Display either a campus photograph or a YouTube/MP4 showcase video on the Hero right column.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setHeroMediaType('image')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold cursor-pointer ${
                        heroMediaType === 'image'
                          ? 'bg-[#0A2463] text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroMediaType('video')}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold cursor-pointer ${
                        heroMediaType === 'video'
                          ? 'bg-[#0A2463] text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Video
                    </button>
                  </div>
                </div>

                {heroMediaType === 'image' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Hero Photo URL or Upload File
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={heroImageUrl}
                          onChange={(e) => setHeroImageUrl(e.target.value)}
                          className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingMedia ? 'Uploading...' : 'Upload Photo'}</span>
                          <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="sr-only" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setHeroImageUrl(DEFAULT_HERO_IMAGE)}
                          className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 cursor-pointer"
                        >
                          Reset Default
                        </button>
                      </div>
                    </div>

                    <div className="max-w-lg aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 bg-slate-200">
                      <img
                        src={heroImageUrl || DEFAULT_HERO_IMAGE}
                        alt="Hero photo preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        YouTube URL, Direct MP4 Link, or Upload Video File (&le; 3MB)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={heroVideoUrl}
                          onChange={(e) => setHeroVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                          className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                        />
                        <label className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingMedia ? 'Reading...' : 'Upload Video'}</span>
                          <input type="file" accept="video/*" onChange={handleHeroVideoUpload} className="sr-only" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Media Overlay Caption
                  </label>
                  <input
                    type="text"
                    value={heroCaption}
                    onChange={(e) => setHeroCaption(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
              >
                Save Hero Media Settings
              </button>
            </form>
          )}

          {/* TAB 3: COURSES */}
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
                      className="text-xs font-medium text-slate-600 inline-flex items-center gap-1 cursor-pointer"
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
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Optional Course Card Image (URL or Upload)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={courseImageUrl}
                      onChange={(e) => setCourseImageUrl(e.target.value)}
                      placeholder="Leave empty for icon header, or paste/upload image"
                      className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Upload Image
                      <input type="file" accept="image/*" onChange={handleCourseImageUpload} className="sr-only" />
                    </label>
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

          {/* TAB 4: PHOTO & VIDEO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <form
                onSubmit={handleSaveGalleryItem}
                className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display font-bold text-lg text-[#0A2463]">
                    {editingGalleryId ? 'Edit Gallery Item' : 'Add Photo or Video to Gallery'}
                  </h3>

                  <div className="flex items-center gap-2">
                    {editingGalleryId && (
                      <button
                        type="button"
                        onClick={resetGalleryForm}
                        className="text-xs text-slate-600 inline-flex items-center gap-1 mr-2 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}

                    <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setGalMediaType('image')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${
                          galMediaType === 'image' ? 'bg-[#0A2463] text-white' : 'text-slate-700'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => setGalMediaType('video')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold cursor-pointer ${
                          galMediaType === 'video' ? 'bg-[#0A2463] text-white' : 'text-slate-700'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" /> Video
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {galMediaType === 'video'
                        ? 'Upload Video File (≤ 3MB) or Paste YouTube/MP4 URL'
                        : 'Upload Local Photo'}
                    </label>
                    <label className="flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-dashed border-[#0A2463] bg-white hover:bg-blue-50/50 text-[#0A2463] text-sm font-semibold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingMedia
                          ? 'Processing...'
                          : galMediaType === 'video'
                            ? 'Select Video File'
                            : 'Select Image File'}
                      </span>
                      <input
                        type="file"
                        accept={galMediaType === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleGalleryFileUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {galMediaType === 'video' ? 'YouTube URL / Direct MP4 URL' : 'Or Image URL'}
                    </label>
                    <input
                      type="text"
                      value={galMediaUrl}
                      onChange={(e) => setGalMediaUrl(e.target.value)}
                      placeholder={
                        galMediaType === 'video'
                          ? 'https://www.youtube.com/watch?v=... or MP4 link'
                          : 'https://... or upload on left'
                      }
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
                      Title / Caption
                    </label>
                    <input
                      type="text"
                      value={galCaption}
                      onChange={(e) => setGalCaption(e.target.value)}
                      placeholder="e.g. Classroom session or Event highlights"
                      className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingGalleryId ? 'Save Changes' : 'Add to Gallery'}</span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.gallery.map((item) => {
                  const thumb =
                    item.mediaType === 'video'
                      ? getYouTubeThumbnailUrl(item.mediaUrl)
                      : item.mediaUrl;
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col"
                    >
                      <div className="aspect-[4/3] bg-slate-900 relative">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={item.caption}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#F59E0B]">
                            <Video className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-amber-700">
                            {item.mediaType === 'video' ? `Video · ${item.category}` : item.category}
                          </span>
                          <p className="text-sm font-medium text-[#0A2463] truncate">
                            {item.caption}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditGalleryItem(item)}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                            aria-label={`Edit ${item.caption}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateData((prev) => ({
                                ...prev,
                                gallery: prev.gallery.filter((g) => g.id !== item.id),
                              }));
                              showToast('Gallery item removed.');
                            }}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                            aria-label={`Delete ${item.caption}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: NOTICES & WHY CHOOSE JIT FEATURES */}
          {activeTab === 'notices-features' && (
            <div className="space-y-10">
              {/* Notices Manager */}
              <div className="space-y-5">
                <form
                  onSubmit={handleSaveNotice}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-[#0A2463]">
                      {editingNoticeId ? 'Edit Notice' : 'Manage Notice Board'}
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
                        Announcement Text
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

                <div className="space-y-2.5">
                  {data.notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <span className="text-xs font-bold text-[#0A2463]">[{notice.badge}]</span>{' '}
                        <span className="text-xs font-mono text-slate-500">{notice.date}</span>
                        <p
                          className={`text-sm mt-0.5 ${
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
                          onClick={() => {
                            setEditingNoticeId(notice.id);
                            setNoticeTitle(notice.title);
                            setNoticeDate(notice.date);
                            setNoticeBadge(notice.badge);
                          }}
                          className="p-2 rounded-lg border border-slate-200 text-slate-700 cursor-pointer"
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
                          className="p-2 rounded-lg border border-rose-200 text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose JIT Feature Cards Manager */}
              <div className="pt-6 border-t border-slate-200 space-y-5">
                <form
                  onSubmit={handleSaveFeature}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-[#0A2463]">
                      {editingFeatureId ? 'Edit Feature Card' : 'Why Choose JIT? Feature Cards'}
                    </h3>
                    {editingFeatureId && (
                      <button
                        type="button"
                        onClick={resetFeatureForm}
                        className="text-xs text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Feature Title
                      </label>
                      <input
                        type="text"
                        required
                        value={featTitle}
                        onChange={(e) => setFeatTitle(e.target.value)}
                        placeholder="e.g. Practical Training"
                        className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={featIcon}
                        onChange={(e) => setFeatIcon(e.target.value as FeatureIconKey)}
                        className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                      >
                        {FEATURE_ICONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        required
                        value={featDescription}
                        onChange={(e) => setFeatDescription(e.target.value)}
                        placeholder="Short feature description..."
                        className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingFeatureId ? 'Save Feature Card' : 'Add Feature Card'}</span>
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.features.map((feat) => (
                    <div
                      key={feat.id}
                      className="rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-mono text-amber-700">{feat.icon}</p>
                        <h4 className="font-display font-bold text-sm text-[#0A2463]">{feat.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{feat.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFeatureId(feat.id);
                            setFeatTitle(feat.title);
                            setFeatDescription(feat.description);
                            setFeatIcon(feat.icon);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateData((prev) => ({
                              ...prev,
                              features: prev.features.filter((f) => f.id !== feat.id),
                            }));
                            showToast('Feature card removed.');
                          }}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STUDENT REVIEWS */}
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
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="Student Name"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                  <select
                    value={revCourse}
                    onChange={(e) => setRevCourse(e.target.value)}
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  >
                    {data.courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={revRating}
                    onChange={(e) => setRevRating(Number(e.target.value))}
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={revDate}
                    onChange={(e) => setRevDate(e.target.value)}
                    placeholder="Month Year"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  value={revText}
                  onChange={(e) => setRevText(e.target.value)}
                  placeholder="Student feedback..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                />

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
                        onClick={() => {
                          setEditingReviewId(rev.id);
                          setRevName(rev.reviewerName);
                          setRevRating(rev.rating);
                          setRevCourse(rev.courseTaken);
                          setRevDate(rev.dateLabel);
                          setRevText(rev.reviewText);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 cursor-pointer"
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOM SECTIONS (DYNAMIC BLOCKS) */}
          {activeTab === 'custom-sections' && (
            <div className="space-y-8">
              <form
                onSubmit={handleSaveCustomSection}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#0A2463]">
                      {editingCustomId ? 'Edit Custom Section' : 'Create Custom Home Page Block'}
                    </h3>
                    <p className="text-xs text-slate-600">
                      Append custom text, photo, or video banners anywhere on the home page.
                    </p>
                  </div>
                  {editingCustomId && (
                    <button
                      type="button"
                      onClick={resetCustomForm}
                      className="text-xs text-slate-600 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      required
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. Weekend Live Market Bootcamp"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Page Placement
                    </label>
                    <select
                      value={customPlacement}
                      onChange={(e) => setCustomPlacement(e.target.value as CustomSectionPlacement)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {PLACEMENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Block Style
                    </label>
                    <select
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value as CustomSectionTheme)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      <option value="light">Crisp White</option>
                      <option value="royal-blue">Royal Blue Banner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Body Copy
                  </label>
                  <textarea
                    rows={3}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    placeholder="Write announcement details, event highlights, or workshop description..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Media Type
                    </label>
                    <select
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value as 'text' | 'image' | 'video')}
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      <option value="text">Text Only</option>
                      <option value="image">Text + Image</option>
                      <option value="video">Text + Video (YouTube/MP4)</option>
                    </select>
                  </div>

                  {customType !== 'text' && (
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customMediaUrl}
                        onChange={(e) => setCustomMediaUrl(e.target.value)}
                        placeholder={
                          customType === 'video'
                            ? 'https://www.youtube.com/watch?v=...'
                            : 'Image URL or upload'
                        }
                        className="flex-1 min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                      />
                      {customType === 'image' && (
                        <label className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="sr-only" />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={customCtaLabel}
                    onChange={(e) => setCustomCtaLabel(e.target.value)}
                    placeholder="Optional Button Text (e.g. Register Now)"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                  <input
                    type="text"
                    value={customCtaUrl}
                    onChange={(e) => setCustomCtaUrl(e.target.value)}
                    placeholder="Optional Button Link (e.g. #contact or https://...)"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingCustomId ? 'Save Section Changes' : 'Add Custom Section'}</span>
                </button>
              </form>

              {data.customSections.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-600">
                    No custom blocks added yet. Use the form above to insert announcements, photo banners, or videos anywhere on the page.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.customSections.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-semibold text-amber-700">
                          {PLACEMENT_OPTIONS.find((p) => p.value === block.placement)?.label} ·{' '}
                          {block.blockType.toUpperCase()}
                        </span>
                        <h4 className="font-display font-bold text-base text-[#0A2463]">
                          {block.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-1">{block.bodyText}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditCustomSection(block)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateData((prev) => ({
                              ...prev,
                              customSections: prev.customSections.filter((s) => s.id !== block.id),
                            }));
                            showToast('Custom section removed.');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-medium text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CONTACT, FOOTER, INQUIRIES & CERTIFICATES */}
          {activeTab === 'contact' && (
            <div className="space-y-10">
              <form
                onSubmit={handleSaveContactFooter}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4"
              >
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Contact, Location &amp; Social Media Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institute Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 8961260151"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Target Number (Inquiry Redirect)
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="e.g. 8961260151"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Opening Hours (separate entries with &ldquo;|&rdquo;)
                    </label>
                    <input
                      type="text"
                      required
                      value={contactTimings}
                      onChange={(e) => setContactTimings(e.target.value)}
                      placeholder="Mon–Tue, Thu, Sat: 7:00 AM – 9:00 PM | Wed: ..."
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institute Address
                    </label>
                    <input
                      type="text"
                      required
                      value={contactAddress}
                      onChange={(e) => setContactAddress(e.target.value)}
                      placeholder="83/1 Dhara Para Road, Tutepara Rd, P.O & P.S Barasat, Kolkata, West Bengal 700124"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Google Maps Direct Link (Directions Button &amp; Footer)
                    </label>
                    <input
                      type="url"
                      required
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/3LEj2zLvazdHkBs67"
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Map Embed Query (or full Google Maps Embed URL)
                    </label>
                    <input
                      type="text"
                      required
                      value={mapQuery}
                      onChange={(e) => setMapQuery(e.target.value)}
                      placeholder="JIT Computer Training Institute, 83/1 Dhara Para Road, ..."
                      className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="Facebook URL"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                  <input
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="Instagram URL"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="YouTube Channel URL"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer"
                >
                  Save Contact, Location &amp; WhatsApp Settings
                </button>
              </form>

              {/* Inquiries */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-[#0A2463]">
                  Demo &amp; Admission Inquiries ({data.enquiries.length})
                </h3>
                {data.enquiries.length === 0 ? (
                  <p className="text-sm text-slate-500">No inquiries submitted yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {data.enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="rounded-xl border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                      >
                        <div>
                          <span className="text-xs font-bold text-amber-700">[{enq.type}]</span>{' '}
                          <strong className="text-[#0A2463]">{enq.name}</strong> ·{' '}
                          <span className="font-mono text-sm">{enq.mobile}</span>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {enq.course} · {enq.preferredTiming}
                          </p>
                          {enq.message && (
                            <p className="text-xs text-slate-700 mt-1 italic">
                              &ldquo;{enq.message}&rdquo;
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              onUpdateData((prev) => ({
                                ...prev,
                                enquiries: prev.enquiries.map((item) =>
                                  item.id === enq.id
                                    ? { ...item, status: e.target.value as EnquiryStatus }
                                    : item
                                ),
                              }))
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Enrolled">Enrolled</option>
                          </select>
                          <a
                            href={buildWhatsAppUrl(
                              `Hello ${enq.name}, regarding your ${enq.type} inquiry for ${enq.course}.`,
                              enq.mobile
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateData((prev) => ({
                                ...prev,
                                enquiries: prev.enquiries.filter((item) => item.id !== enq.id),
                              }))
                            }
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-700 cursor-pointer"
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
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <form
                  onSubmit={handleAddCertificate}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0A2463]" />
                    <h3 className="font-display font-bold text-lg text-[#0A2463]">
                      Verified Certificate IDs
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <input
                      type="text"
                      required
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      placeholder="ID (JIT-2026-0301)"
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
                      placeholder="Grade"
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
                    className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#0A2463] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Certificate
                  </button>
                </form>

                <div className="space-y-2">
                  {data.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-lg border border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#0A2463]">{cert.id}</span> ·{' '}
                        <span className="font-medium">{cert.studentName}</span> ·{' '}
                        <span className="text-slate-600">{cert.course}</span> ({cert.grade})
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateData((prev) => ({
                            ...prev,
                            certificates: prev.certificates.filter((c) => c.id !== cert.id),
                          }))
                        }
                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
