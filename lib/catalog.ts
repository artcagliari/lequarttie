import generatedLooks from "@/data/looks.generated.json";
import { lookOverrides, manualLooks } from "@/data/looks";
import { getMediaById, placeholder, toVisual } from "@/lib/media";
import type { CatalogLook, Look } from "@/lib/types";

/**
 * Fonte de dados do catálogo.
 *
 * Hoje o catálogo é local (arquivos em /data). Para integrar com
 * Shopify, Nuvemshop, WooCommerce ou um sistema próprio no futuro,
 * basta criar outro provider que implemente esta interface e trocar
 * a exportação `catalog` abaixo.
 */
export interface CatalogProvider {
  listLooks(options?: { excludeMediaIds?: ReadonlySet<string> }): CatalogLook[];
}

/** Quantidade de looks de exemplo exibidos enquanto não há fotos importadas. */
const PLACEHOLDER_LOOKS = 8;

function placeholderLooks(): Look[] {
  return Array.from({ length: PLACEHOLDER_LOOKS }, (_, i) => {
    const gender = i % 2 === 0 ? "feminino" : "masculino";
    const n = String(Math.floor(i / 2) + 1).padStart(2, "0");
    return {
      id: `look-${gender}-${n}`,
      name: `Look ${gender === "feminino" ? "Feminino" : "Masculino"} ${n}`,
      gender,
      isNew: i < 4,
    } satisfies Look;
  });
}

const localProvider: CatalogProvider = {
  listLooks({ excludeMediaIds } = {}) {
    const base = [...(generatedLooks as Look[]), ...manualLooks];
    const looks = base.length > 0 ? base : placeholderLooks();

    return looks
      .filter((look) => !look.mediaId || !excludeMediaIds?.has(look.mediaId))
      .map((look, i) => {
      const merged = { ...look, ...lookOverrides[look.id] };
      const media = getMediaById(merged.mediaId);
      return {
        ...merged,
        visual: media
          ? toVisual(media)
          : placeholder(merged.gender, i, (["sand", "taupe", "ivory", "graphite"] as const)[i % 4]),
      };
      });
  },
};

export const catalog: CatalogProvider = localProvider;
