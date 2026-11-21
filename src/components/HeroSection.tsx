import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ShieldCheck, Monitor, Users, ClipboardCheck } from 'lucide-react';
import { DEFAULT_HERO_IMAGE, INSTITUTE_TIMINGS, PORTAL_LINKS } from '../data/defaultData';

interface HeroSectionProps {
  heroImageUrl: string;
}

const PORTAL_ICONS = {
  'student-portal': Monitor,
  'jit-group': Users,
  'test-knowledge': ClipboardCheck,
} as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ heroImageUrl }) => {
  const [imgError, setImgError] = useState(false);
  const resolvedHeroUrl = !imgError && heroImageUrl ? heroImageUrl : DEFAULT_HERO_IMAGE;

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-700 mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
              <span>ISO 9001:2015 Certified Practical Computer &amp; Share Market Training Institute</span>
            </p>

            <h1
              className="font-display font-extrabold text-blue-950 tracking-tight leading-[1.12] mb-5 text-balance"
              style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.35rem)' }}
            >
              Job-Ready Computer Skills &amp; Disciplined Share Market Training
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-7">
              Learn on dedicated desktop workstations at <strong className="font-semibold text-blue-950">JIT Computer</strong>—featuring <strong className="font-semibold text-blue-950">Basic and Advance</strong>, <strong className="font-semibold text-blue-950">Digital Marketing</strong>, and <strong className="font-semibold text-blue-950">Share Market</strong> training with hands-on mentorship.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a
                href="#admissions"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm sm:text-base transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href="#verify"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 bg-white hover:border-blue-900 hover:text-blue-900 text-slate-800 font-semibold text-sm sm:text-base transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                <span>Verify Certificate</span>
              </a>
            </div>

            {/* Clean unboxed institutional facts */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600 pt-5 border-t border-slate-200">
              <span className="font-medium text-blue-950">100% Practical Lab Hours</span>
              <span aria-hidden="true" className="text-amber-600">·</span>
              <span>Small Mentor-Led Batches</span>
              <span aria-hidden="true" className="text-amber-600">·</span>
              <span className="tabular-nums">{INSTITUTE_TIMINGS}</span>
            </div>
          </div>

          {/* Right Cover Image Column */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[260px] sm:min-h-[340px] lg:h-full rounded-xl overflow-hidden border border-slate-200 bg-blue-950">
              {!imgError ? (
                <img
                  src={resolvedHeroUrl}
                  alt="Jharna Institute of Technology practical computer and trading lab"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover aspect-[16/10] lg:aspect-auto"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-8 text-center">
                  <Monitor className="w-12 h-12 text-amber-400 mb-3" aria-hidden="true" />
                  <p className="font-display font-bold text-white text-lg">
                    Jharna Institute of Technology (JIT)
                  </p>
                  <p className="text-blue-200 text-sm mt-1">
                    Practical Computer &amp; Share Market Training Campus
                  </p>
                </div>
              )}

              {/* Measured Scrim for legible bottom caption */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent px-5 py-4">
                <p className="text-xs font-medium text-amber-300">
                  Jharna Institute of Technology (JIT)
                </p>
                <p className="text-sm font-semibold text-white">
                  Dedicated Computer Labs · Live Charting &amp; Digital Workstations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Prominent Quick-Access Portal Cards */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg sm:text-xl text-blue-950 tracking-tight">
              Quick Access Digital Portals
            </h2>
            <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline">
              Direct student &amp; examination services
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PORTAL_LINKS.map((portal) => {
              const Icon = PORTAL_ICONS[portal.id];
              return (
                <a
                  key={portal.id}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-800 hover:bg-blue-50/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-blue-800 transition-colors">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <ArrowUpRight
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-blue-950 mb-1.5">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {portal.description}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900 group-hover:text-amber-700 transition-colors">
                    <span>{portal.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
