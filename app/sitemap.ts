import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Data fixa: mantém a rota estática. Atualize ao publicar mudanças relevantes.
const LAST_MODIFIED = "2026-10-17";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 1 }];
}
