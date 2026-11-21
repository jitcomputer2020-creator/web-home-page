import { InstituteData } from '../types';

export const DEFAULT_HERO_IMAGE = '/src/assets/images/hero_jit_campus_1795242509151.jpg';

export const WHATSAPP_NUMBER = '918961260151';
export const DISPLAY_PHONE = '+91 8961260151';
export const CONTACT_EMAIL = 'jitcomputer2020@gmail.com';
export const INSTITUTE_TIMINGS = 'Mon–Sat, 8:00 AM – 7:00 PM';
export const ADMIN_ACCESS_ID = '8017462677';

export const OFFICIAL_COURSE_NAMES = [
  'Basic and Advance',
  'Digital Marketing',
  'Share Market',
] as const;

export const PORTAL_LINKS = [
  {
    id: 'student-portal',
    title: 'Student Portal',
    description: 'Access attendance records, digital study notes, batch schedules, and fee receipts.',
    url: 'https://jitcomputer.ct.ws/student-portal/',
    actionLabel: 'Open Student Portal',
  },
  {
    id: 'jit-group',
    title: 'JIT Group',
    description: 'Connect with institute alumni, peer study circles, and official placement updates.',
    url: 'https://jitcomputer.ct.ws/jit-group/',
    actionLabel: 'Visit JIT Group',
  },
  {
    id: 'test-knowledge',
    title: 'Test Your Knowledge',
    description: 'Attempt timed mock assessments, chapter quizzes, and certification readiness tests.',
    url: 'https://jitcomputer.ct.ws/test-your-knowledge/',
    actionLabel: 'Start Assessment',
  },
] as const;

export const PREFERRED_TIMINGS = [
  'Morning (8:00 AM – 11:00 AM)',
  'Midday (11:30 AM – 2:30 PM)',
  'Afternoon (3:00 PM – 5:00 PM)',
  'Evening (5:00 PM – 7:00 PM)',
] as const;

export const DEFAULT_INSTITUTE_DATA: InstituteData = {
  heroImageUrl: DEFAULT_HERO_IMAGE,
  notices: [
    {
      id: 'notice-1',
      text: 'New Morning & Evening Batches starting next Monday for Basic and Advance, Digital Marketing & Share Market.',
      active: true,
    },
    {
      id: 'notice-2',
      text: 'Monthly Practical Examination Schedule published on Student Portal — bring your JIT ID card.',
      active: true,
    },
    {
      id: 'notice-3',
      text: 'Limited seats open for Live Market Charting & SEO/Google AdWords Practical Lab Batches.',
      active: true,
    },
    {
      id: 'notice-4',
      text: 'Institute remains closed on Sunday; regular lab hours operate Mon–Sat from 8:00 AM to 7:00 PM.',
      active: true,
    },
  ],
  courses: [
    {
      id: 'course-basic-advance',
      title: 'Basic and Advance',
      category: 'Basic and Advance',
      duration: 'Comprehensive Track',
      summary:
        'Complete practical computer mastery from hardware and MS Office to internet AI workflows, web design, and programming fundamentals.',
      modules: [
        'Introduction to Computers',
        'Computer Hardware Basics',
        'Introduction to Operating Systems',
        'Microsoft Office',
        'Spreadsheets with Microsoft Excel',
        'Presentations with Microsoft PowerPoint',
        'Introduction to the Internet and AI',
        'Basic Web Design',
        'Introduction to Programming Concepts',
      ],
      footerNote: 'AND MORE...',
    },
    {
      id: 'course-digital-marketing',
      title: 'Digital Marketing',
      category: 'Digital Marketing',
      duration: 'Career Track',
      summary:
        'Hands-on online growth training covering website optimization, SEO, social media, PPC, Google AdWords, and e-commerce campaigns.',
      modules: [
        'Introduction to Digital Marketing',
        'Website Development & Optimization',
        'Search Engine Optimization (SEO)',
        'Content Marketing',
        'Social Media Marketing',
        'E-commerce Marketing',
        'Paid Advertising (PPC)',
        'Google AdWords Campaigns',
        'Influencer and Affiliate Marketing',
      ],
      footerNote: 'AND MORE...',
    },
    {
      id: 'course-share-market',
      title: 'Share Market',
      category: 'Share Market',
      duration: 'Practical Trading Track',
      summary:
        'Structured financial market training spanning fundamental and advanced technical analysis, trading psychology, portfolio management, and F&O.',
      modules: [
        'Introduction to the Share Market',
        'Understanding Financial Markets and Instruments',
        'Behavioral Finance and Market Psychology',
        'Fundamental Analysis',
        'Advanced Technical Analysis',
        'Market Timing and Trading Strategies',
        'Stock Market and Economic Cycles',
        'Portfolio Management',
        'Futures and Options',
      ],
      footerNote: 'AND MORE...',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/gallery_classroom_lab_1795242491930.jpg',
      caption: 'Hands-on computer lab session for Basic and Advance batch students',
      category: 'Classroom',
      addedAt: '2026-09-12',
    },
    {
      id: 'gal-2',
      imageUrl: '/src/assets/images/gallery_trading_workshop_1795242491881.jpg',
      caption: 'Live candlestick chart reading during Share Market Technical Analysis batch',
      category: 'Classroom',
      addedAt: '2026-10-04',
    },
    {
      id: 'gal-3',
      imageUrl: '/src/assets/images/gallery_certificate_ceremony_1795242492238.jpg',
      caption: 'Annual ISO certificate distribution ceremony celebrating graduating batches',
      category: 'Events',
      addedAt: '2026-10-22',
    },
    {
      id: 'gal-4',
      imageUrl: '/src/assets/images/gallery_student_cohort_1795242491602.jpg',
      caption: 'Digital Marketing and Web Design students collaborating on live campaign projects',
      category: 'Students',
      addedAt: '2026-11-05',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      reviewerName: 'Subham Chatterjee',
      rating: 5,
      courseTaken: 'Basic and Advance',
      reviewText:
        'Before joining JIT, I had minimal computer experience. Mastering MS Excel, PowerPoint, hardware basics, and AI internet workflows on individual lab systems helped me secure an office coordinator position within weeks.',
      dateLabel: 'October 2026',
    },
    {
      id: 'rev-2',
      reviewerName: 'Ananya Mondal',
      rating: 5,
      courseTaken: 'Share Market',
      reviewText:
        'What sets Jharna Institute of Technology apart is their focus on market psychology, fundamental research, and risk control instead of blind tips. Reading charts and Futures & Options concepts gave me real clarity.',
      dateLabel: 'September 2026',
    },
    {
      id: 'rev-3',
      reviewerName: 'Ritwik Sen',
      rating: 5,
      courseTaken: 'Digital Marketing',
      reviewText:
        'Practical lab sessions on SEO, Google AdWords campaigns, and social media analytics made all the difference. I built and optimized a live website and launched real PPC test campaigns under mentor guidance.',
      dateLabel: 'August 2026',
    },
    {
      id: 'rev-4',
      reviewerName: 'Priyanka Das',
      rating: 5,
      courseTaken: 'Basic and Advance',
      reviewText:
        'Supportive instructors, flexible batch timings, and regular weekly assessments on the Student Portal. From Microsoft Office to basic web design and programming concepts, every topic was taught step by step.',
      dateLabel: 'July 2026',
    },
  ],
  certificates: [
    {
      id: 'JIT-2026-0101',
      studentName: 'Subham Chatterjee',
      course: 'Basic and Advance',
      grade: 'Grade A+ (94%)',
      issueDate: '15 Oct 2026',
    },
    {
      id: 'JIT-2026-0214',
      studentName: 'Ritwik Sen',
      course: 'Digital Marketing',
      grade: 'Grade A+ (92%)',
      issueDate: '04 Nov 2026',
    },
    {
      id: 'JIT-2025-0482',
      studentName: 'Ananya Mondal',
      course: 'Share Market',
      grade: 'Grade A (89%)',
      issueDate: '22 Dec 2025',
    },
  ],
  enquiries: [],
};
