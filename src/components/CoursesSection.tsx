import React, { useState } from 'react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Course, CourseCategory } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';

interface CoursesSectionProps {
  courses: Course[];
  onEnquireCourse: (courseTitle: string) => void;
}

const CATEGORIES: Array<'All' | CourseCategory> = [
  'All',
  'Basic & Office',
  'Tally & GST',
  'Web & AI',
  'Share Market Trading',
];

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onEnquireCourse }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | CourseCategory>('All');

  const filteredCourses =
    activeCategory === 'All'
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <section id="courses" className="py-16 lg:py-20 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-2">
              Career-Oriented Curriculum
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-blue-950 tracking-tight text-balance">
              Courses &amp; Training Programs
            </h2>
            <p className="text-slate-600 text-base mt-2.5">
              Practical lab-first programs tailored for office administration, GST accounting, modern web &amp; AI workflows, and disciplined stock market trading.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter courses by category"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 self-start lg:self-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-blue-950 hover:bg-white/70'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="font-display font-semibold text-blue-950 text-lg">
              No courses found in {activeCategory}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              Select another category or contact our admissions desk for upcoming batch schedules.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, idx) => {
              const whatsappHref = buildWhatsAppUrl(
                `Hello JIT Computer, I would like fee and batch details for the course: ${course.title} (${course.duration}).`
              );

              return (
                <article
                  key={course.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 hover:border-blue-800/60 transition-colors duration-150"
                >
                  <div>
                    {/* Zero-pill clean unboxed metadata */}
                    <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500 mb-3">
                      <span className="text-amber-700 font-semibold">{course.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-blue-900 font-medium">
                        {course.duration}
                      </span>
                      <span className="ml-auto font-mono text-slate-400 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg sm:text-xl text-blue-950 tracking-tight mb-2.5">
                      {course.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-5">
                      {course.summary}
                    </p>

                    <div className="border-t border-slate-100 pt-4 mb-6">
                      <p className="text-xs font-semibold text-slate-700 mb-2.5">
                        Key Modules Covered
                      </p>
                      <ul className="space-y-2">
                        {course.modules.map((mod, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-2 text-sm text-slate-700">
                            <Check
                              className="w-4 h-4 text-blue-800 shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 border-t border-slate-200 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onEnquireCourse(course.title)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
                    >
                      <span>Enquire / Contact for Fees</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </button>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`WhatsApp fee enquiry for ${course.title}`}
                      aria-label={`WhatsApp enquiry for ${course.title}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors duration-150 shrink-0"
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
