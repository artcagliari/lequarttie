import { config } from "dotenv";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });

export const ROOT = process.cwd();
export const OUTPUT_DIR = path.join(ROOT, "scripts", "output");
export const IMAGES_DIR = path.join(ROOT, "public", "images", "lequarttie");
export const DATA_DIR = path.join(ROOT, "data");

export const PROFILE_URL = "https://www.instagram.com/lequarttie.mm/";
export const PROFILE_USERNAME = "lequarttie.mm";
export const ACTOR_ID = "apify/instagram-scraper";

export const paths = {
  posts: path.join(OUTPUT_DIR, "posts.json"),
  details: path.join(OUTPUT_DIR, "details.json"),
  runMeta: path.join(OUTPUT_DIR, "run-meta.json"),
  candidates: path.join(OUTPUT_DIR, "candidates.json"),
  brandSignals: path.join(OUTPUT_DIR, "brand-signals.json"),
  contactSheet: path.join(OUTPUT_DIR, "contact-sheet.html"),
  selectionDraft: path.join(OUTPUT_DIR, "selection.draft.json"),
  selection: path.join(ROOT, "scripts", "selection.json"),
  importReport: path.join(OUTPUT_DIR, "import-report.json"),
  mediaGenerated: path.join(DATA_DIR, "media.generated.json"),
  looksGenerated: path.join(DATA_DIR, "looks.generated.json"),
  profileGenerated: path.join(DATA_DIR, "instagram-profile.generated.json"),
};

export async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T;
}

export async function writeJson(file: string, data: unknown) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function requireToken() {
  const token = process.env.APIFY_API_TOKEN?.trim();
  if (!token) {
    console.error(
      "\n✖ APIFY_API_TOKEN não configurado.\n" +
        "  Adicione o token em .env.local (veja .env.example) e rode novamente.\n" +
        "  Token: https://console.apify.com/settings/integrations\n",
    );
    process.exit(1);
  }
  return token;
}

/* ---------- Tipos (parciais) do dataset do apify/instagram-scraper ---------- */

export interface ApifyChildPost {
  id?: string;
  type?: string;
  displayUrl?: string;
  alt?: string | null;
  dimensionsWidth?: number;
  dimensionsHeight?: number;
}

export interface ApifyPost {
  id: string;
  type: "Image" | "Sidecar" | "Video" | string;
  shortCode: string;
  url: string;
  caption?: string;
  hashtags?: string[];
  mentions?: string[];
  taggedUsers?: { username?: string; full_name?: string }[];
  displayUrl?: string;
  images?: string[];
  alt?: string | null;
  dimensionsWidth?: number;
  dimensionsHeight?: number;
  likesCount?: number;
  commentsCount?: number;
  timestamp?: string;
  childPosts?: ApifyChildPost[];
  ownerUsername?: string;
  isPinned?: boolean;
  productType?: string;
  error?: string;
}

export interface ApifyProfileDetails {
  username?: string;
  fullName?: string;
  biography?: string;
  externalUrl?: string;
  externalUrls?: { url?: string; title?: string }[];
  followersCount?: number;
  followsCount?: number;
  postsCount?: number;
  profilePicUrl?: string;
  profilePicUrlHD?: string;
  businessCategoryName?: string;
  verified?: boolean;
  isBusinessAccount?: boolean;
  error?: string;
}

/* ---------- Candidatos e seleção ---------- */

export const CATEGORIES = [
  "feminino",
  "masculino",
  "novidades",
  "look",
  "campanha",
  "detalhe",
  "loja",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Candidate {
  key: string;
  shortCode: string;
  postUrl: string;
  carouselIndex: number;
  imageUrl: string;
  width: number;
  height: number;
  score: number;
  suggested: Category[];
  caption: string;
  alt: string;
  timestamp?: string;
  likes: number;
  flags: string[];
}

export interface SelectionItem {
  key: string;
  categories: Category[];
  alt?: string;
  lookName?: string;
  brand?: string;
  description?: string;
  featured?: boolean;
}

export interface Selection {
  authorization: {
    /** "granted" somente após autorização formal da loja. */
    status: "pending" | "granted";
    grantedBy?: string;
    date?: string;
    notes?: string;
  };
  items: SelectionItem[];
}
