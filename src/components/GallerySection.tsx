import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Image as ImageIcon, X } from 'lucide-react';
import { GalleryCategory, GalleryItem } from '../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

const GALLERY_CATEGORIES: Array<'All' | GalleryCategory> = ['All', 'Classroom', 'Events', 'Students'];

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const filteredPhotos =
    activeFilter === 'All'
      ? gallery
      : gallery.filter((item) => item.category === activeFilter);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredPhotos.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-semibold text-amber-700 mb-2">
              Inside Our Campus
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-blue-950 tracking-tight text-balance">
              Institute Photo Gallery
            </h2>
            <p className="text-slate-600 text-base mt-2.5">
              Practical computer labs, share market analysis sessions, and student certificate events. Click any photograph to inspect full screen.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter gallery photos"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-lg border border-slate-200 self-start md:self-auto"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFilter(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-700 hover:text-blue-950 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" aria-hidden="true" />
            <p className="font-display font-semibold text-blue-950">
              No photos available in {activeFilter}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              New campus photographs can be uploaded anytime from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPhotos.map((photo, index) => {
              const hasFailed = Boolean(failedIds[photo.id]);
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                    {!hasFailed ? (
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedIds((prev) => ({ ...prev, [photo.id]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-950 to-slate-800 flex flex-col items-center justify-center p-4 text-center">
                        <ImageIcon className="w-8 h-8 text-amber-400 mb-2" aria-hidden="true" />
                        <span className="text-xs font-medium text-white">{photo.category}</span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-950/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Expand className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-amber-700">{photo.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{photo.addedAt}</span>
                    </div>
                    <p className="text-sm font-medium text-blue-950 line-clamp-2 leading-snug">
                      {photo.caption}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Preview */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox preview"
          className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="flex items-center justify-between text-white max-w-6xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm">
              <span className="font-semibold text-amber-400">{activePhoto.category}</span>
              <span className="mx-2 text-slate-400" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-300">
                {lightboxIndex + 1} / {filteredPhotos.length}
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
            className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                  )
                }
                aria-label="Previous photo"
                className="absolute left-0 sm:left-2 z-10 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-900 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.caption}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full object-contain rounded-lg border border-white/10"
            />

            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)}
                aria-label="Next photo"
                className="absolute right-0 sm:right-2 z-10 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-blue-900 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
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
              {activePhoto.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
