export type NoticeBadge = 'New' | 'Exam' | 'Batch' | 'Holiday';

export interface HeroSettings {
  headline: string;
  subheadline: string;
  heroImageUrl: string;
}

export interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  timings: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  fee: string;
  summary: string;
  modules: string[];
}

export type GalleryCategory = 'Classroom' | 'Events' | 'Students';

export interface GalleryItem {
  id: string;
  imageUrl: string;
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
  type: 'Demo' | 'Enroll';
  submittedAt: string;
  status: EnquiryStatus;
}

export interface InstituteData {
  hero: HeroSettings;
  contact: ContactSettings;
  courses: Course[];
  gallery: GalleryItem[];
  reviews: GoogleReview[];
  notices: NoticeItem[];
  certificates: CertificateRecord[];
  enquiries: AdmissionEnquiry[];
}
