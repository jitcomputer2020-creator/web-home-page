export type CourseCategory =
  | 'Basic & Office'
  | 'Tally & GST'
  | 'Web & AI'
  | 'Share Market Trading';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  duration: string;
  modules: string[];
  summary: string;
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
  rating: number; // 1 to 5
  courseTaken: string;
  reviewText: string;
  dateLabel: string;
}

export interface NoticeItem {
  id: string;
  text: string;
  active: boolean;
}

export interface CertificateRecord {
  id: string; // e.g. JIT-2026-0101
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
  submittedAt: string;
  status: EnquiryStatus;
}

export interface InstituteData {
  heroImageUrl: string;
  courses: Course[];
  gallery: GalleryItem[];
  reviews: GoogleReview[];
  notices: NoticeItem[];
  certificates: CertificateRecord[];
  enquiries: AdmissionEnquiry[];
}
