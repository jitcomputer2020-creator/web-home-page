import React, { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { JitLogo } from './JitLogo';

interface HeaderProps {
  onSecretAdminTrigger: () => void;
}

const NAV_LINKS = [
  { label: 'Courses', href: '#courses' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Verify', href: '#verify' },
  { label: 'Admissions', href: '#admissions' },
] as const;

export const Header: React.FC<HeaderProps> = ({ onSecretAdminTrigger }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  const handleBrandClick = () => {
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Title + Logo (5-click secret admin activation) */}
        <button
          type="button"
          onClick={handleBrandClick}
          className="flex items-center gap-3 text-left min-w-0 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded-lg py-1 pr-2 cursor-pointer select-none"
          title="Jharna Institute of Technology (JIT)"
        >
          <JitLogo className="w-9 h-9 shrink-0" />
          <span className="font-display font-bold text-sm sm:text-base lg:text-lg tracking-tight text-blue-950 whitespace-nowrap truncate max-w-[215px] sm:max-w-none">
            JHARNA INSTITUTE OF TECHNOLOGY (JIT)
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
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-amber-600 hover:text-blue-900 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#admissions"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
          >
            Apply Now
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 pb-1 sm:hidden">
            <a
              href="#admissions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center min-h-[44px] w-full rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
