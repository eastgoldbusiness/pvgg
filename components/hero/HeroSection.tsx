"use client";

import React, { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { HeroImageSlider } from "./HeroImageSlider";
import { HERO_CONTENT } from "@/config/hero";
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

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Premium Hero Section for Pavan Vela Grand
 *
 * Characteristics:
 * - Pure white background (#FFFFFF) foundation.
 * - Spacious split composition: Elegant typography on the left, cinematic 5-image slider on the right.
 * - Single SEO-optimized H1: "Pavan Vela Grand — Hotel in Dindigul".
 * - Verified supporting copy referencing peaceful setting and covered parking.
 * - Exactly ONE prominent booking CTA: "Book a Room" (#C5A572).
 * - Direct reservations contact link.
 * - 100% accessible, responsive, and performance-optimized.
 */
export function HeroSection() {
  const { openBookingModal } = useBookingModal();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row lg:h-[calc(100vh-9.5rem)]">
        {/* Left Column: Brand Typography & Primary Booking CTA */}
        <div className="w-full lg:w-[50%] xl:w-[48%] flex items-center px-5 sm:px-10 lg:pl-12 lg:pr-8 xl:pl-16 xl:pr-10 py-7 sm:py-9 lg:py-6 xl:py-8">
          <motion.div
            className="w-full max-w-2xl mx-auto lg:mx-0 flex flex-col justify-center space-y-5 sm:space-y-7"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: LUXURY_EASE }}
          >
            {/* Location Kicker */}
            <div className="inline-flex items-center space-x-2.5">
              <span className="w-8 h-[1.5px] bg-[#C5A572]" />
              <span className="text-xs sm:text-[13px] font-sans uppercase tracking-[0.24em] font-semibold text-[#173B63]">
                {HERO_CONTENT.kicker}
              </span>
            </div>

            {/* Semantic H1: Luxury Serif Heading */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-serif font-semibold text-[#173B63] leading-[1.14] tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Pavan Vela Grand
              <span className="block text-xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-normal text-[#182230] mt-1.5 sm:mt-2 font-sans tracking-normal">
                Hotel in Dindigul
              </span>
            </h1>

            {/* Verified Supporting Description */}
            <p className="text-sm sm:text-[17px] lg:text-[18px] font-sans text-[#536479] leading-relaxed">
              {HERO_CONTENT.description}
            </p>

            {/* Verified Trust Pillars */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-3 border-t border-slate-100">
              {HERO_CONTENT.trustPills.map((pill) => (
                <div key={pill.label} className="flex flex-col space-y-0.5">
                  <span className="text-xs sm:text-sm font-sans font-semibold text-[#173B63] tracking-wide leading-tight">
                    {pill.label}
                  </span>
                  <span className="text-[11px] sm:text-[13px] font-sans text-[#536479] leading-tight">
                    {pill.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Exactly ONE Primary Booking CTA & Contact Link */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={openBookingModal}
                className="inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-4 rounded-sm bg-[#C5A572] text-[#182230] font-sans text-xs sm:text-[13px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 hover:bg-[#B69562] hover:text-white shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C5A572] cursor-pointer"
              >
                {HERO_CONTENT.ctaText}
              </button>

              <a
                href={HERO_CONTENT.ctaTel}
                className="inline-flex items-center space-x-2 text-sm sm:text-[15px] font-sans text-[#173B63] hover:text-[#C5A572] transition-colors py-1"
                aria-label="Direct reservation telephone line"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#C5A572]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <span className="font-semibold sm:font-medium tracking-wide">89404 44648</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Full-Bleed Automatic 5-Image Carousel */}
        <motion.div
          className="w-full lg:w-[50%] xl:w-[52%] relative self-stretch h-[270px] xs:h-[310px] sm:h-[420px] lg:h-full lg:min-h-full"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.15, ease: LUXURY_EASE }}
        >
          <HeroImageSlider />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
