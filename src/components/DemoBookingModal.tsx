import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, CheckCircle2, MessageCircle, Send, X } from 'lucide-react';
import { PREFERRED_TIMINGS } from '../data/defaultData';
import { AdmissionEnquiry, Course } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface DemoBookingModalProps {
  isOpen: boolean;
  courses: Course[];
  whatsappNumber: string;
  onClose: () => void;
  onSubmitEnquiry: (
    payload: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>
  ) => { record: AdmissionEnquiry; waUrl: string };
}

export const DemoBookingModal: React.FC<DemoBookingModalProps> = ({
  isOpen,
  courses,
  whatsappNumber,
  onClose,
  onSubmitEnquiry,
}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.title ?? '');
  const [preferredTiming, setPreferredTiming] = useState<string>(PREFERRED_TIMINGS[0]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{
    record: AdmissionEnquiry;
    waUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setMobile('');
    setSelectedCourse(courses[0]?.title ?? '');
    setPreferredTiming(PREFERRED_TIMINGS[0]);
    setMessage('');
    setError(null);
    setSubmittedInfo(null);

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, courses, onClose]);

  if (!isOpen) return null;

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

    const trimmedNotes = message.trim();
    const combinedMessage = trimmedNotes
      ? `${trimmedNotes} (Preferred Timing: ${preferredTiming})`
      : `Free Demo Request — Preferred Timing: ${preferredTiming}`;

    const result = onSubmitEnquiry({
      name: trimmedName,
      mobile: digits.slice(-10),
      course: selectedCourse || 'General Demo Session',
      preferredTiming,
      message: combinedMessage,
      type: 'Demo',
    });

    setSubmittedInfo(result);
    setName('');
    setMobile('');
    setSelectedCourse(courses[0]?.title ?? '');
    setPreferredTiming(PREFERRED_TIMINGS[0]);
    setMessage('');
  };

  const quickWaHref = buildWhatsAppUrl(
    'Hello JIT Computer Training Institute, I would like to book a Free Demo class.',
    whatsappNumber
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0A2463] text-white px-6 py-4 border-b-2 border-[#F59E0B] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F59E0B] text-slate-950 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="demo-modal-title" className="font-display font-bold text-lg">
                Book a Free Practical Demo
              </h2>
              <p className="text-xs text-blue-200">
                Experience our computer &amp; trading lab before enrolling
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close demo booking modal"
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {submittedInfo && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-display font-bold text-sm text-[#0A2463]">
                    Redirecting to JIT WhatsApp...
                  </p>
                  <p className="text-xs text-slate-700">
                    Demo request for {submittedInfo.record.course} saved.
                  </p>
                </div>
              </div>

              <a
                href={submittedInfo.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open WhatsApp</span>
              </a>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="demo-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Name
              </label>
              <input
                id="demo-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="demo-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                id="demo-mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile / WhatsApp number"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-mono text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="demo-course" className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Interested
                </label>
                <select
                  id="demo-course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="demo-timing" className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Demo Timing
                </label>
                <select
                  id="demo-timing"
                  value={preferredTiming}
                  onChange={(e) => setPreferredTiming(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900"
                >
                  {PREFERRED_TIMINGS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="demo-message" className="block text-xs font-semibold text-slate-700 mb-1">
                Message / Notes
              </label>
              <textarea
                id="demo-message"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any specific topics, questions, or notes for your demo session..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 text-sm font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Submit</span>
              </button>

              <a
                href={quickWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
