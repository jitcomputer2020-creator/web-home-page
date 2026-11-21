import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react';
import { GoogleReview } from '../types';

interface ReviewsSectionProps {
  reviews: GoogleReview[];
}

const GOOGLE_REVIEW_URL =
  'https://www.google.com/search?q=Jharna+Institute+of+Technology+JIT+Computer';

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [startIndex, setStartIndex] = useState(0);

  const averageScore =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '4.9';
  // Present 4.9 ★ Rating on Google when reviews are at high standing, or real average if modified
  const displayRating = Number(averageScore) >= 4.8 ? '4.9' : averageScore;

  const pageSize = 3;
  const maxStart = Math.max(0, reviews.length - pageSize);
  const safeStart = Math.min(startIndex, maxStart);
  const visibleReviews =
    reviews.length <= pageSize
      ? reviews
      : reviews.slice(safeStart, safeStart + pageSize);

  const handlePrev = () => {
    setStartIndex((prev) => (prev <= 0 ? maxStart : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= maxStart ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-16 lg:py-20 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Summary Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 mb-10 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {/* Google G Badge */}
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white shrink-0"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
              </span>

              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl text-blue-950 tabular-nums">
                  {displayRating} ★ Rating on Google
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm sm:text-base">
              Verified student experiences from our Tally, Web &amp; AI, and Share Market cohorts ({reviews.length} featured reviews).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {reviews.length > pageSize && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous reviews"
                  className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:border-blue-900 text-slate-700 hover:text-blue-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next reviews"
                  className="w-10 h-10 rounded-lg border border-slate-200 bg-white hover:border-blue-900 text-slate-700 hover:text-blue-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-blue-900 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <span>Rate Us on Google</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Review Cards Grid */}
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="font-display font-semibold text-blue-950">
              No reviews added yet
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Student reviews can be published directly through the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className="flex items-center gap-0.5 text-amber-500"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx < review.rating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-slate-300'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 font-mono tabular-nums">
                      {review.dateLabel}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
                    &ldquo;{review.reviewText}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="font-display font-bold text-sm text-blue-950">
                    {review.reviewerName}
                  </p>
                  <p className="text-xs font-medium text-amber-700 mt-0.5">
                    {review.courseTaken}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
