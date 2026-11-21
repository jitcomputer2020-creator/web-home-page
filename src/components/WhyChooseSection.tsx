import React from 'react';
import { Award, Briefcase, Laptop, Users } from 'lucide-react';

const FEATURES = [
  {
    title: 'Practical Training',
    description:
      'Dedicated individual desktop workstations with 100% hands-on lab sessions from day one.',
    icon: Laptop,
    accentClass: 'bg-blue-950 text-amber-400',
  },
  {
    title: 'Expert Mentorship',
    description:
      'Learn directly from experienced IT trainers, marketing strategists, and active market practitioners.',
    icon: Users,
    accentClass: 'bg-emerald-800 text-white',
  },
  {
    title: 'Valid Certifications',
    description:
      'Govt. registered & ISO certified credentials verifiable online for jobs and career growth.',
    icon: Award,
    accentClass: 'bg-amber-600 text-white',
  },
  {
    title: 'Career & Trading Support',
    description:
      'Portfolio building, interview readiness, and ongoing live market strategy review support.',
    icon: Briefcase,
    accentClass: 'bg-[#1E40AF] text-amber-300',
  },
] as const;

export const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-12 lg:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-1">
              The JIT Advantage
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0A2463] tracking-tight">
              Why Choose JIT?
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Structured around real software execution, live market discipline, and verified career credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[#1E40AF]/50 transition-colors duration-150"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feat.accentClass}`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#0A2463] mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
