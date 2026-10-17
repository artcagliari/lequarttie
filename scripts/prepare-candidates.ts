/**
 * Etapa 2 — Análise e pré-seleção das fotografias.
 *
 *   npm run apify:prepare
 *
 * Lê scripts/output/posts.json e gera:
 *  - candidates.json      todas as imagens (incluindo carrosséis) com nota e categorias sugeridas
 *  - contact-sheet.html   folha de contato para revisão visual (abra no navegador)
 *  - brand-signals.json   menções/marcações/hashtags — indícios de marcas, a confirmar com a loja
 *  - selection.draft.json pré-seleção automática (~32 imagens)
 *
 * Se scripts/selection.json ainda não existir, ele é criado a partir do rascunho.
 * A classificação é heurística: revise a seleção antes de importar.
 */
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import {
  PROFILE_USERNAME,
  paths,
  readJson,
  writeJson,
  type ApifyPost,
  type Candidate,
  type Category,
  type Selection,
} from "./shared";

const TARGET_TOTAL = 32;
const MAX_PER_POST = 2;
const QUOTAS: Partial<Record<Category, number>> = {
  feminino: 10,
  masculino: 10,
  loja: 4,
  detalhe: 4,
  campanha: 4,
};

// \b não funciona bem com acentos; usamos limites explícitos.
const word = (terms: string[]) =>
  new RegExp(`(^|[^\\p{L}])(${terms.join("|")})(?=$|[^\\p{L}])`, "iu");

const KEYWORDS: Record<Exclude<Category, "look" | "novidades">, RegExp> = {
  feminino: word([
    "feminin[oa]s?", "mulher(es)?", "ela", "dela", "vestidos?", "saias?", "blusas?", "croppeds?",
    "bodys?", "macac[aã]o", "scarpins?", "women", "woman", "dress(es)?", "skirts?", "girls?", "lady",
  ]),
  masculino: word([
    "masculin[oa]s?", "homens?", "ele", "dele", "camisas? social", "blazer masculino", "bermudas?",
    "men", "man", "menswear", "beard", "barba", "gentleman",
  ]),
  loja: word([
    "loja", "nossa loja", "ambiente", "vitrines?", "espa[çc]o", "provador", "fachada",
    "indoor", "store", "shop", "boutique", "clothing rack", "cabides?",
  ]),
  detalhe: word([
    "detalhes?", "acess[oó]rios?", "bolsas?", "sapatos?", "cintos?", "t[eê]nis", "rel[oó]gios?",
    "bijus?", "joias?", "close-up", "shoes?", "bags?", "jewelry", "handbag", "footwear",
  ]),
  campanha: word([
    "campanha", "editorial", "ensaio", "cole[çc][aã]o", "collection", "lookbook", "fotografia",
    "photoshoot", "shooting", "inverno", "ver[aã]o", "outono", "primavera",
  ]),
};
const NEW_KEYWORDS = word([
  "novidades?", "chegou", "chegaram", "lan[çc]amentos?", "new in", "rec[eé]m[- ]chegad[oa]s?", "acabou de chegar",
]);
const LOOK_KEYWORDS = word(["look", "looks", "outfit", "produ[çc][aã]o", "composi[çc][aã]o", "combina[çc][aã]o"]);
// Instagram gera alt text automático: "May be an image of text that says…" indica flyer/print.
const TEXT_HEAVY = /image of (text|.*text that says)|imagem de texto|text that says|poster|flyer/i;

function expandPost(post: ApifyPost): Omit<Candidate, "score" | "suggested" | "flags">[] {
  const base = {
    shortCode: post.shortCode,
    postUrl: post.url || `https://www.instagram.com/p/${post.shortCode}/`,
    caption: post.caption ?? "",
    timestamp: post.timestamp,
    likes: post.likesCount ?? 0,
  };

  if (post.type === "Sidecar" && post.childPosts?.length) {
    return post.childPosts
      .filter((child) => child.type !== "Video" && child.displayUrl)
      .map((child, index) => ({
        ...base,
        key: `${post.shortCode}-${index}`,
        carouselIndex: index,
        imageUrl: child.displayUrl!,
        width: child.dimensionsWidth ?? post.dimensionsWidth ?? 0,
        height: child.dimensionsHeight ?? post.dimensionsHeight ?? 0,
        alt: child.alt ?? "",
      }));
  }
  if (post.type === "Sidecar" && post.images?.length) {
    return post.images.map((url, index) => ({
      ...base,
      key: `${post.shortCode}-${index}`,
      carouselIndex: index,
      imageUrl: url,
      width: post.dimensionsWidth ?? 0,
      height: post.dimensionsHeight ?? 0,
      alt: index === 0 ? (post.alt ?? "") : "",
    }));
  }
  if (post.type === "Video" || !post.displayUrl) return [];
  return [
    {
      ...base,
      key: `${post.shortCode}-0`,
      carouselIndex: 0,
      imageUrl: post.displayUrl,
      width: post.dimensionsWidth ?? 0,
      height: post.dimensionsHeight ?? 0,
      alt: post.alt ?? "",
    },
  ];
}

function analyse(
  item: Omit<Candidate, "score" | "suggested" | "flags">,
  newestTimestamp: number,
  maxLikes: number,
): Candidate {
  const text = `${item.caption}\n${item.alt}`;
  const suggested = new Set<Category>();
  const flags: string[] = [];

  for (const [category, regex] of Object.entries(KEYWORDS) as [Category, RegExp][]) {
    if (regex.test(text)) suggested.add(category);
  }
  if (LOOK_KEYWORDS.test(text) || suggested.has("feminino") || suggested.has("masculino")) {
    suggested.add("look");
  }

  const ageDays = item.timestamp
    ? (newestTimestamp - new Date(item.timestamp).getTime()) / 86_400_000
    : Infinity;
  if (NEW_KEYWORDS.test(text) || ageDays <= 45) suggested.add("novidades");

  let score = 0;
  const minSide = Math.min(item.width, item.height);
  if (minSide >= 1080) score += 30;
  else if (minSide >= 720) score += 15;
  else flags.push("baixa-resolucao");

  const ratio = item.height / Math.max(item.width, 1);
  if (ratio >= 1.2) score += 15; // vertical — melhor para moda
  else if (ratio >= 0.95) score += 8;

  score += Math.round((item.likes / Math.max(maxLikes, 1)) * 25);
  score += Math.max(0, Math.round(20 - ageDays / 18)); // recência
  if (item.carouselIndex === 0) score += 5;

  if (TEXT_HEAVY.test(item.alt)) {
    score -= 40;
    flags.push("possivel-arte-com-texto");
  }
  if (suggested.has("feminino") && suggested.has("masculino")) flags.push("genero-ambiguo");
  if (!suggested.has("feminino") && !suggested.has("masculino")) flags.push("genero-nao-identificado");

  return { ...item, score, suggested: [...suggested], flags };
}

function pickDraft(candidates: Candidate[]): Selection {
  const perPost = new Map<string, number>();
  const perCategory = new Map<Category, number>();
  const chosen: Candidate[] = [];

  const sorted = [...candidates]
    .filter((c) => !c.flags.includes("possivel-arte-com-texto") && !c.flags.includes("baixa-resolucao"))
    .sort((a, b) => b.score - a.score);

  const take = (c: Candidate) => {
    chosen.push(c);
    perPost.set(c.shortCode, (perPost.get(c.shortCode) ?? 0) + 1);
    for (const cat of c.suggested) perCategory.set(cat, (perCategory.get(cat) ?? 0) + 1);
  };
  const available = (c: Candidate) =>
    !chosen.includes(c) && (perPost.get(c.shortCode) ?? 0) < MAX_PER_POST;

  // 1º: preencher cotas por categoria
  for (const [category, quota] of Object.entries(QUOTAS) as [Category, number][]) {
    for (const c of sorted) {
      if ((perCategory.get(category) ?? 0) >= quota) break;
      if (c.suggested.includes(category) && available(c)) take(c);
    }
  }
  // 2º: completar com as melhores notas
  for (const c of sorted) {
    if (chosen.length >= TARGET_TOTAL) break;
    if (available(c)) take(c);
  }

  return {
    authorization: {
      status: "pending",
      notes: "Alterar para \"granted\" somente após autorização formal da Lequarttiê.",
    },
    items: chosen.map((c) => ({
      key: c.key,
      categories: c.suggested.length ? c.suggested : ["look"],
      alt: "",
      featured: false,
    })),
  };
}

function brandSignals(posts: ApifyPost[]) {
  const count = (values: string[]) => {
    const map = new Map<string, number>();
    for (const v of values) map.set(v.toLowerCase(), (map.get(v.toLowerCase()) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, occurrences]) => ({ name, occurrences }));
  };
  return {
    note:
      "Indícios automáticos — NÃO são marcas confirmadas. Verifique cada perfil e confirme com a loja antes de citar no site.",
    mentions: count(posts.flatMap((p) => p.mentions ?? []).filter((m) => m !== PROFILE_USERNAME)),
    taggedUsers: count(
      posts.flatMap((p) => (p.taggedUsers ?? []).map((t) => t.username ?? "")).filter(Boolean),
    ),
    hashtags: count(posts.flatMap((p) => p.hashtags ?? [])),
  };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);

function contactSheet(candidates: Candidate[], draft: Selection) {
  const selected = new Set(draft.items.map((i) => i.key));
  const cards = candidates
    .map(
      (c) => `
    <figure class="${selected.has(c.key) ? "sel" : ""}">
      <img src="${escapeHtml(c.imageUrl)}" loading="lazy" referrerpolicy="no-referrer" alt="">
      <figcaption>
        <strong>${c.key}</strong> · nota ${c.score} · ${c.width}×${c.height}<br>
        <em>${c.suggested.join(", ") || "—"}</em>${c.flags.length ? `<br><span class="flag">${c.flags.join(", ")}</span>` : ""}<br>
        <small>${escapeHtml(c.caption.slice(0, 140))}</small><br>
        <a href="${c.postUrl}" target="_blank" rel="noreferrer">post original ↗</a>
      </figcaption>
    </figure>`,
    )
    .join("");
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Lequarttiê — folha de contato</title>
<style>
body{font:13px/1.4 system-ui;margin:24px;background:#f7f4ee;color:#171717}
h1{font-weight:500}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
figure{margin:0;background:#fff;padding:8px;border:2px solid transparent}figure.sel{border-color:#171717}
img{width:100%;aspect-ratio:4/5;object-fit:cover;background:#e8e0d5}.flag{color:#a33}
</style>
<h1>Folha de contato — ${candidates.length} imagens (borda preta = pré-selecionada)</h1>
<p>As URLs do Instagram expiram em poucos dias. Edite <code>scripts/selection.json</code> e rode <code>npm run images:import</code>.</p>
<main>${cards}</main></html>`;
}

async function main() {
  if (!existsSync(paths.posts)) {
    console.error("✖ scripts/output/posts.json não encontrado. Rode antes: npm run apify:scrape");
    process.exit(1);
  }
  const posts = await readJson<ApifyPost[]>(paths.posts);
  const raw = posts.flatMap(expandPost);
  const newest = Math.max(...posts.map((p) => (p.timestamp ? new Date(p.timestamp).getTime() : 0)));
  const maxLikes = Math.max(...posts.map((p) => p.likesCount ?? 0));
  const candidates = raw.map((c) => analyse(c, newest, maxLikes)).sort((a, b) => b.score - a.score);

  const draft = pickDraft(candidates);
  await writeJson(paths.candidates, candidates);
  await writeJson(paths.brandSignals, brandSignals(posts));
  await writeJson(paths.selectionDraft, draft);
  await writeFile(paths.contactSheet, contactSheet(candidates, draft), "utf8");

  const byCategory = (cat: Category) => draft.items.filter((i) => i.categories.includes(cat)).length;
  console.log(`✓ ${posts.length} publicações → ${candidates.length} imagens candidatas`);
  console.log(`✓ Pré-seleção: ${draft.items.length} imagens`);
  console.log(
    "  " + (["feminino", "masculino", "look", "campanha", "detalhe", "loja", "novidades"] as Category[])
      .map((c) => `${c}: ${byCategory(c)}`)
      .join(" · "),
  );

  if (!existsSync(paths.selection)) {
    await writeJson(paths.selection, draft);
    console.log("✓ scripts/selection.json criado a partir da pré-seleção");
  } else {
    console.log("• scripts/selection.json já existe — mantido (rascunho novo em scripts/output/selection.draft.json)");
  }
  console.log("\nRevise: scripts/output/contact-sheet.html → edite scripts/selection.json → npm run images:import");
}

main().catch((error) => {
  console.error("\n✖", error instanceof Error ? error.message : error);
  process.exit(1);
});
