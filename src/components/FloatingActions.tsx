import React from 'react';
import { MessageCircle, SlidersHorizontal } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/storage';

interface FloatingActionsProps {
  contactPhone: string;
  isAdminLoggedIn: boolean;
  onOpenAdminPanel: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  contactPhone,
  isAdminLoggedIn,
  onOpenAdminPanel,
}) => {
  const href = buildWhatsAppUrl(
    'Hello JIT Computer Training Institute, I would like to know more about courses and batch timings.',
    contactPhone
  );

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2.5">
      {isAdminLoggedIn && (
        <button
          type="button"
          onClick={onOpenAdminPanel}
          className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[#0A2463] hover:bg-[#1E40AF] text-white shadow-lg border border-amber-400/60 text-xs sm:text-sm font-bold transition-transform duration-150 hover:scale-[1.02] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
          <span>Admin Edit Panel</span>
        </button>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with JIT on WhatsApp"
        title={`Chat on WhatsApp (${contactPhone})`}
        className="inline-flex items-center gap-2 h-11 px-4 sm:h-12 sm:px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border border-emerald-500/40 transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
};
