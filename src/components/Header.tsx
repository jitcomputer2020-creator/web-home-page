import React, { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandingSettings } from '../types';
import { JitLogo } from './JitLogo';

interface HeaderProps {
  branding: BrandingSettings;
  ctaLabel: string;
  onSecretAdminTrigger: () => void;
  onOpenDemoModal: () => void;
}

const NAV_LINKS = [
  { label: 'Courses', href: '#courses' },
  { label: 'Notices', href: '#notices' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
] as const;

export const Header: React.FC<HeaderProps> = ({
  branding,
  ctaLabel,
  onSecretAdminTrigger,
  onOpenDemoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  const handleLogoClick = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    clickCountRef.current += 1;

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      onSecretAdminTrigger();
      return;
    }

    resetTimerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 4000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: JIT Logo + Editable Institute Name (5-click secret admin trigger) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] rounded-lg py-1 pr-2 cursor-pointer select-none"
          title={branding.instituteName}
        >
          <JitLogo
            customLogoUrl={branding.customLogoUrl}
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0"
          />
          <span className="font-display font-extrabold text-sm sm:text-base lg:text-lg tracking-tight text-[#0A2463] whitespace-nowrap truncate max-w-[205px] sm:max-w-none">
            {branding.instituteName}
          </span>
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#F59E0B] hover:text-[#0A2463] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-slate-950 bg-[#F59E0B] hover:bg-amber-400 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0A2463] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 pb-1 sm:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="flex items-center justify-center min-h-[44px] w-full rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors cursor-pointer"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
