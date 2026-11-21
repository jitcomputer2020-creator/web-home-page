import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CustomSectionBlock, CustomSectionPlacement } from '../types';
import { getYouTubeEmbedUrl } from '../utils/storage';

interface CustomSectionsRendererProps {
  sections: CustomSectionBlock[];
  placement: CustomSectionPlacement;
}

export const CustomSectionsRenderer: React.FC<CustomSectionsRendererProps> = ({
  sections,
  placement,
}) => {
  const matching = sections.filter((s) => s.placement === placement);
  if (matching.length === 0) return null;

  return (
    <>
      {matching.map((block) => {
        const isRoyal = block.theme === 'royal-blue';
        const ytEmbed = block.blockType === 'video' ? getYouTubeEmbedUrl(block.mediaUrl) : null;
        const hasMedia = block.blockType !== 'text' && block.mediaUrl.trim().length > 0;

        return (
          <section
            key={block.id}
            className={`py-12 lg:py-16 border-b ${
              isRoyal
                ? 'bg-[#0A2463] text-white border-blue-900'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`grid grid-cols-1 ${
                  hasMedia ? 'lg:grid-cols-12 gap-8 items-center' : ''
                }`}
              >
                <div className={hasMedia ? 'lg:col-span-6' : 'max-w-4xl'}>
                  <h2
                    className={`font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3 text-balance ${
                      isRoyal ? 'text-white' : 'text-[#0A2463]'
                    }`}
                  >
                    {block.title}
                  </h2>

                  {block.bodyText && (
                    <p
                      className={`text-base leading-relaxed whitespace-pre-line mb-6 ${
                        isRoyal ? 'text-blue-100' : 'text-slate-600'
                      }`}
                    >
                      {block.bodyText}
                    </p>
                  )}

                  {block.ctaLabel && block.ctaUrl && (
                    <a
                      href={block.ctaUrl}
                      target={block.ctaUrl.startsWith('#') ? undefined : '_blank'}
                      rel={block.ctaUrl.startsWith('#') ? undefined : 'noopener noreferrer'}
                      className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
                    >
                      <span>{block.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  )}
                </div>

                {hasMedia && (
                  <div className="lg:col-span-6">
                    <div className="rounded-xl overflow-hidden border border-slate-200/20 bg-slate-950">
                      {block.blockType === 'video' ? (
                        ytEmbed ? (
                          <div className="aspect-video w-full">
                            <iframe
                              src={ytEmbed}
                              title={block.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <video
                            src={block.mediaUrl}
                            controls
                            playsInline
                            className="w-full max-h-[400px] object-cover"
                          />
                        )
                      ) : (
                        <img
                          src={block.mediaUrl}
                          alt={block.title}
                          referrerPolicy="no-referrer"
                          className="w-full max-h-[400px] object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};
