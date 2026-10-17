export type MediaCategory =
  | "feminino"
  | "masculino"
  | "novidades"
  | "look"
  | "campanha"
  | "detalhe"
  | "loja";

export type Gender = "feminino" | "masculino";

export interface MediaSource {
  platform: "instagram";
  shortCode: string;
  postUrl: string;
  timestamp?: string;
  caption?: string;
  carouselIndex?: number;
}

/** Fotografia local, gerada por `npm run images:import`. */
export interface MediaItem {
  id: string;
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt: string;
  categories: MediaCategory[];
  featured?: boolean;
  /** true somente quando a loja autorizou o uso da imagem. */
  authorized: boolean;
  source: MediaSource;
}

export type PlaceholderTone = "ivory" | "sand" | "taupe" | "graphite" | "ink";

export type Visual =
  | ({ kind: "photo" } & MediaItem)
  | {
      kind: "placeholder";
      id: string;
      category: MediaCategory;
      label: string;
      alt: string;
      tone: PlaceholderTone;
    };

export type Availability = "disponivel" | "sob-consulta" | "indisponivel";

/**
 * Look do catálogo. Os campos opcionais só devem ser preenchidos
 * com informação confirmada pela loja — nunca inventar marca,
 * preço, tamanho ou estoque.
 */
export interface Look {
  id: string;
  name: string;
  gender: Gender;
  isNew?: boolean;
  brand?: string;
  description?: string;
  mediaId?: string;
  postUrl?: string;
  featured?: boolean;
  availability?: Availability;
}

export interface CatalogLook extends Look {
  visual: Visual;
}

export interface Brand {
  name: string;
  /** Logotipo apenas com autorização; caso contrário, exibe o nome. */
  logo?: string;
  /** Onde a marca foi confirmada (post, conversa com a loja etc.). */
  source: string;
}

export interface Review {
  author: string;
  rating?: number;
  text: string;
  date?: string;
  sourceName: string;
  sourceUrl: string;
}
