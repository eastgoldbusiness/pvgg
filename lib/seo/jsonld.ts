import { BRAND_CONFIG } from "@/config/brand";
import { SITE_URL } from "@/config/site";
import { ROOMS_ACCOMMODATIONS } from "@/config/rooms";
import type { HotelJsonLdOptions, LocalBusinessJsonLdOptions } from "@/types/seo";

/**
 * Generates Schema.org Hotel JSON-LD structured data.
 *
 * Strictly verified hotel facts only:
 * - Hotel name: Pavan Vela Grand
 * - Address: Palani Road Bypass, Dindigul, Tamil Nadu, India
 * - Phone: +918940444648
 * - Verified amenities: Covered Parking, Air Conditioning, Peaceful Setting
 * - No fake reviews, star ratings, or invented prices.
 */
export function generateHotelJsonLd(options?: HotelJsonLdOptions) {
  const url = (options?.siteUrl || SITE_URL).replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${url}/#hotel`,
    name: BRAND_CONFIG.name,
    alternateName: [BRAND_CONFIG.shortName, "Hotel PVG Grand"],
    url: `${url}/`,
    telephone: BRAND_CONFIG.contact.phoneTel,
    image: [
      `${url}/images/hero/pvg-building-exterior.png`,
      `${url}/images/about/pvg-about-hero.png`,
      `${url}/images/facilities/pvg-covered-parking.png`,
    ],
    description:
      "Pavan Vela Grand is a hotel in Dindigul located on Palani Road Bypass, offering comfortable rooms, a peaceful setting away from traffic, and secure on-site covered parking.",
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND_CONFIG.location.addressLine,
      addressLocality: BRAND_CONFIG.location.city,
      addressRegion: BRAND_CONFIG.location.state,
      addressCountry: BRAND_CONFIG.location.countryCode,
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Covered Parking",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Air Conditioning",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Peaceful Setting with Low Traffic Disturbance",
        value: true,
      },
    ],
    checkinTime: "12:00",
    checkoutTime: "11:00",
    containsPlace: ROOMS_ACCOMMODATIONS.map((room) => ({
      "@type": "HotelRoom",
      name: room.name,
      description: room.description,
      ...(room.specs?.bedType
        ? {
            bed: {
              "@type": "BedDetails",
              typeOfBed: room.specs.bedType,
            },
          }
        : {}),
      ...(room.specs?.guestCapacity
        ? {
            occupancy: {
              "@type": "QuantitativeValue",
              name: room.specs.guestCapacity,
            },
          }
        : {}),
    })),
  };
}

/**
 * Generates Schema.org LodgingBusiness JSON-LD structured data.
 * Enhances regional Google Local Search context for Palani Road Bypass, Dindigul.
 */
export function generateLocalBusinessJsonLd(options?: LocalBusinessJsonLdOptions) {
  const url = (options?.siteUrl || SITE_URL).replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${url}/#localbusiness`,
    name: BRAND_CONFIG.name,
    alternateName: [BRAND_CONFIG.shortName, "Hotel PVG Grand"],
    url: `${url}/`,
    telephone: BRAND_CONFIG.contact.phoneTel,
    image: `${url}/images/hero/pvg-building-exterior.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND_CONFIG.location.addressLine,
      addressLocality: BRAND_CONFIG.location.city,
      addressRegion: BRAND_CONFIG.location.state,
      addressCountry: BRAND_CONFIG.location.countryCode,
    },
  };
}

/**
 * Generates Schema.org WebSite JSON-LD structured data.
 */
export function generateWebSiteJsonLd(options?: { siteUrl?: string }) {
  const url = (options?.siteUrl || SITE_URL).replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url: `${url}/`,
    name: BRAND_CONFIG.name,
    alternateName: BRAND_CONFIG.shortName,
    description:
      "Official website of Pavan Vela Grand, hotel on Palani Road Bypass, Dindigul, Tamil Nadu.",
    inLanguage: "en-IN",
  };
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD structured data.
 */
export function generateBreadcrumbJsonLd(options?: { siteUrl?: string }) {
  const url = (options?.siteUrl || SITE_URL).replace(/\/+$/, "");

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${url}/`,
      },
    ],
  };
}
