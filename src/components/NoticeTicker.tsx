import React from 'react';
import { Megaphone } from 'lucide-react';
import { NoticeItem } from '../types';

interface NoticeTickerProps {
  notices: NoticeItem[];
}

export const NoticeTicker: React.FC<NoticeTickerProps> = ({ notices }) => {
  const activeNotices = notices.filter((n) => n.active && n.text.trim().length > 0);

  if (activeNotices.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-blue-950 text-white border-b border-amber-500/30"
      role="region"
      aria-label="Live Institute Notice Board"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 overflow-hidden">
        <div className="flex items-center gap-2 pr-4 mr-4 border-r border-blue-800 shrink-0 text-amber-400 text-xs font-semibold tracking-wide">
          <Megaphone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Notice Board</span>
        </div>

        <div className="jit-marquee-container flex-1 overflow-hidden">
          <div className="jit-marquee-track items-center gap-8 text-xs sm:text-sm text-blue-50">
            {[0, 1].map((dupIndex) => (
              <div key={dupIndex} className="flex items-center gap-8 shrink-0" aria-hidden={dupIndex === 1}>
                {activeNotices.map((notice) => (
                  <span key={`${dupIndex}-${notice.id}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                    <span>{notice.text}</span>
                    <span className="text-amber-400" aria-hidden="true">
                      /
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
