import React from 'react';
import { Bell, CalendarDays } from 'lucide-react';
import { NoticeBadge, NoticeItem } from '../types';

interface NoticeBoardSectionProps {
  notices: NoticeItem[];
}

function getBadgeStyle(badge: NoticeBadge): string {
  switch (badge) {
    case 'New':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Exam':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'Batch':
      return 'bg-blue-50 text-[#0A2463] border-blue-200';
    case 'Holiday':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export const NoticeBoardSection: React.FC<NoticeBoardSectionProps> = ({ notices }) => {
  const activeNotices = notices.filter((n) => n.active && n.title.trim().length > 0);

  return (
    <section
      id="notices"
      className="py-14 lg:py-16 bg-white border-b border-slate-200 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-1">
              Announcements &amp; Schedules
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0A2463] tracking-tight">
              Live Notice Board &amp; Updates
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <Bell className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
            <span>Updated directly by JIT Administration</span>
          </div>
        </div>

        {activeNotices.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-display font-semibold text-[#0A2463]">
              No active notices at the moment
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Check back soon for upcoming batch dates and exam announcements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeNotices.map((notice) => (
              <article
                key={notice.id}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between gap-3 hover:border-[#1E40AF]/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-xs font-semibold ${getBadgeStyle(
                      notice.badge
                    )}`}
                  >
                    {notice.badge}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    {notice.date}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                  {notice.title}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
