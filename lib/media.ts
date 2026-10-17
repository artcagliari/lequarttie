import generated from "@/data/media.generated.json";
import type { MediaCategory, MediaItem, PlaceholderTone, Visual } from "@/lib/types";

const media = generated as MediaItem[];

const CATEGORY_LABEL: Record<MediaCategory, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  novidades: "Novidades",
  look: "Look",
  campanha: "Campanha",
  detalhe: "Detalhe",
  loja: "A Loja",
};

const TONES: PlaceholderTone[] = ["sand", "taupe", "ivory", "graphite"];

export interface MediaSelectionOptions {
  excludeIds?: ReadonlySet<string>;
}

export interface FindMediaOptions extends MediaSelectionOptions {
  requiredCategories?: MediaCategory[];
  excludedCategories?: MediaCategory[];
}

export interface PickMediaOptions extends MediaSelectionOptions {
  offset?: number;
  tones?: PlaceholderTone[];
}

export function hasRealMedia() {
  return media.length > 0;
}

export function getMediaById(id: string | undefined) {
  return id ? media.find((item) => item.id === id) : undefined;
}

export function toVisual(item: MediaItem): Visual {
  return { kind: "photo", ...item };
}

export function placeholder(
  category: MediaCategory,
  index: number,
  tone?: PlaceholderTone,
): Visual {
  const number = String(index + 1).padStart(2, "0");
  return {
    kind: "placeholder",
    id: `placeholder-${category}-${number}`,
    category,
    label: `${CATEGORY_LABEL[category]} · ${number}`,
    alt: `Espaço reservado para fotografia — ${CATEGORY_LABEL[category]} ${number}`,
    tone: tone ?? TONES[index % TONES.length],
  };
}

function rankedMedia(category: MediaCategory, excludeIds?: ReadonlySet<string>) {
  return media
    .filter((item) => item.categories.includes(category) && !excludeIds?.has(item.id))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

/** Encontra uma foto compatível sem reutilizar mídias já reservadas pela página. */
export function findMedia(
  category: MediaCategory,
  {
    excludeIds,
    requiredCategories = [],
    excludedCategories = [],
  }: FindMediaOptions = {},
): Visual | undefined {
  const item = rankedMedia(category, excludeIds).find(
    (candidate) =>
      requiredCategories.every((required) => candidate.categories.includes(required)) &&
      excludedCategories.every((excluded) => !candidate.categories.includes(excluded)),
  );

  return item ? toVisual(item) : undefined;
}

/**
 * Retorna `count` imagens da categoria, priorizando as marcadas como
 * destaque. Quando não há fotos suficientes, completa com espaços
 * reservados — nunca mistura categorias (um look masculino não
 * aparece na seção feminina).
 */
export function pickMedia(
  category: MediaCategory,
  count: number,
  { offset = 0, tones, excludeIds }: PickMediaOptions = {},
): Visual[] {
  const matches = rankedMedia(category, excludeIds);

  return Array.from({ length: count }, (_, i) => {
    const item = matches[offset + i];
    return item ? toVisual(item) : placeholder(category, offset + i, tones?.[i]);
  });
}

/** Publicações mais recentes, para a seção Novidades. */
export function recentMedia(count: number, { excludeIds }: MediaSelectionOptions = {}) {
  const seen = new Set<string>();
  return media
    .filter((item) => item.source.timestamp && !excludeIds?.has(item.id))
    .sort((a, b) => (b.source.timestamp ?? "").localeCompare(a.source.timestamp ?? ""))
    .filter((item) => {
      // uma imagem por publicação
      if (seen.has(item.source.shortCode)) return false;
      seen.add(item.source.shortCode);
      return true;
    })
    .slice(0, count);
}

export function usesUnauthorizedMedia() {
  return media.some((item) => !item.authorized);
}
