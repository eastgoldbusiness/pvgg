"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useSyncExternalStore,
  useMemo,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROOMS_ACCOMMODATIONS } from "@/config/rooms";
import type { RoomAccommodation } from "@/types/room";
import { useBookingModal } from "@/context/BookingModalContext";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

const TOTAL_ROOMS = ROOMS_ACCOMMODATIONS.length; // 5 rooms
const COPIES_COUNT = 5; // 5 copies (25 items) for seamless infinite buffer
const MIDDLE_COPY_INDEX = 2; // Middle block index [0, 1, (2), 3, 4]
const MIDDLE_OFFSET = MIDDLE_COPY_INDEX * TOTAL_ROOMS; // 10
// Start at index 1 (Executive Suite) of middle block (10 + 1 = 11)
// Centered with Deluxe King on left and Family Suite on right
const INITIAL_INDEX = MIDDLE_OFFSET + 1;

/**
 * Luxury Rooms & Suites Carousel Section for Pavan Vela Grand
 *
 * Characteristics:
 * - Starts initially with Executive Suite centered in the viewport,
 *   flanked symmetrically by Deluxe King on the left and Family Suite on the right.
 * - Continuous infinite wrapping in both directions with zero empty gaps.
 * - Hardware-accelerated sliding transition with luxury cubic-bezier easing.
 * - Left and right cards feature darkened luxury overlay and circular glass navigation buttons.
 * - Full touch swipe on mobile, keyboard navigation (ArrowLeft / ArrowRight), and accessibility.
 * - Compatible with in-page navbar anchors (#stay and #suites).
 */
export function RoomsSuitesSection() {
  const { openBookingModal } = useBookingModal();
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const lastNavTimeRef = useRef<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Flattened infinite track with unique instance keys
  const extendedRooms = useMemo(() => {
    const list: Array<RoomAccommodation & { instanceKey: string }> = [];
    for (let copyIdx = 0; copyIdx < COPIES_COUNT; copyIdx++) {
      for (let rIdx = 0; rIdx < TOTAL_ROOMS; rIdx++) {
        const room = ROOMS_ACCOMMODATIONS[rIdx];
        list.push({
          ...room,
          instanceKey: `${room.id}-copy-${copyIdx}`,
        });
      }
    }
    return list;
  }, []);

  const handlePrev = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 380) return;
    lastNavTimeRef.current = now;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 380) return;
    lastNavTimeRef.current = now;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Normalization on transition end for seamless infinite looping
  const handleTransitionEnd = useCallback(() => {
    const normalizedIndex =
      MIDDLE_OFFSET +
      (((currentIndex % TOTAL_ROOMS) + TOTAL_ROOMS) % TOTAL_ROOMS);
    if (normalizedIndex !== currentIndex) {
      setIsTransitioning(false);
      setCurrentIndex(normalizedIndex);
    }
  }, [currentIndex]);

  // Re-arm transitions in the next frame after silent normalization
  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  // Touch Swipe Handlers for Mobile Devices
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
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Accessible Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    const container = carouselRef.current;
    if (!container) return;
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  const activeRealIndex =
    ((currentIndex % TOTAL_ROOMS) + TOTAL_ROOMS) % TOTAL_ROOMS;

  return (
    <section
      id="suites"
      aria-labelledby="rooms-suites-heading"
      className="relative w-full bg-[#10263D] py-14 sm:py-16 lg:py-22 overflow-hidden select-none"
    >
      {/* Anchor alias for #stay navigation */}
      <div id="stay" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Top Heading Area (Two-column layout matching reference) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-10 sm:mb-12 lg:mb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 sm:gap-10">
          {/* Left Column: Large Editorial White Serif Heading */}
          <div className="max-w-xl">
            <h2
              id="rooms-suites-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif text-white tracking-tight leading-[1.08]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              <span className="block">&mdash; ROOMS &amp;</span>
              <span className="block">SUITES</span>
              <span className="sr-only"> at Pavan Vela Grand</span>
            </h2>
          </div>

          {/* Right Column: Editorial Supporting SEO Paragraph */}
          <div className="max-w-md lg:max-w-lg self-start md:self-end pb-1 sm:pb-2">
            <p className="text-xs sm:text-sm lg:text-[15px] font-sans text-slate-300/90 leading-relaxed">
              Explore accommodation at Pavan Vela Grand on Palani Road Bypass, Dindigul. Discover
              our peaceful, air-conditioned hotel rooms and spacious suites designed for restful
              comfort away from highway traffic, with secure on-site covered parking. Browse
              available options below and contact our team directly to enquire about your stay.
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Three-Card Carousel Viewport */}
      <div
        ref={carouselRef}
        tabIndex={0}
        role="region"
        aria-label="Pavan Vela Grand Rooms and Suites Carousel"
        aria-roledescription="carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572] focus-visible:ring-offset-4 focus-visible:ring-offset-[#10263D] py-2 sm:py-3 [--card-w:85vw] sm:[--card-w:56vw] lg:[--card-w:44vw] xl:[--card-w:42vw] [--card-max-w:640px] [--card-gap:18px] sm:[--card-gap:24px] lg:[--card-gap:32px]"
      >
        {/* Continuous Sliding Infinite Track */}
        <div
          onTransitionEnd={handleTransitionEnd}
          className="flex will-change-transform items-center"
          style={{
            transform: `translateX(calc(50% - (var(--card-w) / 2) - ${currentIndex} * (var(--card-w) + var(--card-gap))))`,
            transition:
              isTransitioning && !prefersReducedMotion
                ? "transform 650ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
            gap: "var(--card-gap)",
          }}
        >
          {extendedRooms.map((room, index: number) => {
            const isActive = index === currentIndex;
            const isPrev = index === currentIndex - 1;
            const isNext = index === currentIndex + 1;

            return (
              <article
                key={room.instanceKey}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(index % TOTAL_ROOMS) + 1} of ${TOTAL_ROOMS}: ${room.name} — Pavan Vela Grand Dindigul`}
                aria-current={isActive ? "true" : undefined}
                style={{ width: "var(--card-w)" }}
                className={`flex-shrink-0 relative overflow-hidden rounded-xs transition-all duration-700 h-[430px] sm:h-[490px] lg:h-[540px] flex flex-col ${
                  isActive
                    ? "opacity-100 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    : "opacity-85 z-10 cursor-pointer shadow-md"
                }`}
                onClick={() => {
                  if (isPrev) handlePrev();
                  else if (isNext) handleNext();
                }}
              >
                {/* ACTIVE CARD: Image + White Information Panel */}
                {isActive ? (
                  <div className="w-full h-full flex flex-col bg-white">
                    {/* Top Room Photograph */}
                    <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[360px] overflow-hidden bg-slate-900 flex-shrink-0">
                      <Image
                        src={room.image}
                        alt={room.imageAlt}
                        fill
                        priority={index === INITIAL_INDEX}
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 56vw, 640px"
                        className="object-cover"
                      />
                    </div>

                    {/* Bottom White Information Panel */}
                    <div className="flex-1 w-full bg-white px-5 sm:px-8 py-5 sm:py-6 lg:py-7 flex flex-col items-center justify-center text-center">
                      <h3 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.18em] text-[#182230]">
                        {room.name}
                      </h3>

                      <p className="mt-2.5 text-xs sm:text-[13px] text-[#555555] font-sans leading-relaxed max-w-md mx-auto">
                        {room.description}
                      </p>

                      <button
                        type="button"
                        onClick={openBookingModal}
                        className="mt-3.5 sm:mt-4 inline-flex items-center space-x-1.5 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#C5A572] hover:text-[#10263D] transition-colors group/cta cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572] rounded-sm"
                        aria-label={`Enquire to book ${room.name} at Pavan Vela Grand, Palani Road Bypass, Dindigul`}
                      >
                        <span>{room.bookingAction.label}</span>
                        <span className="text-sm font-serif transition-transform group-hover/cta:translate-x-1">
                          &rsaquo;
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SIDE CARD: Full-Height Image + Dark Overlay + Circular Arrow Controls */
                  <div className="relative w-full h-full overflow-hidden bg-slate-950">
                    <Image
                      src={room.image}
                      alt={room.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 85vw, 360px"
                      className="object-cover"
                    />

                    {/* Restrained Dark Editorial Overlay */}
                    <div className="absolute inset-0 bg-[#0B1928]/60 backdrop-brightness-75 transition-colors hover:bg-[#0B1928]/45" />

                    {/* Circular Navigation Arrow Control Over Left Card */}
                    {isPrev && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        aria-label="Previous room"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/35 bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:border-[#C5A572] hover:text-[#C5A572] hover:bg-black/70 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}

                    {/* Circular Navigation Arrow Control Over Right Card */}
                    {isNext && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        aria-label="Next room"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full border border-white/35 bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:border-[#C5A572] hover:text-[#C5A572] hover:bg-black/70 transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}

                    {/* Side Card Title (At Bottom) */}
                    <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 text-center px-4">
                      <span className="text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.24em] text-white/95 drop-shadow-sm">
                        {room.shortName || room.name}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Mobile-Only Navigation Controls Row */}
      <div className="flex sm:hidden items-center justify-center space-x-6 mt-8">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous accommodation card"
          className="w-11 h-11 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-sans tracking-widest uppercase text-white/80">
          {String(activeRealIndex + 1).padStart(2, "0")} / {String(TOTAL_ROOMS).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next accommodation card"
          className="w-11 h-11 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

export default RoomsSuitesSection;
