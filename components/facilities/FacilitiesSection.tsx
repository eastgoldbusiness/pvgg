"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FACILITIES_CONTENT, FACILITIES_LIST } from "@/config/facilities";

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
 * Premium Facilities Section for Pavan Vela Grand
 *
 * Source of Truth: Pavan_Vela_Grand_Website_SEO_Plan.docx
 *
 * Design Concept: Asymmetrical Editorial Layout
 * - Pure white background (#FFFFFF) with generous whitespace.
 * - Row 1 (Covered Parking): Large editorial photograph on LEFT, text on RIGHT.
 * - Row 2 (A Peaceful Setting): Text on LEFT, large editorial photograph on RIGHT.
 * - Refined serif headings in royal blue (#173B63) with champagne gold (#C5A572) accent lines.
 * - Restrained animations with full prefers-reduced-motion support.
 * - Mobile responsive: Image stacks above text on mobile devices.
 */
export function FacilitiesSection() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const parkingFacility = FACILITIES_LIST[0];
  const peacefulFacility = FACILITIES_LIST[1];

  return (
    <section
      id="facilities"
      aria-labelledby="facilities-heading"
      className="relative w-full bg-white py-20 sm:py-28 lg:py-36 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Heading Area */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 lg:mb-32">
          <span className="inline-block text-xs sm:text-[13px] font-sans font-semibold uppercase tracking-[0.26em] text-[#C5A572] mb-3">
            {FACILITIES_CONTENT.kicker}
          </span>
          <h2
            id="facilities-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-serif text-[#173B63] tracking-tight leading-[1.12]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {FACILITIES_CONTENT.heading}
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-[17px] text-[#555555] font-sans leading-relaxed">
            {FACILITIES_CONTENT.description}
          </p>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="space-y-20 sm:space-y-28 lg:space-y-36">
          {/* Facility 1: Covered Parking — Image LEFT, Text RIGHT */}
          {parkingFacility && (
            <motion.article
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 32 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center"
            >
              {/* Left Column: Authentic Covered Parking Image */}
              <div className="lg:col-span-7">
                <div className="group relative w-full h-[240px] sm:h-[380px] lg:h-[460px] rounded-xs overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(23,59,99,0.08)] ring-1 ring-slate-200/80">
                  <Image
                    src={parkingFacility.image}
                    alt={parkingFacility.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Right Column: Editorial Text & Gold Accent Line */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                {/* Subtle Champagne Gold Accent Line */}
                <div
                  className="w-12 h-[2px] bg-[#C5A572] mb-6"
                  aria-hidden="true"
                />

                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-[#C5A572] mb-2 block">
                  {parkingFacility.kicker}
                </span>

                <h3
                  className="text-2xl sm:text-3xl lg:text-[34px] font-serif text-[#173B63] tracking-tight leading-snug"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                  }}
                >
                  {parkingFacility.title}
                </h3>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
                  {parkingFacility.description}
                </p>

                {/* Verified Bullet Highlights */}
                <ul className="mt-6 sm:mt-7 space-y-2.5 text-xs sm:text-sm font-sans text-[#182230]">
                  {parkingFacility.highlights.map((item: string) => (
                    <li key={item} className="flex items-center space-x-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#C5A572] flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-[#182230]/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          )}

          {/* Facility 2: A Peaceful Setting — Text LEFT, Image RIGHT (Reversed) */}
          {peacefulFacility && (
            <motion.article
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 32 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center"
            >
              {/* Left Column (Desktop): Editorial Text & Gold Accent Line (order-2 on mobile) */}
              <div className="lg:col-span-5 lg:order-1 order-2 flex flex-col justify-center">
                {/* Subtle Champagne Gold Accent Line */}
                <div
                  className="w-12 h-[2px] bg-[#C5A572] mb-6"
                  aria-hidden="true"
                />

                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.24em] text-[#C5A572] mb-2 block">
                  {peacefulFacility.kicker}
                </span>

                <h3
                  className="text-2xl sm:text-3xl lg:text-[34px] font-serif text-[#173B63] tracking-tight leading-snug"
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                  }}
                >
                  {peacefulFacility.title}
                </h3>

                <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
                  {peacefulFacility.description}
                </p>

                {/* Verified Bullet Highlights */}
                <ul className="mt-6 sm:mt-7 space-y-2.5 text-xs sm:text-sm font-sans text-[#182230]">
                  {peacefulFacility.highlights.map((item: string) => (
                    <li key={item} className="flex items-center space-x-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#C5A572] flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-[#182230]/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column (Desktop): Authentic Exterior / Surroundings Image (order-1 on mobile) */}
              <div className="lg:col-span-7 lg:order-2 order-1">
                <div className="group relative w-full h-[240px] sm:h-[380px] lg:h-[460px] rounded-xs overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(23,59,99,0.08)] ring-1 ring-slate-200/80">
                  <Image
                    src={peacefulFacility.image}
                    alt={peacefulFacility.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </div>
    </section>
  );
}

export default FacilitiesSection;
