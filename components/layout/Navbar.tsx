"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS, NAV_BOOKING_CTA } from "@/config/navigation";
import { BRAND_CONFIG } from "@/config/brand";
import { useBookingModal } from "@/context/BookingModalContext";

/**
 * Premium Website Navbar for Pavan Vela Grand
 *
 * Characteristics:
 * - Dominant pure white foundation with subtle border separation.
 * - Text-based luxury wordmark: "PAVAN VELA GRAND".
 * - Configurable navigation items (Stay, Suites, Experiences, Dining, Offers).
 * - Exactly ONE primary booking action: "Book a Room" in premium champagne gold (#C5A572).
 * - Fully accessible mobile navigation with keyboard escape handling.
 */
export function Navbar() {
  const { openBookingModal } = useBookingModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Smooth scroll handler for in-page landing section navigation
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        targetElement.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  // Mobile navigation click handler with drawer dismissal and smooth scroll
  const handleMobileNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileMenuOpen(false);

    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        requestAnimationFrame(() => {
          targetElement.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
          });
        });
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(23,59,99,0.06)] border-b border-slate-100"
          : "bg-white border-b border-slate-100/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            scrolled ? "h-16 sm:h-18 lg:h-20" : "h-20 sm:h-24"
          }`}
        >
          {/* Left: Official Brand Logo & Wordmark */}
          <Link
            href="/"
            className="group flex items-center space-x-2.5 sm:space-x-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B63] rounded px-1 -mx-1"
            aria-label={`${BRAND_CONFIG.name} Homepage`}
          >
            <div
              className={`relative rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-200/80 transition-all duration-300 group-hover:scale-105 bg-white ${
                scrolled
                  ? "w-9 h-9 sm:w-10 sm:h-10"
                  : "w-10 h-10 sm:w-12 sm:h-12"
              }`}
            >
              <Image
                src="/images/pvg-logo.png"
                alt="Pavan Vela Grand Logo"
                fill
                priority
                sizes="(max-width: 640px) 40px, 48px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              {/* Desktop / Tablet: Full Name */}
              <span
                className={`hidden sm:block font-bold tracking-[0.14em] text-[#173B63] transition-all duration-300 group-hover:text-[#C5A572] uppercase leading-tight whitespace-nowrap ${
                  scrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                }`}
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                {BRAND_CONFIG.name}
              </span>
              {/* Mobile: PVG Only */}
              <span
                className={`sm:hidden font-bold tracking-[0.18em] text-[#173B63] transition-all duration-300 group-hover:text-[#C5A572] uppercase leading-tight whitespace-nowrap ${
                  scrolled ? "text-base" : "text-lg"
                }`}
                style={{ fontFamily: "var(--font-cinzel), Georgia, serif" }}
              >
                {BRAND_CONFIG.shortName}
              </span>
              {/* Subtitle location: Hidden on mobile so only PVG shows */}
              <span
                className={`hidden sm:block tracking-[0.28em] text-[#536479] uppercase font-sans font-medium whitespace-nowrap transition-all duration-300 ${
                  scrolled
                    ? "text-[8.5px] sm:text-[9px] mt-0.5"
                    : "text-[9px] sm:text-[10px] mt-0.5"
                }`}
              >
                Palani Road Bypass &bull; Dindigul
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Items */}
          <nav
            className="hidden md:flex items-center space-x-6 lg:space-x-8"
            aria-label="Primary Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-sans font-medium text-[#182230] hover:text-[#173B63] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#C5A572] hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: Booking CTA (Desktop) */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={openBookingModal}
              className={`inline-flex items-center justify-center rounded-sm bg-[#C5A572] text-[#182230] font-sans uppercase tracking-[0.16em] font-semibold transition-all duration-300 hover:bg-[#B69562] hover:text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C5A572] ${
                scrolled ? "px-5 py-2 text-[11px]" : "px-6 py-2.5 text-xs"
              }`}
            >
              {NAV_BOOKING_CTA.label}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2.5 sm:space-x-3">
            <button
              type="button"
              onClick={openBookingModal}
              className={`inline-flex items-center justify-center rounded-sm bg-[#C5A572] text-[#182230] font-sans uppercase tracking-[0.12em] font-semibold transition-all duration-300 hover:bg-[#B69562] hover:text-white ${
                scrolled
                  ? "px-3 py-1.5 text-[10.5px]"
                  : "px-3.5 py-1.5 text-[11px]"
              }`}
            >
              Book
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded text-[#173B63] hover:text-[#C5A572] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173B63] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
            >
              <svg
                className={`transition-all duration-300 ${
                  scrolled ? "w-5 h-5" : "w-6 h-6"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-slate-100 bg-white px-4 pt-3 pb-6 shadow-lg"
          >
            <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleMobileNavClick(e, item.href)}
                  className="text-base font-sans font-medium text-[#182230] hover:text-[#173B63] py-1 border-b border-slate-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingModal();
                  }}
                  className="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#C5A572] text-[#182230] font-sans text-xs uppercase tracking-[0.16em] font-semibold transition-all hover:bg-[#B69562] hover:text-white"
                >
                  {NAV_BOOKING_CTA.label}
                </button>
                <p className="mt-2 text-center text-xs font-sans text-[#536479]">
                  Reservations: {BRAND_CONFIG.contact.phone}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
