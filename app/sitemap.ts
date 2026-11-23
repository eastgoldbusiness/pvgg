import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

/**
 * Next.js Metadata API - XML Sitemap Generator
 *
 * Exposes the canonical homepage URL for Pavan Vela Grand.
 * Single-page landing site with verified anchor sections.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url.replace(/\/+$/, "");

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
