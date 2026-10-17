import { site } from "@/data/site";
import { pickMedia } from "@/lib/media";

/** Schema.org ClothingStore para SEO local. */
export function clothingStoreJsonLd() {
  const [cover] = pickMedia("feminino", 1);
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${site.url}/#store`,
    name: site.fullName,
    alternateName: site.name,
    description: `${site.segment} em ${site.address.city} – ${site.address.state}. ${site.description}`,
    url: site.url,
    telephone: site.phone.e164,
    image: cover.kind === "photo" ? `${site.url}${cover.src}` : `${site.url}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: { "@type": "City", name: site.address.city },
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.schemaDays,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [site.social.instagram.url, site.social.facebook],
  };
}
