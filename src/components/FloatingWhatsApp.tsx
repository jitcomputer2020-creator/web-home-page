import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/storage';

export const FloatingWhatsApp: React.FC = () => {
  const href = buildWhatsAppUrl(
    'Hello JIT Computer, I would like to know more about courses and batch timings.'
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with JIT Computer on WhatsApp"
      title="Chat on WhatsApp (+91 8961260151)"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 h-12 px-4 sm:h-13 sm:px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border border-emerald-500/40 transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap">
        WhatsApp Us
      </span>
    </a>
  );
};
