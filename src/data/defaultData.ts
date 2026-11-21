import { InstituteData } from '../types';

export const DEFAULT_HERO_IMAGE = '/src/assets/images/hero_jit_campus_1795242509151.jpg';

export const WHATSAPP_NUMBER = '918961260151';
export const DISPLAY_PHONE = '+91 8961260151';
export const CONTACT_EMAIL = 'jitcomputer2020@gmail.com';
export const INSTITUTE_TIMINGS = 'Mon–Sat, 8:00 AM – 7:00 PM';
export const ADMIN_ACCESS_ID = '8017462677';

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
      text: 'New Morning & Evening Batches starting next Monday for Tally Prime with GST & Share Market Trading.',
      active: true,
    },
    {
      id: 'notice-2',
      text: 'Monthly Practical Examination Schedule published on Student Portal — bring your JIT ID card.',
      active: true,
    },
    {
      id: 'notice-3',
      text: 'Limited seats open for Full-Stack Web Development & AI Tools Workshop (100% Lab-Based Training).',
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
      id: 'course-dca',
      title: 'Diploma in Computer Applications (DCA)',
      category: 'Basic & Office',
      duration: '6 Months',
      summary: 'Complete foundation in computer operations, office documentation, spreadsheets, and internet workflows.',
      modules: [
        'Windows OS & File Management',
        'MS Word & Professional Formatting',
        'MS Excel Formulas & Pivot Charts',
        'PowerPoint Presentations & Internet',
      ],
    },
    {
      id: 'course-adca',
      title: 'Advance Diploma in Computer Applications (ADCA)',
      category: 'Basic & Office',
      duration: '12 Months',
      summary: 'Comprehensive career diploma blending advanced office automation, DTP design, and business accounting.',
      modules: [
        'Advanced Excel Dashboards & MIS',
        'Photoshop & CorelDRAW Graphic Basics',
        'Database Fundamentals & Cyber Safety',
        'Live Office Project & Practical Exam',
      ],
    },
    {
      id: 'course-tally-gst',
      title: 'Tally Prime with GST, TDS & E-Filing',
      category: 'Tally & GST',
      duration: '4 Months',
      summary: 'Job-ready accounting training built around real business vouchers, inventory control, and tax compliance.',
      modules: [
        'Company Creation, Ledgers & Vouchers',
        'GST Billing, GSTR-1 & GSTR-3B Filing',
        'Inventory, Payroll & Bank Reconciliation',
        'TDS Calculations & E-Way Bill Portal',
      ],
    },
    {
      id: 'course-web-ai',
      title: 'Full-Stack Web Design & AI Productivity',
      category: 'Web & AI',
      duration: '6 Months',
      summary: 'Build responsive modern websites and automate everyday coding and content tasks with generative AI tools.',
      modules: [
        'HTML5, CSS3 & Responsive Layouts',
        'JavaScript & Modern React Basics',
        'Prompt Engineering & AI Workflows',
        'Live Portfolio Website Deployment',
      ],
    },
    {
      id: 'course-python-ai',
      title: 'Python Programming & Data Automation',
      category: 'Web & AI',
      duration: '4 Months',
      summary: 'Practical programming track focused on problem solving, data handling, and AI-assisted scripting.',
      modules: [
        'Python Syntax, Functions & OOP',
        'Working with Excel, CSV & APIs',
        'AI Code Assistants & Debugging',
        'Capstone Automation Mini-Project',
      ],
    },
    {
      id: 'course-share-market',
      title: 'Share Market, Technical Analysis & Trading',
      category: 'Share Market Trading',
      duration: '3 Months',
      summary: 'Structured equity and derivatives training covering chart patterns, market psychology, and live risk control.',
      modules: [
        'Equity, NSE/BSE & Demat Mechanics',
        'Candlestick Patterns & Price Action',
        'Support, Resistance & Indicators (RSI/MACD)',
        'Risk Management & Position Sizing',
      ],
    },
    {
      id: 'course-options-trading',
      title: 'Futures, Options & Intraday Strategy Lab',
      category: 'Share Market Trading',
      duration: '2 Months',
      summary: 'Focused derivatives workshop teaching option chain reading, hedging setups, and disciplined trade journaling.',
      modules: [
        'Option Chain & Open Interest Analysis',
        'Greeks Basics & Strike Selection',
        'Intraday & Swing Setup Frameworks',
        'Capital Protection & Trade Journal',
      ],
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/gallery_classroom_lab_1795242491930.jpg',
      caption: 'Hands-on computer lab session with individual instructor guidance',
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
      caption: 'Web & AI batch students collaborating on live capstone assignments',
      category: 'Students',
      addedAt: '2026-11-05',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      reviewerName: 'Subham Chatterjee',
      rating: 5,
      courseTaken: 'Tally Prime with GST',
      reviewText:
        'Before joining JIT, I only knew basic computer typing. The faculty taught GST return filing and voucher entries on real business case files, which helped me clear an accounts executive interview within three weeks of completing the course.',
      dateLabel: 'October 2026',
    },
    {
      id: 'rev-2',
      reviewerName: 'Ananya Mondal',
      rating: 5,
      courseTaken: 'Share Market & Technical Analysis',
      reviewText:
        'What sets Jharna Institute of Technology apart is their focus on risk management instead of blind tips. Reading price action and candlestick structures on live market charts gave me real confidence and discipline.',
      dateLabel: 'September 2026',
    },
    {
      id: 'rev-3',
      reviewerName: 'Ritwik Sen',
      rating: 5,
      courseTaken: 'Full-Stack Web Design & AI',
      reviewText:
        'Every student gets an individual desktop system and plenty of lab hours. Building and deploying my own responsive portfolio using HTML, CSS, JavaScript, and AI workflow tools made the classes genuinely practical.',
      dateLabel: 'August 2026',
    },
    {
      id: 'rev-4',
      reviewerName: 'Priyanka Das',
      rating: 5,
      courseTaken: 'ADCA Professional',
      reviewText:
        'Supportive instructors, flexible batch timings, and regular weekly assessments on the Student Portal. The Advanced Excel MIS reporting module was especially helpful for my office administration role.',
      dateLabel: 'July 2026',
    },
  ],
  certificates: [
    {
      id: 'JIT-2026-0101',
      studentName: 'Subham Chatterjee',
      course: 'Tally Prime with GST, TDS & E-Filing',
      grade: 'Grade A+ (94%)',
      issueDate: '15 Oct 2026',
    },
    {
      id: 'JIT-2025-0482',
      studentName: 'Ananya Mondal',
      course: 'Share Market, Technical Analysis & Trading',
      grade: 'Grade A (89%)',
      issueDate: '22 Dec 2025',
    },
  ],
  enquiries: [],
};
