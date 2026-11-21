import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Image as ImageIcon,
  Play,
  Video,
  X,
} from 'lucide-react';
import { GalleryCategory, GalleryItem } from '../types';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../utils/storage';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

type GalleryFilter = 'All' | GalleryCategory | 'Videos';
const GALLERY_FILTERS: GalleryFilter[] = ['All', 'Classroom', 'Events', 'Students', 'Videos'];

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const filteredItems = gallery.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Videos') return item.mediaType === 'video';
    return item.category === activeFilter;
  });

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredItems.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;
  const activeYouTubeEmbed =
    activeItem?.mediaType === 'video' ? getYouTubeEmbedUrl(activeItem.mediaUrl) : null;

  return (
    <section id="gallery" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-2">
              Campus &amp; Events
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0A2463] tracking-tight text-balance">
              Photo &amp; Video Gallery
            </h2>
            <p className="text-slate-600 text-base mt-2.5">
              Practical computer labs, share market sessions, campus events, and student videos. Click any photo or video to view full screen.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter gallery items"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-lg border border-slate-200 self-start md:self-auto"
          >
            {GALLERY_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFilter(filter);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A2463] text-white'
                      : 'text-slate-700 hover:text-[#0A2463] hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
            <p className="font-display font-semibold text-[#0A2463]">
              No items found in {activeFilter}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Upload photos or add YouTube/video links from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item, index) => {
              const hasFailed = Boolean(failedIds[item.id]);
              const ytThumb =
                item.mediaType === 'video' ? getYouTubeThumbnailUrl(item.mediaUrl) : null;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    {item.mediaType === 'video' ? (
                      <>
                        {ytThumb && !hasFailed ? (
                          <img
                            src={ytThumb}
                            alt={item.caption}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedIds((prev) => ({ ...prev, [item.id]: true }))
                            }
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0A2463] to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                            <Video className="w-8 h-8 text-[#F59E0B] mb-2" aria-hidden="true" />
                            <span className="text-xs font-medium text-white">Video Clip</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                          <span className="w-12 h-12 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" aria-hidden="true" />
                          </span>
                        </div>
                      </>
                    ) : !hasFailed ? (
                      <>
                        <img
                          src={item.mediaUrl}
                          alt={item.caption}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedIds((prev) => ({ ...prev, [item.id]: true }))
                          }
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-950/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Expand className="w-4 h-4" aria-hidden="true" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0A2463] to-slate-800 flex flex-col items-center justify-center p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-[#F59E0B] mb-2" aria-hidden="true" />
                        <span className="text-xs font-medium text-white">{item.category}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-amber-700">
                        {item.mediaType === 'video' ? `Video · ${item.category}` : item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{item.addedAt}</span>
                    </div>
                    <p className="text-sm font-medium text-[#0A2463] line-clamp-2 leading-snug">
                      {item.caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Photo & Video Lightbox */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Media lightbox preview"
          className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm">
              <span className="font-semibold text-[#F59E0B]">
                {activeItem.mediaType === 'video' ? `Video · ${activeItem.category}` : activeItem.category}
              </span>
              <span className="mx-2 text-slate-400" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-300">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              className="w-11 h-11 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center max-w-5xl w-full mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
                  )
                }
                aria-label="Previous item"
                className="absolute left-0 sm:left-2 z-10 w-11 h-11 rounded-full bg-slate-900/85 hover:bg-[#0A2463] text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {activeItem.mediaType === 'video' ? (
              activeYouTubeEmbed ? (
                <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden border border-white/15 bg-black">
                  <iframe
                    src={activeYouTubeEmbed}
                    title={activeItem.caption}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={activeItem.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[75vh] max-w-full rounded-lg border border-white/15 bg-black"
                />
              )
            ) : (
              <img
                src={activeItem.mediaUrl}
                alt={activeItem.caption}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain rounded-lg border border-white/10"
              />
            )}

            {filteredItems.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredItems.length)}
                aria-label="Next item"
                className="absolute right-0 sm:right-2 z-10 w-11 h-11 rounded-full bg-slate-900/85 hover:bg-[#0A2463] text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <div
            className="max-w-3xl w-full mx-auto text-center text-white pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm sm:text-base font-medium text-slate-100">
              {activeItem.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
