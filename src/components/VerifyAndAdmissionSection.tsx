import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Send,
} from 'lucide-react';
import { PREFERRED_TIMINGS } from '../data/defaultData';
import {
  AdmissionEnquiry,
  CertificateRecord,
  ContactSettings,
  Course,
} from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface VerifyAndAdmissionSectionProps {
  certificates: CertificateRecord[];
  courses: Course[];
  contact: ContactSettings;
  onSubmitEnquiry: (
    enquiry: Omit<AdmissionEnquiry, 'id' | 'submittedAt' | 'status'>
  ) => { record: AdmissionEnquiry; waUrl: string };
}

export const VerifyAndAdmissionSection: React.FC<VerifyAndAdmissionSectionProps> = ({
  certificates,
  courses,
  contact,
  onSubmitEnquiry,
}) => {
  const [certQuery, setCertQuery] = useState('');
  const [verifiedAttempted, setVerifiedAttempted] = useState(false);
  const [foundCert, setFoundCert] = useState<CertificateRecord | null>(null);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [course, setCourse] = useState(courses[0]?.title ?? '');
  const [preferredTiming, setPreferredTiming] = useState<string>(PREFERRED_TIMINGS[0]);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{
    record: AdmissionEnquiry;
    waUrl: string;
  } | null>(null);

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
      setFormError('Please enter your full name.');
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

    const trimmedNotes = message.trim();
    const combinedMessage = trimmedNotes
      ? `${trimmedNotes} (Preferred Timing: ${preferredTiming})`
      : `Admission Enquiry — Preferred Timing: ${preferredTiming}`;

    const result = onSubmitEnquiry({
      name: trimmedName,
      mobile: digitsOnly.slice(-10),
      course,
      preferredTiming,
      message: combinedMessage,
      type: 'Enroll',
    });

    setSubmittedInfo(result);
    setName('');
    setMobile('');
    setCourse(courses[0]?.title ?? '');
    setPreferredTiming(PREFERRED_TIMINGS[0]);
    setMessage('');
  };

  return (
    <section
      id="contact"
      className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Certificate Verification + Direct Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div
              id="verify"
              className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 scroll-mt-20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#0A2463] text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-[#0A2463] tracking-tight">
                    Certificate Verification
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instant official record lookup
                  </p>
                </div>
              </div>

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
                    className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono uppercase text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                    <span>Verify</span>
                  </button>
                </div>
              </form>

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
                      className="font-mono text-[#1E40AF] hover:text-amber-700 underline underline-offset-2 cursor-pointer"
                    >
                      {sample.id}
                    </button>
                  ))}
                </div>
              )}

              {verifiedAttempted && (
                <div className="mt-5">
                  {foundCert ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
                      <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                        <span>Verified Authentic Certificate</span>
                      </div>

                      <dl className="grid grid-cols-1 gap-2 text-sm border-t border-emerald-200/80 pt-3">
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-600">Certificate ID</dt>
                          <dd className="font-mono font-semibold text-[#0A2463] tabular-nums">
                            {foundCert.id}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-600">Student Name</dt>
                          <dd className="font-semibold text-[#0A2463] text-right">
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
                        No certificate matched &ldquo;{certQuery.trim() || 'empty ID'}&rdquo;. Contact {contact.phone} for assistance.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Editable Contact Details Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-display font-bold text-lg text-[#0A2463] mb-4">
                Institute Contact Information
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="font-mono font-semibold text-[#0A2463] hover:text-amber-700 tabular-nums"
                  >
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#0A2463] break-all"
                  >
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0A2463] hover:underline underline-offset-2"
                  >
                    {contact.address}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="tabular-nums">{contact.timings}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Online Admission & Contact Inquiry Form */}
          <div
            id="admissions"
            className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 scroll-mt-20"
          >
            <div className="mb-6">
              <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-1">
                Direct Enrollment &amp; Contact Desk
              </p>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0A2463] tracking-tight">
                Online Admission &amp; Fee Enquiry
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Fill out your details below and click Submit to send your inquiry directly to JIT on WhatsApp.
              </p>
            </div>

            {submittedInfo && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#0A2463]">
                      Redirecting to JIT WhatsApp...
                    </h3>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Inquiry for <strong>{submittedInfo.record.course}</strong> logged for{' '}
                      <strong>{submittedInfo.record.name}</strong>.
                    </p>
                  </div>
                </div>

                <a
                  href={submittedInfo.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[38px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open WhatsApp ({contact.whatsappNumber})</span>
                </a>
              </div>
            )}

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
                    Name
                  </label>
                  <input
                    id="admission-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                  />
                </div>

                <div>
                  <label htmlFor="admission-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="admission-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile / WhatsApp number"
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-mono tabular-nums text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="admission-course" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Course Interested
                  </label>
                  <select
                    id="admission-course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
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
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
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
                <label htmlFor="admission-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message / Notes
                </label>
                <textarea
                  id="admission-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write any questions about fees, syllabus, batch schedules, or career guidance..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2463]"
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] focus-visible:ring-offset-2"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Submit</span>
                </button>

                <a
                  href={buildWhatsAppUrl(
                    `Hello JIT Computer Training Institute, I would like to inquire/apply:\n- Name: Student\n- Phone: Not provided\n- Course: ${course || 'General Program'}\n- Message: Looking for fee & batch details (${preferredTiming}).`,
                    contact.whatsappNumber
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
          </div>
        </div>
      </div>
    </section>
  );
};
