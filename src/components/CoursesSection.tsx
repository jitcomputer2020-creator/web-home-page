import React from 'react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Course } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface CoursesSectionProps {
  courses: Course[];
  onEnquireCourse: (courseTitle: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onEnquireCourse }) => {
  return (
    <section id="courses" className="py-16 lg:py-20 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 lg:mb-12">
          <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-2">
            Official Career Programs
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-blue-950 tracking-tight text-balance">
            Our 3 Specialized Training Programs
          </h2>
          <p className="text-slate-600 text-base mt-2.5 leading-relaxed">
            Structured, 100% practical lab-based syllabi built for computer fluency, high-growth digital marketing, and disciplined share market trading.
          </p>
        </div>

        {/* 3-Column Professional Course Cards */}
        {courses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="font-display font-semibold text-blue-950 text-lg">
              No courses configured
            </p>
            <p className="text-slate-600 text-sm mt-1">
              Add programs through the Admin Panel or contact our admissions desk.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {courses.map((course, idx) => {
              const whatsappHref = buildWhatsAppUrl(
                `Hello JIT Computer, I would like fee and batch details for the ${course.title} program.`
              );

              return (
                <article
                  key={course.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-blue-900/60 transition-colors duration-150"
                >
                  <div>
                    {/* Premium Royal Blue & Gold Card Header */}
                    <div className="bg-blue-950 text-white px-6 py-5 border-b-2 border-amber-500">
                      <div className="flex items-center justify-between gap-3 text-xs font-medium text-amber-300 mb-2">
                        <span className="font-mono tabular-nums tracking-wide">
                          Program {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-blue-200 font-normal">
                          {course.duration}
                        </span>
                      </div>

                      <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white uppercase">
                        {course.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mt-2">
                        {course.summary}
                      </p>
                    </div>

                    {/* Complete Numbered Syllabus List */}
                    <div className="px-6 pt-5 pb-4">
                      <p className="text-xs font-semibold text-slate-500 mb-3.5">
                        Course Syllabus &amp; Core Modules
                      </p>

                      <ol className="space-y-2.5">
                        {course.modules.map((mod, mIdx) => (
                          <li
                            key={mIdx}
                            className="flex items-start gap-2.5 text-sm text-slate-800 leading-snug"
                          >
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-50 text-blue-900 font-mono text-xs font-semibold tabular-nums shrink-0 mt-0.5">
                              {mIdx + 1}
                            </span>
                            <span className="flex-1 font-medium text-slate-800">{mod}</span>
                            <Check
                              className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                          </li>
                        ))}
                      </ol>

                      {/* Footer Note: "AND MORE..." */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-display font-bold tracking-wider text-amber-700">
                          {course.footerNote || 'AND MORE...'}
                        </span>
                        <span className="text-xs text-slate-500 font-mono tabular-nums">
                          {course.modules.length}+ Modules
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 pb-6 pt-2 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onEnquireCourse(course.title)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
                    >
                      <span>Contact for Fees / Enquire Now</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </button>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`WhatsApp enquiry for ${course.title}`}
                      aria-label={`WhatsApp enquiry for ${course.title}`}
                      className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors duration-150 shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
