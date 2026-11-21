import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  MessageCircle,
  Search,
  Send,
} from 'lucide-react';
import { DISPLAY_PHONE, PREFERRED_TIMINGS } from '../data/defaultData';
import { AdmissionEnquiry, CertificateRecord, Course } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface VerifyAndAdmissionSectionProps {
  certificates: CertificateRecord[];
  courses: Course[];
  selectedCourseForEnquiry: string;
  onSubmitEnquiry: (
    enquiry: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>
  ) => AdmissionEnquiry;
}

export const VerifyAndAdmissionSection: React.FC<VerifyAndAdmissionSectionProps> = ({
  certificates,
  courses,
  selectedCourseForEnquiry,
  onSubmitEnquiry,
}) => {
  // Certificate Verification state
  const [certQuery, setCertQuery] = useState('');
  const [verifiedAttempted, setVerifiedAttempted] = useState(false);
  const [foundCert, setFoundCert] = useState<CertificateRecord | null>(null);

  // Admission Enquiry form state
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [course, setCourse] = useState(courses[0]?.title ?? '');
  const [preferredTiming, setPreferredTiming] = useState<string>(PREFERRED_TIMINGS[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<AdmissionEnquiry | null>(null);

  useEffect(() => {
    if (selectedCourseForEnquiry) {
      setCourse(selectedCourseForEnquiry);
      setSubmittedRecord(null);
    }
  }, [selectedCourseForEnquiry]);

  useEffect(() => {
    if (!course && courses.length > 0) {
      setCourse(courses[0].title);
    }
  }, [courses, course]);

  const runCertificateLookup = (idToLookup: string) => {
    const normalized = idToLookup.trim().toUpperCase();
    setVerifiedAttempted(true);
    if (!normalized) {
      setFoundCert(null);
      return;
    }
    const match =
      certificates.find((c) => c.id.trim().toUpperCase() === normalized) ?? null;
    setFoundCert(match);
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCertificateLookup(certQuery);
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const digitsOnly = mobile.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setFormError('Please enter the student full name.');
      return;
    }
    if (digitsOnly.length < 10 || digitsOnly.length > 12) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!course) {
      setFormError('Please select a course.');
      return;
    }

    const saved = onSubmitEnquiry({
      name: trimmedName,
      mobile: digitsOnly.slice(-10),
      course,
      preferredTiming,
    });

    setSubmittedRecord(saved);
    setName('');
    setMobile('');
  };

  const whatsAppAdmissionHref = submittedRecord
    ? buildWhatsAppUrl(
        `Hello JIT Computer, I have submitted an Admission Enquiry:\n• Name: ${submittedRecord.name}\n• Mobile: ${submittedRecord.mobile}\n• Course: ${submittedRecord.course}\n• Preferred Timing: ${submittedRecord.preferredTiming}`
      )
    : buildWhatsAppUrl('Hello JIT Computer, I would like admission information.');

  return (
    <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Certificate Verification Widget */}
          <div
            id="verify"
            className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 scroll-mt-20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-blue-950 tracking-tight">
                  Certificate Verification
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Instant official record lookup
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Enter a JIT Certificate or Student ID to verify candidate details, completed program, grade, and issue date.
            </p>

            <form onSubmit={handleCertSubmit} className="space-y-3">
              <label htmlFor="certificate-id-input" className="block text-xs font-semibold text-slate-700">
                Certificate / Student ID
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="certificate-id-input"
                  type="text"
                  value={certQuery}
                  onChange={(e) => setCertQuery(e.target.value)}
                  placeholder="e.g. JIT-2026-0101"
                  className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono uppercase text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                  <span>Verify</span>
                </button>
              </div>
            </form>

            {/* Quick sample IDs */}
            {certificates.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Sample IDs:</span>
                {certificates.slice(0, 3).map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setCertQuery(sample.id);
                      runCertificateLookup(sample.id);
                    }}
                    className="font-mono text-blue-900 hover:text-amber-700 underline underline-offset-2 cursor-pointer"
                  >
                    {sample.id}
                  </button>
                ))}
              </div>
            )}

            {/* Verification Result */}
            {verifiedAttempted && (
              <div className="mt-6">
                {foundCert ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                      <span>Verified Authentic Certificate</span>
                    </div>

                    <dl className="grid grid-cols-1 gap-2.5 text-sm border-t border-emerald-200/80 pt-3">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-600">Certificate ID</dt>
                        <dd className="font-mono font-semibold text-blue-950 tabular-nums">
                          {foundCert.id}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-600">Student Name</dt>
                        <dd className="font-semibold text-blue-950 text-right">
                          {foundCert.studentName}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-600">Course</dt>
                        <dd className="font-medium text-slate-900 text-right">
                          {foundCert.course}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-600">Grade</dt>
                        <dd className="font-semibold text-amber-800 tabular-nums text-right">
                          {foundCert.grade}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-600">Issue Date</dt>
                        <dd className="font-mono text-slate-800 tabular-nums text-right">
                          {foundCert.issueDate}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ) : (
                  <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-4">
                    <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                      <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
                      <span>Record Not Found</span>
                    </div>
                    <p className="text-xs sm:text-sm text-rose-700 mt-1.5">
                      No certificate matched &ldquo;{certQuery.trim() || 'empty ID'}&rdquo;. Check the Certificate ID format or contact our office at {DISPLAY_PHONE}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Online Admission Enquiry Form */}
          <div
            id="admissions"
            className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 scroll-mt-20"
          >
            <div className="mb-6">
              <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-1">
                Direct Enrollment Desk
              </p>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-blue-950 tracking-tight">
                Online Admission &amp; Fee Enquiry
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Submit your details to reserve a batch seat or request complete fee structure via WhatsApp.
              </p>
            </div>

            {submittedRecord ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-blue-950">
                      Enquiry Saved Successfully
                    </h3>
                    <p className="text-sm text-slate-700 mt-1">
                      Thank you, <strong>{submittedRecord.name}</strong>. Your enquiry for{' '}
                      <strong>{submittedRecord.course}</strong> ({submittedRecord.preferredTiming}) has been logged with our admissions desk.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={whatsAppAdmissionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Send 1-Click WhatsApp ({DISPLAY_PHONE})</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmittedRecord(null)}
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAdmissionSubmit} className="space-y-4">
                {formError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-800"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="admission-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Student Full Name
                    </label>
                    <input
                      id="admission-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="admission-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      id="admission-mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono tabular-nums text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="admission-course" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Course
                    </label>
                    <select
                      id="admission-course"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="admission-timing" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Batch Timing
                    </label>
                    <select
                      id="admission-timing"
                      value={preferredTiming}
                      onChange={(e) => setPreferredTiming(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    >
                      {PREFERRED_TIMINGS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>Submit Admission Enquiry</span>
                  </button>

                  <a
                    href={buildWhatsAppUrl(
                      `Hello JIT Computer, I would like admission and fee details for ${course || 'a course'} (${preferredTiming}).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
