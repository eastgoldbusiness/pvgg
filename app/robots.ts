import type { MetadataRoute } from "next";
import { SITE_CONFIG, ALLOW_INDEXING } from "@/config/site";

/**
 * Next.js Metadata API - Crawl Directives
 *
 * Directs search engine crawlers according to environment configuration.
 * Disallows only sensitive endpoints (/api/) while granting full access to public assets.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_CONFIG.url.replace(/\/+$/, "");

  if (!ALLOW_INDEXING) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
