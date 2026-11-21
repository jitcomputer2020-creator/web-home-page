import { InstituteData } from '../types';

export const DEFAULT_HERO_IMAGE = '/src/assets/images/hero_jit_campus_1795242509151.jpg';
export const ADMIN_ACCESS_PIN = '8017462677';

export const PORTAL_LINKS = [
  {
    id: 'student-portal',
    title: 'Student Portal',
    description: 'Attendance, study notes, batch schedules & fee receipts.',
    url: 'https://jitcomputer.ct.ws/student-portal/',
  },
  {
    id: 'jit-group',
    title: 'JIT Group',
    description: 'Alumni network, peer discussions & official announcements.',
    url: 'https://jitcomputer.ct.ws/jit-group/',
  },
  {
    id: 'test-knowledge',
    title: 'Test Your Knowledge',
    description: 'Practice mock assessments & certification readiness tests.',
    url: 'https://jitcomputer.ct.ws/test-your-knowledge/',
  },
] as const;

export const PREFERRED_TIMINGS = [
  'Morning (8:00 AM – 11:00 AM)',
  'Midday (11:30 AM – 2:30 PM)',
  'Afternoon (3:00 PM – 5:00 PM)',
  'Evening (5:00 PM – 7:00 PM)',
] as const;

export const DEFAULT_INSTITUTE_DATA: InstituteData = {
  hero: {
    headline: 'Unlock Your Potential in Technology & Finance!',
    subheadline:
      'Learn Computer Application, Coding, Digital Marketing & Share Market Trading from Industry Experts with 100% Practical Experience.',
    heroImageUrl: DEFAULT_HERO_IMAGE,
  },
  contact: {
    phone: '8961260151',
    email: 'jitcomputer2020@gmail.com',
    address: 'JIT Computer Training Institute (Jharna Institute of Technology), Main Campus',
    timings: 'Mon–Sat, 8:00 AM – 7:00 PM',
  },
  courses: [
    {
      id: 'course-basic-advance',
      title: 'Basic & Advance Computer Application',
      category: 'Computer & Coding',
      duration: '6 – 12 Months',
      fee: 'Contact for Fee Details',
      summary:
        'MS Office, Tally Prime, Internet & AI tools, Hardware basics, Web Design, and Coding fundamentals with 100% practical lab sessions.',
      modules: [
        'Introduction to Computers & Hardware Basics',
        'Operating Systems & File Management',
        'Microsoft Office (Word, Excel & PowerPoint)',
        'Tally Prime with GST & Business Accounting',
        'Introduction to the Internet and AI Productivity',
        'Basic Web Design (HTML & CSS)',
        'Introduction to Programming Concepts',
      ],
    },
    {
      id: 'course-digital-marketing',
      title: 'Digital Marketing Mastery',
      category: 'Marketing & Growth',
      duration: '4 – 6 Months',
      fee: 'Contact for Fee Details',
      summary:
        'SEO, Social Media Ads, Google Ads, Content Strategy, and E-commerce campaigns built through live brand projects.',
      modules: [
        'Introduction to Digital Marketing',
        'Website Development & Conversion Optimization',
        'Search Engine Optimization (SEO)',
        'Content Strategy & Copywriting',
        'Social Media Marketing & Meta Ads',
        'Google AdWords & Paid Advertising (PPC)',
        'E-commerce, Influencer & Affiliate Marketing',
      ],
    },
    {
      id: 'course-share-market',
      title: 'Share Market & Financial Trading',
      category: 'Finance & Markets',
      duration: '3 – 4 Months',
      fee: 'Contact for Fee Details',
      summary:
        'Stock Market Analysis, Intraday & Swing Trading, Options, and Financial Planning taught on real-time market charts.',
      modules: [
        'Introduction to Share Market & Financial Instruments',
        'Behavioral Finance & Market Psychology',
        'Fundamental Analysis & Economic Cycles',
        'Advanced Technical Analysis & Price Action',
        'Intraday & Swing Trading Strategies',
        'Portfolio Management & Risk Control',
        'Futures and Options (F&O) Mastery',
      ],
    },
  ],
  notices: [
    {
      id: 'notice-1',
      title: 'New Morning & Evening Batches open for Computer Application, Digital Marketing & Share Market.',
      date: '25 Nov 2026',
      badge: 'New',
      active: true,
    },
    {
      id: 'notice-2',
      title: 'Monthly Practical & Theory Assessment Schedule published — collect admit slips at front desk.',
      date: '02 Dec 2026',
      badge: 'Exam',
      active: true,
    },
    {
      id: 'notice-3',
      title: 'Free Live Market Charting & AI Productivity Demo Workshop every Saturday at 11:00 AM.',
      date: 'Every Sat',
      badge: 'Batch',
      active: true,
    },
    {
      id: 'notice-4',
      title: 'Institute remains closed on Sundays; regular lab hours operate Mon–Sat 8:00 AM to 7:00 PM.',
      date: 'Weekly',
      badge: 'Holiday',
      active: true,
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/gallery_classroom_lab_1795242491930.jpg',
      caption: 'Students practicing hands-on Computer Application & Tally Prime in our main lab',
      category: 'Classroom',
      addedAt: '2026-09-12',
    },
    {
      id: 'gal-2',
      imageUrl: '/src/assets/images/gallery_trading_workshop_1795242491881.jpg',
      caption: 'Live candlestick chart & technical analysis session for Share Market students',
      category: 'Classroom',
      addedAt: '2026-10-04',
    },
    {
      id: 'gal-3',
      imageUrl: '/src/assets/images/gallery_certificate_ceremony_1795242492238.jpg',
      caption: "Teacher's Day & annual ISO certificate distribution celebration with graduates",
      category: 'Events',
      addedAt: '2026-10-22',
    },
    {
      id: 'gal-4',
      imageUrl: '/src/assets/images/gallery_student_cohort_1795242491602.jpg',
      caption: 'Digital Marketing & Coding student cohort collaborating on live projects',
      category: 'Students',
      addedAt: '2026-11-05',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      reviewerName: 'Subham Chatterjee',
      rating: 5,
      courseTaken: 'Basic & Advance Computer Application',
      reviewText:
        'Individual desktop systems and real practical guidance in MS Office, Tally Prime, and basic coding helped me land an office executive job within weeks of completing my certificate.',
      dateLabel: 'October 2026',
    },
    {
      id: 'rev-2',
      reviewerName: 'Ananya Mondal',
      rating: 5,
      courseTaken: 'Share Market & Financial Trading',
      reviewText:
        'The mentors focus on trading discipline, chart structure, and proper risk management rather than blind tips. Learning technical analysis and options hedging here completely changed my approach.',
      dateLabel: 'September 2026',
    },
    {
      id: 'rev-3',
      reviewerName: 'Ritwik Sen',
      rating: 5,
      courseTaken: 'Digital Marketing Mastery',
      reviewText:
        '100% practical training on SEO, Google Ads, and social media campaigns. I worked on real websites during class and started freelancing right after my final project.',
      dateLabel: 'August 2026',
    },
    {
      id: 'rev-4',
      reviewerName: 'Priyanka Das',
      rating: 5,
      courseTaken: 'Basic & Advance Computer Application',
      reviewText:
        'Very supportive faculty, flexible batch timings, and clean lab infrastructure. Regular mock assessments on the Student Portal keep us sharp throughout the course.',
      dateLabel: 'July 2026',
    },
  ],
  certificates: [
    {
      id: 'JIT-2026-0101',
      studentName: 'Subham Chatterjee',
      course: 'Basic & Advance Computer Application',
      grade: 'Grade A+ (94%)',
      issueDate: '15 Oct 2026',
    },
    {
      id: 'JIT-2026-0214',
      studentName: 'Ritwik Sen',
      course: 'Digital Marketing Mastery',
      grade: 'Grade A+ (92%)',
      issueDate: '04 Nov 2026',
    },
    {
      id: 'JIT-2025-0482',
      studentName: 'Ananya Mondal',
      course: 'Share Market & Financial Trading',
      grade: 'Grade A (89%)',
      issueDate: '22 Dec 2025',
    },
  ],
  enquiries: [],
};
