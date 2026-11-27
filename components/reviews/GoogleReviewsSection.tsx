"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { GOOGLE_REVIEWS_CONFIG, GOOGLE_REVIEWS, type GoogleReviewItem } from "@/config/reviews";

const TRIPLED_REVIEWS = [
  ...GOOGLE_REVIEWS,
  ...GOOGLE_REVIEWS,
  ...GOOGLE_REVIEWS,
];

const AVATAR_COLORS = [
  "bg-[#1a73e8]", // Google Blue
  "bg-[#173B63]", // PVG Royal Blue
  "bg-[#1e8e3e]", // Google Green
  "bg-[#e37400]", // Google Orange
  "bg-[#8e24aa]", // Purple
  "bg-[#d93025]", // Google Red
  "bg-[#007b83]", // Teal
];

/**
 * Official Google 4-Color 'G' Logo SVG
 */
function GoogleGIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

/**
 * 5-Star Visual Display using Google Gold (#FBBC05)
 */
function StarRating({ count = 5, size = "w-4 h-4" }: { count?: number; size?: string }) {
  return (
    <div className="flex items-center space-x-0.5" aria-label={`${count} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size} ${
            i < count ? "text-[#FBBC05] fill-[#FBBC05]" : "text-slate-200 fill-slate-200"
          }`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Google Multi-Color Wordmark
 */
function GoogleWordmark() {
  return (
    <span className="inline-flex items-center font-medium font-sans text-xs tracking-normal select-none">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

/**
 * Individual Review Card Component
 */
function ReviewCard({ review, avatarColor }: { review: GoogleReviewItem; avatarColor: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 150;

  return (
    <article
      className="w-full h-full bg-transparent rounded-xl p-5 sm:p-6 border border-white/15 flex flex-col justify-between transition-all duration-300 hover:border-[#C5A572]/50 hover:bg-white/[0.04] hover:shadow-lg select-text text-white"
    >
      <div>
        {/* Top Header: Avatar + Author Info & Google Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-full ${avatarColor} text-white font-sans font-semibold text-sm flex items-center justify-center flex-shrink-0 shadow-xs select-none`}
              aria-hidden="true"
            >
              {review.initial}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-[15px] font-sans font-semibold text-white leading-snug truncate">
                {review.author}
              </h4>
              <p className="text-xs font-sans text-slate-400 mt-0.5">{review.date}</p>
            </div>
          </div>
          <div className="flex-shrink-0 pt-0.5" title="Verified Google Review">
            <GoogleGIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-3">
          <StarRating count={review.rating} size="w-3.5 h-3.5" />
        </div>

        {/* Review Text */}
        <div className="text-xs sm:text-[13px] font-sans text-slate-200 leading-relaxed whitespace-pre-line">
          {isLong && !expanded ? `${review.text.slice(0, 135)}...` : review.text}
        </div>
      </div>

      {/* Expand/Collapse Interaction for Longer Reviews */}
      {isLong && (
        <div className="mt-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-sans font-semibold text-[#C5A572] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
            aria-expanded={expanded}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>
      )}
    </article>
  );
}

/**
 * Google Reviews Section for Pavan Vela Grand
 *
 * Characteristics:
 * - Full-width deep navy background (#10263D) matching PVG brand architecture.
 * - Centered white review panel with horizontal two-column layout on desktop.
 * - Left Column: Business Summary, 5-star display, "Review Us" & "View Profile" buttons.
 * - Right Column: Interactive multi-card carousel (3 cards desktop, 2 tablet, 1 mobile).
 * - Verbatim verified customer reviews with zero invented data or fake APIs.
 * - Touch swipe, arrow navigation, pagination dots, and autoplay with pause on interaction.
 */
export function GoogleReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(GOOGLE_REVIEWS.length);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive Cards-Per-View Handler
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      setCardsPerView(width < 640 ? 1 : width < 1024 ? 2 : 3);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView, { passive: true });
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Autoplay function - automatically advances reviews every 3.5 seconds
  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    startAutoplay();
  }, [startAutoplay]);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    startAutoplay();
  }, [startAutoplay]);

  // Seamless infinite loop handler on CSS transition completion
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;

    const N = GOOGLE_REVIEWS.length;
    if (currentIndex >= N * 2) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - N);
    } else if (currentIndex < N) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + N);
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      id="reviews"
      aria-labelledby="google-reviews-heading"
      className="relative w-full bg-[#10263D] py-16 sm:py-20 lg:py-24 text-white border-t border-[#C5A572]/20 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Eyebrow Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.26em] text-[#C5A572] mb-3">
            GUEST EXPERIENCES
          </span>
          <h2
            id="google-reviews-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {GOOGLE_REVIEWS_CONFIG.heading}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            {GOOGLE_REVIEWS_CONFIG.subheading}
          </p>
        </div>

        {/* Central Review Area (Seamless Transparent) */}
        <div className="w-full text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
            {/* ===================================================================
                LEFT COLUMN – Google Business Summary
                =================================================================== */}
            <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
              <div>
                {/* Official Pavan Vela Grand Hotel Logo Badge */}
                <div className="flex items-center space-x-3.5 mb-3.5">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/20 shadow-xs bg-white">
                    <Image
                      src="/images/pvg-logo.png"
                      alt="Pavan Vela Grand Hotel Logo"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-wide leading-tight">
                    {GOOGLE_REVIEWS_CONFIG.businessName}
                  </h3>
                </div>

                {/* 5-Star Visual Treatment */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <StarRating count={5} size="w-5 h-5 sm:w-6 sm:h-6" />
                  <p className="text-xs sm:text-sm font-sans font-medium text-slate-300 mt-1.5">
                    {GOOGLE_REVIEWS_CONFIG.ratingLabel}
                  </p>
                </div>

                {/* Powered by Google Attribution */}
                <div className="mt-2.5 flex items-center space-x-1.5 text-xs font-sans text-slate-400">
                  <span>Powered by</span>
                  <GoogleWordmark />
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-col space-y-2.5">
                  {/* Button 1: Review Us on Google */}
                  <a
                    href={GOOGLE_REVIEWS_CONFIG.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2.5 px-5 py-3 rounded-md bg-[#1a73e8] text-white font-sans text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-[#1557b0] shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2"
                    aria-label="Review Pavan Vela Grand on Google (opens in new tab)"
                  >
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center p-0.5">
                      <GoogleGIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Review Us on Google</span>
                  </a>

                  {/* Button 2: View Our Business Profile */}
                  <a
                    href={GOOGLE_REVIEWS_CONFIG.googleShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md bg-white/5 border border-white/25 text-white font-sans text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 hover:border-[#C5A572] hover:bg-white/10 hover:text-[#C5A572] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]"
                    aria-label="View Pavan Vela Grand Google Business Profile (opens in new tab)"
                  >
                    <span>View Our Business Profile</span>
                    <ExternalLink className="w-4 h-4 text-slate-300" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* ===================================================================
                RIGHT COLUMN – Customer Reviews Carousel
                =================================================================== */}
            <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between min-w-0">
              {/* Carousel Top Navigation Bar */}
              <div className="flex items-center justify-end mb-4 sm:mb-6">
                {/* Circular Arrow Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="View previous Google reviews"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center hover:bg-white/15 hover:border-[#C5A572] hover:text-[#C5A572] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572] cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="View next Google reviews"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center hover:bg-white/15 hover:border-[#C5A572] hover:text-[#C5A572] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572] cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewport for Reviews Track */}
              <div
                ref={containerRef}
                className="overflow-hidden py-1"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex -mx-2"
                  onTransitionEnd={handleTransitionEnd}
                  style={{
                    transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                    transition: isTransitioning
                      ? "transform 600ms cubic-bezier(0.25, 1, 0.5, 1)"
                      : "none",
                  }}
                >
                  {TRIPLED_REVIEWS.map((review, idx) => (
                    <div
                      key={`${review.id}-${idx}`}
                      className="flex-shrink-0 px-2"
                      style={{
                        width: `${100 / cardsPerView}%`,
                      }}
                    >
                      <ReviewCard
                        review={review}
                        avatarColor={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GoogleReviewsSection;
