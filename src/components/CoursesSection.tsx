import React, { useState } from 'react';
import { ArrowRight, BarChart3, Check, Clock, Laptop, Megaphone } from 'lucide-react';
import { Course } from '../types';

interface CoursesSectionProps {
  courses: Course[];
  onSelectCourseModal: (course: Course) => void;
}

function getCourseIcon(title: string, idx: number) {
  const lower = title.toLowerCase();
  if (lower.includes('market') || lower.includes('trading') || lower.includes('share')) {
    return BarChart3;
  }
  if (lower.includes('digital') || lower.includes('seo') || lower.includes('marketing')) {
    return Megaphone;
  }
  if (idx === 1) return Megaphone;
  if (idx === 2) return BarChart3;
  return Laptop;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  onSelectCourseModal,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section
      id="courses"
      className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 lg:mb-12">
          <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-2">
            Career-Focused Curriculum
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0A2463] tracking-tight text-balance">
            Our Specialized Training Programs
          </h2>
          <p className="text-slate-600 text-base mt-2.5 leading-relaxed">
            Explore our career tracks in Computer Application &amp; Coding, Digital Marketing Mastery, and Share Market Trading. Select any program to view its full syllabus and enroll.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-display font-semibold text-[#0A2463] text-lg">
              No courses published yet
            </p>
            <p className="text-slate-600 text-sm mt-1">
              Add programs anytime from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {courses.map((course, idx) => {
              const Icon = getCourseIcon(course.title, idx);
              const showCourseImg = Boolean(course.imageUrl) && !failedImages[course.id];

              return (
                <article
                  key={course.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-[#1E40AF] transition-colors duration-150"
                >
                  <div>
                    {/* Optional Custom Course Cover Image */}
                    {showCourseImg && (
                      <div className="aspect-[16/9] w-full bg-slate-200 overflow-hidden border-b border-slate-200">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [course.id]: true }))
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Royal Blue Header */}
                    <div className="bg-[#0A2463] text-white px-6 py-5 border-b-2 border-[#F59E0B]">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 text-[#F59E0B] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-amber-300">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {course.duration}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-blue-200 mb-1">
                        {course.category}
                      </p>
                      <h3 className="font-display font-extrabold text-xl text-white tracking-tight leading-snug">
                        {course.title}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-sm text-slate-600 leading-relaxed mb-5">
                        {course.summary}
                      </p>

                      <div className="border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-500 mb-3">
                          Key Syllabus Highlights
                        </p>
                        <ul className="space-y-2">
                          {course.modules.slice(0, 5).map((mod, mIdx) => (
                            <li
                              key={mIdx}
                              className="flex items-start gap-2 text-sm text-slate-700"
                            >
                              <Check
                                className="w-4 h-4 text-[#22863A] shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>

                        {course.modules.length > 5 && (
                          <p className="mt-3 text-xs font-semibold text-amber-700">
                            +{course.modules.length - 5} more modules in full syllabus
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>Program Fee</span>
                      <span className="font-semibold text-[#0A2463]">{course.fee}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectCourseModal(course)}
                      className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463]"
                    >
                      <span>View Syllabus / Enroll</span>
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
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
