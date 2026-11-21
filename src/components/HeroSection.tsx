import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Award, CheckCircle2, ClipboardCheck, Monitor, ShieldCheck, Users } from 'lucide-react';
import { DEFAULT_HERO_IMAGE, PORTAL_LINKS } from '../data/defaultData';
import { HeroSettings } from '../types';
import { JitLogo } from './JitLogo';

interface HeroSectionProps {
  hero: HeroSettings;
  onOpenDemoModal: () => void;
}

const PORTAL_ICONS = {
  'student-portal': Monitor,
  'jit-group': Users,
  'test-knowledge': ClipboardCheck,
} as const;

const TRUST_ITEMS = [
  'Govt. Registered',
  'ISO Certified',
  '100% Practical Training',
  'Valid Certification',
] as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, onOpenDemoModal }) => {
  const [imgError, setImgError] = useState(false);
  const resolvedHeroUrl = !imgError && hero.heroImageUrl ? hero.heroImageUrl : DEFAULT_HERO_IMAGE;

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pt-12 lg:pb-14">
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Prominent JIT Logo Lockup */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
                <JitLogo className="w-14 h-14" showWordmark={false} />
              </div>
              <div>
                <p className="font-display font-extrabold text-base sm:text-lg text-[#0A2463] leading-tight">
                  JIT Computer Training Institute
                </p>
                <p className="text-xs sm:text-sm font-semibold text-amber-700 tracking-wide">
                  Jharna Institute of Technology
                </p>
              </div>
            </div>

            <h1
              className="font-display font-extrabold text-[#0A2463] tracking-tight leading-[1.12] mb-4 text-balance"
              style={{ fontSize: 'clamp(2.1rem, 3.6vw, 3.35rem)' }}
            >
              {hero.headline}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-7">
              {hero.subheadline}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-7">
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-lg bg-[#0A2463] hover:bg-[#1E40AF] text-white font-semibold text-sm sm:text-base transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] focus-visible:ring-offset-2"
              >
                <span>Explore Our Courses</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onOpenDemoModal}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] focus-visible:ring-offset-2"
              >
                <span>Book a Free Demo</span>
              </button>
            </div>

            {/* Trust Strip */}
            <div className="pt-5 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700">
                {TRUST_ITEMS.map((item, idx) => (
                  <React.Fragment key={item}>
                    <span className="inline-flex items-center gap-1.5">
                      {idx === 0 || idx === 1 ? (
                        <ShieldCheck className="w-4 h-4 text-[#22863A] shrink-0" aria-hidden="true" />
                      ) : idx === 2 ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1E40AF] shrink-0" aria-hidden="true" />
                      ) : (
                        <Award className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                      )}
                      <span>{item}</span>
                    </span>
                    {idx < TRUST_ITEMS.length - 1 && (
                      <span aria-hidden="true" className="text-slate-300 hidden sm:inline">
                        |
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Right Cover Image Column */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[260px] sm:min-h-[340px] lg:h-full rounded-xl overflow-hidden border border-slate-200 bg-[#0A2463]">
              {!imgError ? (
                <img
                  src={resolvedHeroUrl}
                  alt="Students practicing in Jharna Institute of Technology modern computer and stock market lab"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover aspect-[16/10] lg:aspect-auto"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#0A2463] via-[#1E40AF] to-slate-900 flex flex-col items-center justify-center p-8 text-center">
                  <Monitor className="w-12 h-12 text-[#F59E0B] mb-3" aria-hidden="true" />
                  <p className="font-display font-bold text-white text-lg">
                    JIT Computer Training Institute
                  </p>
                  <p className="text-blue-200 text-sm mt-1">
                    Practical Computer, Coding, Digital Marketing &amp; Share Market Lab
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent px-5 py-4">
                <p className="text-xs font-semibold text-amber-300">
                  Jharna Institute of Technology
                </p>
                <p className="text-sm font-semibold text-white">
                  100% Practical Computer, Digital Marketing &amp; Stock Market Lab
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Access Institute Portals */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PORTAL_LINKS.map((portal) => {
              const Icon = PORTAL_ICONS[portal.id];
              return (
                <a
                  key={portal.id}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-[#1E40AF] hover:bg-blue-50/40 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#0A2463] text-[#F59E0B] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display font-bold text-sm sm:text-base text-[#0A2463] truncate">
                        {portal.title}
                      </h2>
                      <p className="text-xs text-slate-600 truncate">
                        {portal.description}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-slate-400 group-hover:text-[#0A2463] shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
