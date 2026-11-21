export type NoticeBadge = 'New' | 'Exam' | 'Batch' | 'Holiday';

export type MediaType = 'image' | 'video';

export type FeatureIconKey =
  | 'Laptop'
  | 'Users'
  | 'Award'
  | 'Briefcase'
  | 'ShieldCheck'
  | 'TrendingUp'
  | 'BookOpen'
  | 'Globe';

export interface BrandingSettings {
  customLogoUrl: string;
  instituteName: string;
  instituteSubtitle: string;
}

export interface HeroSettings {
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  trustItems: string[];
  mediaType: MediaType;
  heroImageUrl: string;
  heroVideoUrl: string;
  mediaCaption: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: FeatureIconKey;
}

export interface ContactSettings {
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  timings: string;
  googleMapsUrl: string;
  mapQuery: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  fee: string;
  summary: string;
  imageUrl?: string;
  modules: string[];
}

export type GalleryCategory = 'Classroom' | 'Events' | 'Students';

export interface GalleryItem {
  id: string;
  mediaType: MediaType;
  mediaUrl: string;
  caption: string;
  category: GalleryCategory;
  addedAt: string;
}

export interface GoogleReview {
  id: string;
  reviewerName: string;
  rating: number;
  courseTaken: string;
  reviewText: string;
  dateLabel: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  badge: NoticeBadge;
  active: boolean;
}

export type CustomSectionPlacement =
  | 'after-hero'
  | 'after-courses'
  | 'after-gallery'
  | 'before-footer';

export type CustomSectionTheme = 'light' | 'royal-blue';

export interface CustomSectionBlock {
  id: string;
  title: string;
  bodyText: string;
  blockType: 'text' | 'image' | 'video';
  mediaUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  placement: CustomSectionPlacement;
  theme: CustomSectionTheme;
}

export interface CertificateRecord {
  id: string;
  studentName: string;
  course: string;
  grade: string;
  issueDate: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Enrolled';

export interface AdmissionEnquiry {
  id: string;
  name: string;
  mobile: string;
  course: string;
  preferredTiming: string;
  message?: string;
  type: 'Demo' | 'Enroll';
  submittedAt: string;
  status: EnquiryStatus;
}

export interface InstituteData {
  branding: BrandingSettings;
  hero: HeroSettings;
  features: FeatureItem[];
  contact: ContactSettings;
  courses: Course[];
  gallery: GalleryItem[];
  reviews: GoogleReview[];
  notices: NoticeItem[];
  customSections: CustomSectionBlock[];
  certificates: CertificateRecord[];
  enquiries: AdmissionEnquiry[];
}
