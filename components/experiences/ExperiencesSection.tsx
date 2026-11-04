"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import {
  EXPERIENCES_INTRO,
  EXPERIENCES_JOURNEY_HEADER,
  EXPERIENCES_JOURNEY_ITEMS,
} from "@/config/experiences";
import type { ExperienceJourneyItem } from "@/types/experience";

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

/**
 * Premium Experiences Section for Pavan Vela Grand
 *
 * Design Concept: "A Stay That Feels Different"
 * 3-Part Immersive Hotel Storytelling Experience:
 * - Section A: Editorial Introduction (Deep Navy #10263D)
 * - Section B: Interactive Guest Journey (01 Arrive, 02 Unwind, 03 Settle In)
 * - Section C: Premium Booking Call to Action (Deep Navy #10263D)
 *
 * Characteristics:
 * - Luxury editorial layout with generous whitespace.
 * - Deep royal navy (#10263D / #173B63) and champagne gold (#C5A572).
 * - Authentic property photography.
 * - Full SEO and accessible heading hierarchy (H2 -> H3).
 * - Smooth anchor navigation for #experiences.
 */
export function ExperiencesSection() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const handleScrollToJourney = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("journey-cards");
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <section
      id="experiences"
      aria-labelledby="experiences-heading"
      className="relative w-full overflow-hidden"
    >
      {/* =========================================================================
          SECTION A: Editorial Introduction (Deep Navy #10263D)
          ========================================================================= */}
      <div className="relative w-full bg-[#10263D] pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Eyebrow & Location Label */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] font-sans font-semibold tracking-[0.24em] uppercase mb-6 sm:mb-8">
            <span className="text-[#C5A572]">{EXPERIENCES_INTRO.eyebrow}</span>
            <span className="text-slate-500" aria-hidden="true">
              &bull;
            </span>
            <span className="text-slate-400 font-medium tracking-[0.22em]">
              {EXPERIENCES_INTRO.location}
            </span>
          </div>

          {/* Main Headline (Expressive Oversized Serif) */}
          <h2
            id="experiences-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif text-white tracking-tight leading-[1.08] max-w-4xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            <span className="block">
              {EXPERIENCES_INTRO.headlinePrimary}
            </span>
            <span className="block text-[#C5A572]">
              {EXPERIENCES_INTRO.headlineSecondary}
            </span>
          </h2>

          {/* Supporting Paragraph */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg text-slate-300/90 font-sans leading-relaxed max-w-2xl">
            {EXPERIENCES_INTRO.description}
          </p>

          {/* Minimal Anchor Action */}
          <div className="mt-8 sm:mt-10">
            <a
              href="#journey-cards"
              onClick={handleScrollToJourney}
              className="inline-flex items-center space-x-2.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.22em] text-[#C5A572] hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572] rounded py-1"
            >
              <span>{EXPERIENCES_INTRO.ctaText}</span>
              <ArrowDown
                className="w-4 h-4 transition-transform group-hover:translate-y-1"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Cinematic Large Hotel Photograph */}
          <div className="mt-10 sm:mt-18 lg:mt-22 relative w-full h-[240px] sm:h-[400px] lg:h-[580px] rounded-xs overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
            <Image
              src={EXPERIENCES_INTRO.image}
              alt={EXPERIENCES_INTRO.imageAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10263D]/70 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION B: Interactive Guest Journey (Light Neutral #F7F9FC)
          ========================================================================= */}
      <div
        id="journey-cards"
        className="relative w-full bg-[#F7F9FC] py-20 sm:py-28 lg:py-36"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header Area */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 lg:mb-24">
            <span className="inline-block text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.26em] text-[#C5A572] mb-3">
              {EXPERIENCES_JOURNEY_HEADER.label}
            </span>
            <h3
              className="text-3xl sm:text-4xl lg:text-[46px] font-serif text-[#173B63] tracking-tight leading-[1.14]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {EXPERIENCES_JOURNEY_HEADER.heading}
            </h3>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#555555] font-sans leading-relaxed max-w-2xl mx-auto">
              {EXPERIENCES_JOURNEY_HEADER.description}
            </p>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center justify-end text-[11px] font-sans uppercase tracking-widest text-[#888888] mb-3 pr-1">
            <span>Swipe cards</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </div>

          {/* Three Interactive Journey Cards Grid (Horizontal on Desktop, Swipe on Mobile) */}
          <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
            {EXPERIENCES_JOURNEY_ITEMS.map(
              (item: ExperienceJourneyItem, index: number) => (
                <motion.article
                  key={item.id}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 28 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: prefersReducedMotion ? 0 : index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center group relative bg-white rounded-xs overflow-hidden border border-slate-200/80 hover:border-[#C5A572] transition-all duration-500 shadow-sm hover:shadow-[0_16px_40px_rgba(23,59,99,0.08)] flex flex-col justify-between"
                >
                  {/* Upper Photograph */}
                  <div className="relative w-full h-[210px] sm:h-[260px] lg:h-[280px] overflow-hidden bg-slate-900 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 85vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Step Stage Pill Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3.5 py-1 bg-[#10263D]/85 backdrop-blur-md rounded-full border border-white/20 text-white font-sans text-[11px] tracking-wider uppercase flex items-center shadow-md">
                      <span className="text-[#C5A572] font-semibold">{item.stage}</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Lower Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white">
                    <div>
                      <h4
                        className="text-xl sm:text-[22px] font-serif text-[#173B63] tracking-tight leading-snug"
                        style={{
                          fontFamily: "var(--font-playfair), Georgia, serif",
                        }}
                      >
                        {item.title}
                      </h4>

                      {/* Expanding Gold Accent Line on Hover */}
                      <div
                        className="w-8 h-[2px] bg-[#C5A572] mt-3 group-hover:w-14 transition-all duration-300"
                        aria-hidden="true"
                      />

                      <p className="mt-3.5 text-xs sm:text-sm text-[#555555] font-sans leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Tag */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.2em] text-[#C5A572]">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </motion.article>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperiencesSection;
