import React from 'react';
import { Clock, Facebook, Instagram, Lock, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { PORTAL_LINKS } from '../data/defaultData';
import { ContactSettings } from '../types';
import { buildWhatsAppUrl } from '../utils/storage';
import { JitLogo } from './JitLogo';

interface FooterProps {
  contact: ContactSettings;
  onSecretAdminTrigger: () => void;
}

export const Footer: React.FC<FooterProps> = ({ contact, onSecretAdminTrigger }) => {
  return (
    <footer className="bg-[#0A2463] text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-blue-900">
          {/* Left: Official JIT Logo & Institute Summary */}
          <div className="md:col-span-5">
            <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="bg-white rounded-xl p-3 shrink-0 shadow-xs">
                <JitLogo className="w-16 h-16" showWordmark={true} wordmarkClassName="text-slate-900 text-[9px]" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight">
                  JIT Computer Training Institute
                </h2>
                <p className="text-xs font-semibold text-amber-300 mt-0.5">
                  Jharna Institute of Technology
                </p>
                <p className="text-xs text-blue-200 mt-1.5 leading-relaxed max-w-xs">
                  Govt. Registered &amp; ISO Certified institute offering practical Computer Application, Coding, Digital Marketing &amp; Share Market training.
                </p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 mt-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JIT on Facebook"
                className="w-9 h-9 rounded-lg bg-blue-900/70 hover:bg-[#F59E0B] hover:text-slate-950 text-blue-100 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JIT on Instagram"
                className="w-9 h-9 rounded-lg bg-blue-900/70 hover:bg-[#F59E0B] hover:text-slate-950 text-blue-100 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="JIT on YouTube"
                className="w-9 h-9 rounded-lg bg-blue-900/70 hover:bg-[#F59E0B] hover:text-slate-950 text-blue-100 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Center: Quick Links & Portals */}
          <div className="md:col-span-3">
            <h3 className="font-display font-semibold text-sm text-[#F59E0B] mb-3.5">
              Quick Links &amp; Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#courses" className="text-blue-100 hover:text-white transition-colors">
                  Courses &amp; Syllabus
                </a>
              </li>
              <li>
                <a href="#notices" className="text-blue-100 hover:text-white transition-colors">
                  Live Notice Board
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-blue-100 hover:text-white transition-colors">
                  Student Photo Gallery
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

          {/* Right: Editable Contact Info */}
          <div className="md:col-span-4">
            <h3 className="font-display font-semibold text-sm text-[#F59E0B] mb-3.5">
              Contact &amp; Admissions
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                  className="font-mono tabular-nums text-white hover:text-amber-300 transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-100 hover:text-white transition-colors break-all"
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-blue-100">{contact.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-blue-100 tabular-nums">{contact.timings}</span>
              </li>
              <li className="pt-1">
                <a
                  href={buildWhatsAppUrl(
                    'Hello JIT Computer Training Institute, I would like information about courses.',
                    contact.phone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
                >
                  Message on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright + Subtle Admin Lock Icon */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <p>
            © {new Date().getFullYear()} Jharna Institute of Technology (JIT). All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span>Govt. Registered · ISO Certified</span>
            <button
              type="button"
              onClick={onSecretAdminTrigger}
              aria-label="Admin Access"
              title="Admin Access"
              className="p-1.5 rounded text-blue-400/50 hover:text-amber-300 hover:bg-blue-900/60 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
