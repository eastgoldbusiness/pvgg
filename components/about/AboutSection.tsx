"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MessageSquare, ArrowUpRight, Compass, CheckCircle2 } from "lucide-react";
import {
  ABOUT_HERO,
  ABOUT_PLACE,
  ABOUT_PURPOSE,
  ABOUT_PROMISE,
  ABOUT_CTA,
} from "@/config/about";
import type { AboutHighlight, AboutPromiseStep } from "@/types/about";
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

/**
 * Premium About Section for Pavan Vela Grand
 *
 * Design Concept: "The Place. The Purpose. The Promise."
 *
 * Narrative Structure:
 * - Section A: Editorial Story Hero (White #FFFFFF)
 * - Section B: Chapter One — The Place (Deep Navy #10263D)
 * - Section C: Chapter Two — The Purpose (White #FFFFFF with 3 Editorial Highlights)
 * - Section D: Chapter Three — The Promise (Deep Navy #10263D with Step Timeline)
 * - Section E: Premium Closing Call to Action
 *
 * Strict Compliance:
 * - Single-page landing component mapped to #about.
 * - Semantic H2 for the section, H3 for narrative chapters.
 * - Confirmed hotel facts only (Palani Road Bypass, Dindigul, covered parking, peaceful setting, phone/WhatsApp booking).
 * - Full reduced-motion and mobile-responsive support.
 */
export function AboutSection() {
  const { openBookingModal } = useBookingModal();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  return (
    <section
      id="about"
      aria-labelledby="about-main-heading"
      className="relative w-full overflow-hidden select-none"
    >
      {/* Accessible Main Section Heading (H2) */}
      <h2 id="about-main-heading" className="sr-only">
        About Pavan Vela Grand in Dindigul
      </h2>

      {/* =========================================================================
          SECTION A: Editorial Story Hero (White #FFFFFF)
          ========================================================================= */}
      <div className="relative w-full bg-white py-20 sm:py-28 lg:py-36 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: Asymmetrical Editorial Heading & Copy */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center"
            >
              {/* Main Headline */}
              <h3
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif text-[#173B63] tracking-tight leading-[1.12]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {ABOUT_HERO.headline}
              </h3>

              {/* Supporting Copy */}
              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-[#555555] font-sans leading-relaxed">
                {ABOUT_HERO.description}
              </p>

              {/* Contextual Accommodation Link */}
              <div className="mt-8 sm:mt-10">
                <a
                  href="#suites"
                  className="inline-flex items-center space-x-2 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.2em] text-[#C5A572] hover:text-[#173B63] transition-colors group"
                >
                  <span>Explore Available Rooms</span>
                  <span
                    className="text-base transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    &rsaquo;
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Editorial Photography (Full Image Shown Without Cropping) */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: prefersReducedMotion ? 0 : 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center"
            >
              <div className="relative w-full aspect-[3/2] rounded-xs overflow-hidden bg-slate-50 ring-1 ring-slate-200/80">
                <Image
                  src={ABOUT_HERO.image}
                  alt={ABOUT_HERO.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>

              {/* Editorial Caption Badge (Positioned below image to never block the emblem) */}
              <div className="flex items-center justify-end mt-3">
                <div className="bg-white px-3.5 py-1.5 rounded-xs border border-slate-200/80 shadow-xs">
                  <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.24em] text-[#173B63]">
                    {ABOUT_HERO.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION B: Chapter One — The Place / Location (Full-Width Deep Navy #10263D)
          ========================================================================= */}
      <div id="location" className="relative w-full bg-[#10263D] py-20 sm:py-28 lg:py-36 text-white border-t border-[#C5A572]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column: Content */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              {/* Chapter Heading */}
              <h3
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif text-white tracking-tight leading-[1.12]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {ABOUT_PLACE.heading}
              </h3>

              {/* Lead Paragraph */}
              <p className="mt-6 sm:mt-8 text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
                {ABOUT_PLACE.leadParagraph}
              </p>

              {/* Supporting Paragraph */}
              <p className="mt-4 text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
                {ABOUT_PLACE.supportingParagraph}
              </p>

              {/* Location Badge */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-[#C5A572]" />
                <span className="text-xs font-sans font-bold uppercase tracking-[0.22em] text-[#C5A572]">
                  {ABOUT_PLACE.locationBadge}
                </span>
              </div>
            </motion.div>

            {/* Right Column: Landscape Property Photograph */}
            <motion.div
              initial={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: prefersReducedMotion ? 0 : 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <div className="relative w-full aspect-[2/3] max-w-[360px] sm:max-w-[400px] lg:max-w-[420px] mx-auto lg:ml-auto rounded-xs overflow-hidden bg-slate-950/40 ring-1 ring-white/15">
                <Image
                  src={ABOUT_PLACE.image}
                  alt={ABOUT_PLACE.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>

              {/* Editorial Caption Badge below image */}
              <div className="flex items-center justify-center lg:justify-end max-w-[360px] sm:max-w-[400px] lg:max-w-[420px] mx-auto lg:ml-auto w-full mt-3">
                <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xs border border-white/15">
                  <span className="text-[11px] font-sans tracking-widest uppercase text-white/90">
                    {ABOUT_PLACE.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION C: Chapter Two — The Purpose (White #FFFFFF with 3 Highlights)
          ========================================================================= */}
      <div className="relative w-full bg-white py-20 sm:py-28 lg:py-36 text-[#182230]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mb-16 sm:mb-20 lg:mb-24">
            <h3
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif text-[#173B63] tracking-tight leading-[1.12]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {ABOUT_PURPOSE.heading}
            </h3>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#555555] font-sans leading-relaxed">
              {ABOUT_PURPOSE.description}
            </p>
          </div>

          {/* 3 Vertically Arranged Editorial Highlights */}
          <div className="space-y-8 sm:space-y-12">
            {ABOUT_PURPOSE.highlights.map(
              (item: AboutHighlight, index: number) => (
                <motion.div
                  key={item.title}
                  initial={
                    prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: prefersReducedMotion ? 0 : index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative bg-[#F7F9FC] rounded-xs p-6 sm:p-10 lg:p-12 border border-slate-200/80 hover:border-[#C5A572]/80 transition-all duration-300 shadow-xs hover:shadow-md"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
                    {/* Category Tag Column */}
                    <div className="lg:col-span-3 flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#C5A572]" aria-hidden="true" />
                      <span className="text-xs font-sans uppercase tracking-[0.2em] font-semibold text-[#173B63]">
                        {item.tag}
                      </span>
                    </div>

                    {/* Content Column */}
                    <div className="lg:col-span-6">
                      <h4
                        className="text-xl sm:text-2xl lg:text-[26px] font-serif text-[#173B63] tracking-tight leading-snug"
                        style={{
                          fontFamily: "var(--font-playfair), Georgia, serif",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#555555] font-sans leading-relaxed max-w-2xl">
                        {item.description}
                      </p>
                    </div>

                    {/* Contextual Anchor Link Column */}
                    <div className="lg:col-span-3 flex flex-col lg:items-end justify-center self-stretch">
                      {item.anchorHref && (
                        <a
                          href={item.anchorHref}
                          className="mt-2 lg:mt-0 inline-flex items-center space-x-1.5 text-xs font-sans font-semibold uppercase tracking-[0.18em] text-[#173B63] hover:text-[#C5A572] transition-colors group/link"
                        >
                          <span>{item.anchorLabel}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION D: Chapter Three — The Promise (Deep Navy #10263D with Timeline)
          ========================================================================= */}
      <div className="relative w-full bg-[#10263D] py-20 sm:py-28 lg:py-36 text-white border-t border-[#C5A572]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 lg:mb-28">
            <h3
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif text-white tracking-tight leading-[1.12]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {ABOUT_PROMISE.heading}
            </h3>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300/90 font-sans leading-relaxed max-w-2xl mx-auto">
              {ABOUT_PROMISE.description}
            </p>
          </div>

          {/* Subtle Connected Steps Timeline */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">

            {ABOUT_PROMISE.steps.map(
              (stepItem: AboutPromiseStep, index: number) => {
                const stepIcons = [
                  <Compass key="1" className="w-6 h-6 text-[#C5A572]" aria-hidden="true" />,
                  <MessageSquare key="2" className="w-6 h-6 text-[#C5A572]" aria-hidden="true" />,
                  <CheckCircle2 key="3" className="w-6 h-6 text-[#C5A572]" aria-hidden="true" />,
                ];

                return (
                  <motion.div
                    key={stepItem.title}
                    initial={
                      prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }
                    }
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      delay: prefersReducedMotion ? 0 : index * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-xs bg-[#0B1B2C]/60 backdrop-blur-xs border border-white/10"
                  >
                    {/* Step Icon Badge */}
                    <div className="w-14 h-14 rounded-full bg-[#10263D] border border-[#C5A572] flex items-center justify-center mb-6 shadow-md z-10">
                      {stepIcons[index % stepIcons.length]}
                    </div>

                    {/* Title */}
                    <h4
                      className="text-xl sm:text-2xl font-serif text-white tracking-tight"
                      style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                      }}
                    >
                      {stepItem.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-3 text-xs sm:text-sm text-slate-300/90 font-sans leading-relaxed">
                      {stepItem.description}
                    </p>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION E: Premium Closing CTA (White Background Conversion Panel)
          ========================================================================= */}
      <div className="relative w-full bg-white py-20 sm:py-24 lg:py-28 text-[#182230] border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h3
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#173B63] tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {ABOUT_CTA.heading}
          </h3>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#555555] font-sans leading-relaxed max-w-xl mx-auto">
            {ABOUT_CTA.description}
          </p>

          {/* Conversion Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Book a Room Modal CTA */}
            <button
              type="button"
              onClick={openBookingModal}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-sm bg-[#C5A572] text-[#182230] font-sans text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 hover:bg-[#B69562] hover:text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C5A572] cursor-pointer"
              aria-label="Open Book a Room enquiry form"
            >
              <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>{ABOUT_CTA.primaryActionLabel}</span>
            </button>

            {/* WhatsApp Booking Enquiry */}
            <a
              href={ABOUT_CTA.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-sm bg-transparent border border-slate-300 text-[#173B63] font-sans text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 hover:border-[#C5A572] hover:text-[#C5A572] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]"
              aria-label="Enquire about room availability on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>{ABOUT_CTA.whatsappLabel}</span>
            </a>
          </div>

          {/* Direct Verified Contact Information */}
          <div className="mt-8 text-xs font-sans text-[#777777] space-y-1">
            <p>
              Direct Reservations:{" "}
              <a
                href={ABOUT_CTA.primaryActionHref}
                className="text-[#173B63] hover:text-[#C5A572] font-semibold transition-colors"
              >
                {ABOUT_CTA.phoneDisplay}
              </a>
            </p>
            <p className="text-[11px] text-[#888888]">
              {ABOUT_CTA.locationNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
