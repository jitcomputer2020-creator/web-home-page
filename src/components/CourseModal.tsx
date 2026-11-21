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
import { PREFERRED_TIMINGS } from '../data/defaultData';
import { AdmissionEnquiry, Course } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface CourseModalProps {
  course: Course | null;
  contactPhone: string;
  onClose: () => void;
  onSubmitEnquiry: (
    payload: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>
  ) => AdmissionEnquiry;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  contactPhone,
  onClose,
  onSubmitEnquiry,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredTiming, setPreferredTiming] = useState<string>(PREFERRED_TIMINGS[0]);
  const [error, setError] = useState<string | null>(null);
  const [savedRecord, setSavedRecord] = useState<AdmissionEnquiry | null>(null);

  useEffect(() => {
    if (!course) return;
    setName('');
    setMobile('');
    setPreferredTiming(PREFERRED_TIMINGS[0]);
    setError(null);
    setSavedRecord(null);

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

    const record = onSubmitEnquiry({
      name: trimmedName,
      mobile: digits.slice(-10),
      course: course.title,
      preferredTiming,
      type: 'Enroll',
    });
    setSavedRecord(record);
  };

  const waHref = savedRecord
    ? buildWhatsAppUrl(
        `Hello JIT Computer Training Institute, I want to enroll in:\n• Course: ${savedRecord.course}\n• Name: ${savedRecord.name}\n• Mobile: ${savedRecord.mobile}\n• Preferred Timing: ${savedRecord.preferredTiming}`,
        contactPhone
      )
    : buildWhatsAppUrl(
        `Hello JIT Computer Training Institute, please share fee & batch details for ${course.title}.`,
        contactPhone
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
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-display font-bold text-base text-[#0A2463] mb-1">
              Enroll or Request Fee Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              Submit your contact details below and our admissions desk will reach out with batch timings.
            </p>

            {savedRecord ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>Enrollment inquiry saved for {savedRecord.course}</span>
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Send on WhatsApp ({contactPhone})</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Student Full Name"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                  />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono text-slate-900"
                  />
                  <select
                    value={preferredTiming}
                    onChange={(e) => setPreferredTiming(e.target.value)}
                    className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                  >
                    {PREFERRED_TIMINGS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-5 py-2 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold cursor-pointer"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Submit Enrollment Inquiry</span>
                  </button>

                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Ask on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
