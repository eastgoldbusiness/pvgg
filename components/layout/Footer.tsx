"use client";

import React from "react";
import Image from "next/image";
import { Phone, MessageSquare, MapPin, ShieldCheck, ArrowUp } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";
import { NAV_BOOKING_CTA } from "@/config/navigation";

export function Footer() {
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

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return (
    <footer
      id="footer"
      aria-labelledby="footer-heading"
      className="relative w-full bg-[#0B1B2C] text-white border-t border-[#C5A572]/20 select-none overflow-hidden"
    >
      <h2 id="footer-heading" className="sr-only">
        Pavan Vela Grand Footer and Hotel Contact Information
      </h2>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand & Introduction Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand Header */}
              <div className="flex items-center space-x-3.5 mb-6">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 shadow-md bg-white ring-1 ring-white/20">
                  <Image
                    src="/images/pvg-logo.png"
                    alt="Pavan Vela Grand Hotel Logo"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-lg sm:text-xl font-serif font-bold tracking-[0.08em] text-white leading-tight uppercase"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {BRAND_CONFIG.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.22em] text-[#C5A572] uppercase mt-0.5">
                    {BRAND_CONFIG.location.addressLine} · {BRAND_CONFIG.location.city}
                  </span>
                </div>
              </div>

              {/* Brief Intro */}
              <p className="text-sm text-slate-300/90 font-sans leading-relaxed max-w-md">
                Located on Palani Road Bypass in Dindigul, Tamil Nadu, Pavan Vela
                Grand offers guests a peaceful stay with covered parking,
                convenient bypass access, and comfortable room accommodations.
              </p>
            </div>

            {/* Verified Stay Signals */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-sans text-slate-300">
              <span className="inline-flex items-center space-x-1.5 text-[#C5A572]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-slate-300 font-medium">Covered Parking</span>
              </span>
              <span className="text-white/20">·</span>
              <span className="inline-flex items-center space-x-1.5 text-[#C5A572]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-slate-300 font-medium">Peaceful Setting</span>
              </span>
              <span className="text-white/20">·</span>
              <span className="inline-flex items-center space-x-1.5 text-[#C5A572]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-slate-300 font-medium">Palani Road Bypass</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.24em] text-[#C5A572] mb-6">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <a
                  href="#suites"
                  onClick={(e) => handleNavClick(e, "#suites")}
                  className="text-slate-300 hover:text-[#C5A572] transition-colors"
                >
                  Rooms & Suites
                </a>
              </li>
              <li>
                <a
                  href="#facilities"
                  onClick={(e) => handleNavClick(e, "#facilities")}
                  className="text-slate-300 hover:text-[#C5A572] transition-colors"
                >
                  Verified Facilities
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={(e) => handleNavClick(e, "#experiences")}
                  className="text-slate-300 hover:text-[#C5A572] transition-colors"
                >
                  Guest Experiences
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "#about")}
                  className="text-slate-300 hover:text-[#C5A572] transition-colors"
                >
                  About the Hotel
                </a>
              </li>
              <li>
                <a
                  href="#location"
                  onClick={(e) => handleNavClick(e, "#location")}
                  className="text-slate-300 hover:text-[#C5A572] transition-colors"
                >
                  Location & Bypass
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Reservations & Contact Column */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.24em] text-[#C5A572] mb-6">
              Direct Enquiries
            </h3>
            <div className="space-y-4 text-sm font-sans">
              {/* Phone Booking */}
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#C5A572] mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-400">
                    Call Reservations
                  </span>
                  <a
                    href={NAV_BOOKING_CTA.href}
                    className="text-base font-semibold text-white hover:text-[#C5A572] transition-colors"
                  >
                    +91 {BRAND_CONFIG.contact.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp Enquiry */}
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-4 h-4 text-[#C5A572] mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-400">
                    WhatsApp Enquiry
                  </span>
                  <a
                    href={NAV_BOOKING_CTA.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-slate-200 hover:text-[#C5A572] transition-colors"
                  >
                    Chat with Front Desk
                  </a>
                </div>
              </div>

              {/* Location Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#C5A572] mt-1 flex-shrink-0" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-400">
                    Location
                  </span>
                  <p className="text-sm text-slate-300">
                    {BRAND_CONFIG.location.formattedAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-400">
          <p>
            © 2026 {BRAND_CONFIG.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-5">
            <p className="text-slate-400">
              Designed & Developed by{" "}
              <a
                href="https://javixtechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A572] hover:text-white transition-colors font-semibold"
              >
                Javix Technologies
              </a>
            </p>

            <span className="hidden sm:inline text-slate-600" aria-hidden="true">
              ·
            </span>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-[#C5A572] transition-colors focus:outline-none"
              aria-label="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
