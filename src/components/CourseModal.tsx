import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { AdmissionEnquiry, Course } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface CourseModalProps {
  course: Course | null;
  courses: Course[];
  whatsappNumber: string;
  onClose: () => void;
  onSubmitEnquiry: (
    payload: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>
  ) => { record: AdmissionEnquiry; waUrl: string };
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  courses,
  whatsappNumber,
  onClose,
  onSubmitEnquiry,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{
    record: AdmissionEnquiry;
    waUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!course) return;
    setName('');
    setMobile('');
    setSelectedCourse(course.title);
    setMessage('');
    setError(null);
    setSubmittedInfo(null);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [course, onClose]);

  if (!course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const digits = mobile.replace(/\D/g, '');
    if (trimmedName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (digits.length < 10 || digits.length > 12) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const result = onSubmitEnquiry({
      name: trimmedName,
      mobile: digits.slice(-10),
      course: selectedCourse || course.title,
      preferredTiming: 'Flexible',
      message: message.trim() || 'Interested in course enrollment & fee details.',
      type: 'Enroll',
    });

    setSubmittedInfo(result);
    setName('');
    setMobile('');
    setSelectedCourse(course.title);
    setMessage('');
  };

  const quickWaHref = buildWhatsAppUrl(
    `Hello JIT Computer Training Institute, I would like to inquire/apply:\n- Name: Student\n- Phone: Not provided\n- Course: ${selectedCourse || course.title}\n- Message: Please share fee & batch details.`,
    whatsappNumber
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0A2463] text-white px-6 py-5 border-b-2 border-[#F59E0B] flex items-start justify-between gap-4 shrink-0">
          <div>
            <p className="text-xs font-semibold text-amber-300 mb-1">
              {course.category} · <span className="font-mono tabular-nums">{course.duration}</span>
            </p>
            <h2 id="course-modal-title" className="font-display font-extrabold text-xl sm:text-2xl">
              {course.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close course syllabus"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Course Summary & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 text-sm">
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <Clock className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
              Duration: <strong className="text-[#0A2463]">{course.duration}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <BookOpen className="w-4 h-4 text-amber-600" aria-hidden="true" />
              Fee: <strong className="text-[#0A2463]">{course.fee}</strong>
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {course.summary}
          </p>

          {/* Complete Syllabus */}
          <div>
            <h3 className="font-display font-bold text-base text-[#0A2463] mb-3">
              Complete Course Syllabus
            </h3>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.modules.map((mod, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800"
                >
                  <span className="font-mono text-xs font-bold text-[#1E40AF] tabular-nums mt-0.5">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="flex-1 font-medium">{mod}</span>
                  <Check className="w-4 h-4 text-[#22863A] shrink-0 mt-0.5" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>

          {/* Enrollment / Quick Inquiry Form */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div>
              <h3 className="font-display font-bold text-base text-[#0A2463] mb-1">
                Enroll or Request Fee Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Fill in your details below to send your enrollment inquiry directly to JIT on WhatsApp.
              </p>
            </div>

            {submittedInfo && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>Redirecting to JIT WhatsApp...</span>
                </div>
                <a
                  href={submittedInfo.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open WhatsApp ({whatsappNumber})</span>
                </a>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="course-modal-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    id="course-modal-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Student Full Name"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="course-modal-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="course-modal-phone"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="course-modal-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Interested
                  </label>
                  <select
                    id="course-modal-select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="course-modal-message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Notes
                </label>
                <textarea
                  id="course-modal-message"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Preferred batch timing, questions about fees, or notes..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Submit</span>
                </button>

                <a
                  href={quickWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
