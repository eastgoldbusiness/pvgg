import type { SiteConfig } from "@/types/site";
import { BRAND_CONFIG } from "./brand";

/**
 * Pavan Vela Grand - Site and Environment Configuration
 *
 * Centralizes site URL, title templates, default descriptions,
 * and search engine indexing controls.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pvgrand.com";

// Ensure siteUrl has no trailing slash for consistent canonical and sitemap URLs
export const SITE_URL = rawSiteUrl.replace(/\/+$/, "");

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Indexing is allowed by default unless explicitly disabled with NEXT_PUBLIC_ALLOW_INDEXING="false"
export const ALLOW_INDEXING =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

export const SITE_CONFIG: SiteConfig = {
  name: BRAND_CONFIG.name,
  shortName: BRAND_CONFIG.shortName,
  url: SITE_URL,
  defaultTitle: "Pavan Vela Grand — Hotel in Dindigul | Palani Road Bypass",
  titleTemplate: `%s | ${BRAND_CONFIG.name}`,
  defaultDescription:
    "Book your stay at Pavan Vela Grand, a peaceful hotel in Dindigul on Palani Road Bypass. Explore comfortable hotel rooms with covered parking. Enquire directly.",
  locale: "en_IN",
  isProduction: IS_PRODUCTION,
  allowIndexing: ALLOW_INDEXING,
};
