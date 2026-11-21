import React from 'react';
import { Clock, Mail, Phone } from 'lucide-react';
import {
  CONTACT_EMAIL,
  DISPLAY_PHONE,
  INSTITUTE_TIMINGS,
  PORTAL_LINKS,
} from '../data/defaultData';
import { JitLogo } from './JitLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-blue-900">
          {/* Brand Summary */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <JitLogo className="w-9 h-9 shrink-0" />
              <span className="font-display font-bold text-base sm:text-lg text-white tracking-tight">
                JHARNA INSTITUTE OF TECHNOLOGY (JIT)
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed max-w-md mb-4">
              ISO 9001:2015 Certified Practical Computer &amp; Share Market Training Institute (JIT Computer). Dedicated to hands-on technical literacy, Tally &amp; GST accounting, web engineering, and disciplined financial market education.
            </p>
          </div>

          {/* Quick Portals & Sections */}
          <div className="md:col-span-3">
            <h3 className="font-display font-semibold text-sm text-amber-400 mb-3.5">
              Quick Links &amp; Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#courses" className="text-blue-100 hover:text-white transition-colors">
                  Courses &amp; Curriculum
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-blue-100 hover:text-white transition-colors">
                  Campus Gallery
                </a>
              </li>
              <li>
                <a href="#verify" className="text-blue-100 hover:text-white transition-colors">
                  Certificate Verification
                </a>
              </li>
              {PORTAL_LINKS.map((portal) => (
                <li key={portal.id}>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-amber-300 transition-colors"
                  >
                    {portal.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4">
            <h3 className="font-display font-semibold text-sm text-amber-400 mb-3.5">
              Admissions &amp; Office Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href="tel:+918961260151"
                  className="font-mono tabular-nums text-white hover:text-amber-300 transition-colors"
                >
                  {DISPLAY_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-100 hover:text-white transition-colors break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-blue-100 tabular-nums">{INSTITUTE_TIMINGS}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <p>
            © {new Date().getFullYear()} Jharna Institute of Technology (JIT). All rights reserved.
          </p>
          <p className="text-blue-300/90">
            ISO 9001:2015 Certified Training Institution
          </p>
        </div>
      </div>
    </footer>
  );
};
