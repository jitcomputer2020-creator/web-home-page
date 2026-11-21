import React from 'react';
import { Clock, ExternalLink, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { BrandingSettings, ContactSettings } from '../types';
import { buildGoogleMapsEmbedUrl } from '../utils/storage';

interface LocationMapSectionProps {
  branding: BrandingSettings;
  contact: ContactSettings;
}

export const LocationMapSection: React.FC<LocationMapSectionProps> = ({
  branding,
  contact,
}) => {
  const embedUrl = buildGoogleMapsEmbedUrl(contact.mapQuery);
  const timingRows = contact.timings
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section
      id="location"
      className="py-16 lg:py-20 bg-white border-b border-slate-200 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-1.5">
            Visit Our Campus
          </p>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0A2463] tracking-tight">
            Location, Directions &amp; Opening Hours
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Find us easily in Barasat, Kolkata for live practical lab visits, demo classes, and admissions counseling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address, Hours & Directions CTA */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#0A2463] leading-snug">
                  {branding.instituteName} ({branding.instituteSubtitle})
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Govt. Registered · ISO Certified Practical Training Center
                </p>
              </div>

              {/* Exact Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0A2463] text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                    Campus Address
                  </p>
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-slate-800 hover:text-[#1E40AF] leading-relaxed inline-flex items-start gap-1 group"
                  >
                    <span>{contact.address}</span>
                    <ExternalLink
                      className="w-3.5 h-3.5 shrink-0 mt-1 text-slate-400 group-hover:text-[#1E40AF]"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0A2463] text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                    Opening Hours
                  </p>
                  <ul className="space-y-1.5 text-xs sm:text-sm">
                    {timingRows.map((row, idx) => {
                      const isClosed = /closed/i.test(row);
                      return (
                        <li
                          key={idx}
                          className={`tabular-nums rounded-md px-2.5 py-1.5 border ${
                            isClosed
                              ? 'bg-rose-50/70 border-rose-200 text-rose-800 font-semibold'
                              : 'bg-white border-slate-200 text-slate-800 font-medium'
                          }`}
                        >
                          {row}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Quick Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 text-sm font-mono font-semibold text-[#0A2463] hover:text-amber-700 tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#1E40AF] shrink-0" aria-hidden="true" />
                  <span>{contact.phone}</span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 hover:text-[#0A2463] truncate"
                >
                  <Mail className="w-4 h-4 text-[#1E40AF] shrink-0" aria-hidden="true" />
                  <span className="truncate">{contact.email}</span>
                </a>
              </div>
            </div>

            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xs transition-colors"
            >
              <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Open in Google Maps / Get Directions</span>
            </a>
          </div>

          {/* Right Column: Interactive Embedded Google Map */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="flex-1 min-h-[340px] sm:min-h-[410px] w-full bg-slate-100">
              <iframe
                title={`${branding.instituteName} Interactive Map`}
                src={embedUrl}
                className="w-full h-full min-h-[340px] sm:min-h-[410px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0A2463] shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">{contact.address}</span>
              </p>

              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open in Google Maps / Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
