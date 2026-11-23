import type { Metadata } from "next";
import { SITE_CONFIG, SITE_URL, ALLOW_INDEXING } from "@/config/site";
import type { ConstructMetadataParams } from "@/types/seo";

/**
 * Normalizes an internal path into a clean, canonical absolute URL.
 * Automatically strips double slashes and ensures standard HTTPS formatting in production.
 */
export function constructCanonicalUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/" || cleanPath === "") {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${cleanPath.replace(/\/+$/, "")}`;
}

/**
 * Generates type-safe Next.js Metadata for pages and layouts.
 *
 * Configures:
 * - Title & Title Template
 * - Description (optimized for SERP display)
 * - Canonical URLs (using primary https://pvgrand.com domain)
 * - Open Graph & Twitter Cards with verified property imagery
 * - Robots meta directives for search crawlers
 * - Search Console verification support
 */
export function constructMetadata({
  title,
  description = SITE_CONFIG.defaultDescription,
  path = "/",
  ogImage = "/images/hero/pvg-building-exterior.png",
  noIndex = !ALLOW_INDEXING,
}: ConstructMetadataParams = {}): Metadata {
  const canonicalUrl = constructCanonicalUrl(path);
  const resolvedTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.defaultTitle;

  const imageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_URL}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`;

  const images = [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: resolvedTitle,
    },
  ];

  return {
    metadataBase: new URL(SITE_URL.startsWith("http") ? SITE_URL : "https://pvgrand.com"),
    title: title
      ? {
          default: resolvedTitle,
          template: SITE_CONFIG.titleTemplate,
        }
      : {
          default: SITE_CONFIG.defaultTitle,
          template: SITE_CONFIG.titleTemplate,
        },
    description,
    keywords: [
      "Pavan Vela Grand",
      "Hotel in Dindigul",
      "Rooms in Dindigul",
      "Hotel rooms in Dindigul",
      "Hotel on Palani Road Bypass Dindigul",
      "Accommodation in Dindigul",
      "Peaceful accommodation in Dindigul",
      "Hotel stay in Dindigul",
      "Pavan Vela Grand Dindigul",
      "Hotel PVG Grand",
      "Covered Parking Hotel Dindigul",
    ],
    authors: [{ name: "Pavan Vela Grand", url: `${SITE_URL}/` }],
    creator: "Pavan Vela Grand",
    publisher: "Pavan Vela Grand",
    category: "Hotel & Accommodation",
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      title: resolvedTitle,
      description,
      siteName: SITE_CONFIG.name,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}
