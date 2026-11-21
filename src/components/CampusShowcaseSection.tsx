import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Laptop,
  MapPin,
  Monitor,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { DEFAULT_STOREFRONT_IMAGE } from '../data/defaultData';
import { CampusShowcaseSettings, FacilityIconKey } from '../types';

interface CampusShowcaseSectionProps {
  campusShowcase: CampusShowcaseSettings;
  onOpenDemoModal: () => void;
}

const FACILITY_ICON_MAP: Record<FacilityIconKey, React.ComponentType<{ className?: string }>> = {
  Monitor,
  Code2,
  TrendingUp,
  Users,
  Laptop,
  Award,
  BookOpen,
  Cpu,
};

function renderMiniIllustration(icon: FacilityIconKey, isNavy: boolean) {
  if (icon === 'TrendingUp') {
    return (
      <svg
        viewBox="0 0 120 34"
        aria-hidden="true"
        className="w-full h-7 mt-2 opacity-80"
        fill="none"
      >
        <path
          d="M2 28 L22 20 L38 24 L56 12 L74 16 L94 6 L116 9"
          stroke={isNavy ? '#F59E0B' : '#1E40AF'}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="56" cy="12" r="3" fill={isNavy ? '#FBBF24' : '#F59E0B'} />
        <circle cx="94" cy="6" r="3.5" fill={isNavy ? '#34D399' : '#10B981'} />
      </svg>
    );
  }
  if (icon === 'Code2') {
    return (
      <div
        aria-hidden="true"
        className={`mt-2 rounded-md px-2.5 py-1.5 font-mono text-[10px] leading-tight border ${
          isNavy
            ? 'bg-blue-950/60 border-blue-700/60 text-blue-200'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}
      >
        <span className="text-amber-500 font-bold">&lt;code&gt;</span> Excel · Tally · Web
      </div>
    );
  }
  if (icon === 'Monitor' || icon === 'Laptop' || icon === 'Cpu') {
    return (
      <div aria-hidden="true" className="mt-2 flex items-center gap-1.5">
        <span
          className={`h-1.5 flex-1 rounded-full ${
            isNavy ? 'bg-amber-400/80' : 'bg-[#0A2463]/80'
          }`}
        />
        <span
          className={`h-1.5 w-6 rounded-full ${
            isNavy ? 'bg-blue-400/60' : 'bg-amber-400'
          }`}
        />
        <span
          className={`h-1.5 w-3 rounded-full ${
            isNavy ? 'bg-emerald-400/70' : 'bg-blue-300'
          }`}
        />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="mt-2 flex items-center gap-1">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot === 0
              ? 'bg-[#F59E0B]'
              : isNavy
                ? 'bg-blue-300/70'
                : 'bg-[#1E40AF]/40'
          }`}
        />
      ))}
      <span
        className={`ml-1 text-[10px] font-medium ${
          isNavy ? 'text-blue-200' : 'text-slate-500'
        }`}
      >
        100% Guided
      </span>
    </div>
  );
}

export const CampusShowcaseSection: React.FC<CampusShowcaseSectionProps> = ({
  campusShowcase,
  onOpenDemoModal,
}) => {
  const [imgError, setImgError] = useState(false);

  const storefrontSrc = imgError
    ? DEFAULT_STOREFRONT_IMAGE
    : campusShowcase.storefrontImageUrl || DEFAULT_STOREFRONT_IMAGE;

  const scrollToCourses = () => {
    const el = document.getElementById('courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="campus"
      className="relative overflow-hidden py-16 lg:py-22 bg-gradient-to-b from-white via-[#F4F7FF] to-[#E8F0FE] border-b border-blue-100 scroll-mt-16"
    >
      {/* Crisp White & Royal-Blue Wavy Layered Gradient Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1E40AF]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 inset-x-0 overflow-hidden leading-none"
      >
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="w-full h-28 sm:h-36 lg:h-44"
        >
          <defs>
            <linearGradient id="jitCampusWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0A2463" stopOpacity="0.14" />
              <stop offset="50%" stopColor="#1E40AF" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#0A2463" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 C260,185 480,35 760,95 C1040,155 1240,65 1440,105 L1440,200 L0,200 Z"
            fill="url(#jitCampusWaveGrad)"
          />
          <path
            d="M0,155 C320,95 620,195 960,130 C1180,88 1320,140 1440,125 L1440,200 L0,200 Z"
            fill="#0A2463"
            fillOpacity="0.08"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-1.5">
            Practical Infrastructure &amp; Learning Environment
          </p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0A2463] tracking-tight">
            {campusShowcase.sectionTitle}
          </h2>
        </div>

        {/* 3-Column 3D Layered Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-stretch">
          {/* LEFT COLUMN: Large Featured Campus Card with Glowing Royal-Blue Frame */}
          <div className="lg:col-span-4 flex">
            <div className="group relative w-full rounded-2xl bg-white p-2 border-2 border-blue-500 shadow-xl shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/40">
              <div className="relative w-full h-full min-h-[340px] sm:min-h-[410px] rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={storefrontSrc}
                  alt={`${campusShowcase.sectionTitle} — ${campusShowcase.locationBadge}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none" />

                {/* Floating White Location Pill Badge at Bottom-Left */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xs text-[#0A2463] text-xs sm:text-sm font-bold shadow-lg border border-blue-100">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                    <span>{campusShowcase.locationBadge}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: 2x2 Stylish Facility Bento Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {campusShowcase.bentoCards.slice(0, 4).map((card) => {
              const Icon = FACILITY_ICON_MAP[card.icon] || Monitor;
              const isNavy = card.cardStyle === 'navy-gradient';
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={scrollToCourses}
                  className={`group text-left rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] ${
                    isNavy
                      ? 'bg-gradient-to-br from-[#0A2463] via-[#13388A] to-[#1E40AF] text-white border border-blue-700/70 shadow-[0_16px_34px_-12px_rgba(10,36,99,0.52)] hover:shadow-[0_22px_42px_-12px_rgba(10,36,99,0.68)]'
                      : 'bg-white text-[#0A2463] border border-blue-100 shadow-[0_16px_34px_-12px_rgba(15,23,42,0.12)] hover:border-[#1E40AF]/40 hover:shadow-[0_22px_42px_-12px_rgba(30,64,175,0.20)]'
                  }`}
                >
                  <div>
                    {card.imageUrl ? (
                      <div className="w-full aspect-[16/10] rounded-lg overflow-hidden mb-3 border border-white/15 bg-slate-900/10">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105 ${
                          isNavy
                            ? 'bg-white/15 text-[#F59E0B] border border-white/15'
                            : 'bg-[#0A2463] text-[#F59E0B] shadow-xs'
                        }`}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    )}

                    <h3
                      className={`font-display font-bold text-sm sm:text-base leading-snug ${
                        isNavy ? 'text-white' : 'text-[#0A2463]'
                      }`}
                    >
                      {card.title}
                    </h3>

                    {card.subtitle && (
                      <p
                        className={`text-xs mt-1 leading-snug ${
                          isNavy ? 'text-blue-200' : 'text-slate-600'
                        }`}
                      >
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {!card.imageUrl && renderMiniIllustration(card.icon, isNavy)}
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Welcome & Highlights Panel */}
          <div className="lg:col-span-4 flex">
            <div className="w-full rounded-2xl bg-white/95 backdrop-blur-xs border border-blue-100 p-6 sm:p-7 shadow-[0_20px_45px_-14px_rgba(10,36,99,0.18)] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
                  <Building2 className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  <span>JIT Training Center</span>
                </div>

                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A2463] tracking-tight leading-tight">
                  {campusShowcase.welcomeHeading}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {campusShowcase.welcomeDescription}
                </p>

                {/* 5-Star Google Rating Display */}
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <div
                      className="flex items-center gap-1 mb-1"
                      aria-label="5 out of 5 stars"
                    >
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#0A2463] tabular-nums">
                      {campusShowcase.ratingText}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-800 bg-white px-2.5 py-1 rounded-md border border-amber-200">
                    Google Verified
                  </span>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22863A] shrink-0" aria-hidden="true" />
                    <span>100% Hands-on Desktop Workstations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22863A] shrink-0" aria-hidden="true" />
                    <span>Live Share Market &amp; Technical Chart Lab</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22863A] shrink-0" aria-hidden="true" />
                    <span>Govt. Registered &amp; ISO Certified Programs</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={scrollToCourses}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0A2463] hover:bg-[#1E40AF] text-white font-bold text-sm sm:text-base shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] focus-visible:ring-offset-2"
                >
                  <span>{campusShowcase.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenDemoModal}
                  className="w-full py-2 text-xs font-semibold text-[#1E40AF] hover:text-amber-700 underline underline-offset-4 cursor-pointer"
                >
                  Or book a free live campus demo visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
