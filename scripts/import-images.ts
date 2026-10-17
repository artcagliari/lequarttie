/**
 * Etapa 3 — Download e otimização das fotografias selecionadas.
 *
 *   npm run images:import
 *
 * Lê scripts/selection.json + scripts/output/candidates.json, baixa as
 * imagens, converte para WebP (máx. 2000px) com blur placeholder e grava:
 *  - public/images/lequarttie/<categoria>/<categoria>-NN.webp
 *  - data/media.generated.json   metadados usados pelo site
 *  - data/looks.generated.json   looks base do catálogo
 *  - data/instagram-profile.generated.json + foto de perfil (se houver details.json)
 *
 * O site passa a funcionar 100% com arquivos locais — sem depender das
 * URLs temporárias do Instagram.
 */
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  IMAGES_DIR,
  paths,
  readJson,
  writeJson,
  type ApifyProfileDetails,
  type Candidate,
  type Category,
  type Selection,
  type SelectionItem,
} from "./shared";

const PRIMARY_ORDER: Category[] = ["loja", "detalhe", "campanha", "feminino", "masculino", "look"];
const GENERATED_FOLDERS = [...PRIMARY_ORDER, "brand"];

const ALT_BY_CATEGORY: Record<Category, string> = {
  feminino: "Look feminino da Lequarttiê",
  masculino: "Look masculino da Lequarttiê",
  loja: "Ambiente da loja Lequarttiê, em Bento Gonçalves",
  detalhe: "Detalhe de peça da Lequarttiê",
  campanha: "Fotografia de campanha da Lequarttiê",
  look: "Look da Lequarttiê",
  novidades: "Novidade da Lequarttiê",
};

function primaryCategory(categories: Category[]): Category {
  // Gênero tem prioridade sobre "campanha"/"detalhe" quando ambos existem
  if (categories.includes("feminino") && !categories.includes("masculino")) {
    if (!categories.includes("loja")) return "feminino";
  }
  if (categories.includes("masculino") && !categories.includes("feminino")) {
    if (!categories.includes("loja")) return "masculino";
  }
  return PRIMARY_ORDER.find((c) => categories.includes(c)) ?? "look";
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
}

async function download(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function optimise(buffer: Buffer, outFile: string, maxWidth = 2000) {
  await mkdir(path.dirname(outFile), { recursive: true });
  const image = sharp(buffer).rotate();
  const info = await image
    .clone()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outFile);
  const blur = await image.clone().resize(16).webp({ quality: 40 }).toBuffer();
  return {
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

async function importProfile() {
  if (!existsSync(paths.details)) return;
  const details = await readJson<ApifyProfileDetails | null>(paths.details);
  if (!details || details.error) return;

  let profileImage: string | undefined;
  const picUrl = details.profilePicUrlHD ?? details.profilePicUrl;
  if (picUrl) {
    try {
      await optimise(await download(picUrl), path.join(IMAGES_DIR, "brand", "profile.webp"), 640);
      profileImage = "/images/lequarttie/brand/profile.webp";
    } catch (error) {
      console.warn("  ⚠ foto de perfil:", (error as Error).message);
    }
  }

  await writeJson(paths.profileGenerated, {
    username: details.username,
    fullName: details.fullName,
    biography: details.biography,
    externalUrl: details.externalUrl,
    followersCount: details.followersCount,
    postsCount: details.postsCount,
    businessCategoryName: details.businessCategoryName,
    profileImage,
  });
  console.log(`✓ Perfil: ${details.fullName ?? details.username} — ${details.followersCount ?? "?"} seguidores`);
}

async function main() {
  if (!existsSync(paths.selection) || !existsSync(paths.candidates)) {
    console.error("✖ Rode antes: npm run apify:scrape && npm run apify:prepare");
    process.exit(1);
  }
  const selection = await readJson<Selection>(paths.selection);
  const candidates = new Map(
    (await readJson<Candidate[]>(paths.candidates)).map((c) => [c.key, c] as const),
  );
  const authorized = selection.authorization.status === "granted";

  if (!authorized) {
    console.warn(
      "⚠ Autorização da loja: PENDENTE. As imagens serão marcadas como não autorizadas\n" +
        "  e devem ser usadas apenas na demonstração privada.\n",
    );
  }

  for (const folder of GENERATED_FOLDERS) {
    await rm(path.join(IMAGES_DIR, folder), { recursive: true, force: true });
  }

  const counters = new Map<Category, number>();
  const media: unknown[] = [];
  const looks: unknown[] = [];
  const lookCounters = { feminino: 0, masculino: 0 };
  const report = { imported: [] as string[], failed: [] as { key: string; reason: string }[] };

  for (const item of selection.items as SelectionItem[]) {
    const candidate = candidates.get(item.key);
    if (!candidate) {
      report.failed.push({ key: item.key, reason: "não encontrada em candidates.json" });
      continue;
    }

    const categories = [...new Set(item.categories)];
    const primary = primaryCategory(categories);
    const n = (counters.get(primary) ?? 0) + 1;
    counters.set(primary, n);
    const fileName = `${primary}-${String(n).padStart(2, "0")}.webp`;

    try {
      const buffer = await download(candidate.imageUrl);
      const meta = await optimise(buffer, path.join(IMAGES_DIR, primary, fileName));
      const id = `ig-${candidate.key}`;
      const date = formatDate(candidate.timestamp);

      media.push({
        id,
        src: `/images/lequarttie/${primary}/${fileName}`,
        ...meta,
        alt: item.alt?.trim() || `${ALT_BY_CATEGORY[primary]}${date ? ` — publicado em ${date}` : ""}`,
        categories,
        featured: Boolean(item.featured),
        authorized,
        source: {
          platform: "instagram",
          shortCode: candidate.shortCode,
          postUrl: candidate.postUrl,
          timestamp: candidate.timestamp,
          caption: candidate.caption,
          carouselIndex: candidate.carouselIndex,
        },
      });

      const isFem = categories.includes("feminino");
      const isMasc = categories.includes("masculino");
      if ((categories.includes("look") || isFem || isMasc) && isFem !== isMasc) {
        const gender = isFem ? "feminino" : "masculino";
        lookCounters[gender] += 1;
        const number = String(lookCounters[gender]).padStart(2, "0");
        looks.push({
          id: `look-${candidate.key}`,
          name: item.lookName?.trim() || `Look ${isFem ? "Feminino" : "Masculino"} ${number}`,
          gender,
          isNew: categories.includes("novidades"),
          ...(item.brand ? { brand: item.brand } : {}),
          ...(item.description ? { description: item.description } : {}),
          mediaId: id,
          postUrl: candidate.postUrl,
          featured: Boolean(item.featured),
        });
      }

      report.imported.push(`${item.key} → ${primary}/${fileName}`);
      process.stdout.write(`  ✓ ${item.key} → ${primary}/${fileName}\n`);
    } catch (error) {
      report.failed.push({ key: item.key, reason: (error as Error).message });
      process.stdout.write(`  ✖ ${item.key}: ${(error as Error).message}\n`);
    }
  }

  await writeJson(paths.mediaGenerated, media);
  await writeJson(paths.looksGenerated, looks);
  await writeJson(paths.importReport, { authorized, importedAt: new Date().toISOString(), ...report });
  await importProfile();

  console.log(`\n✓ ${report.imported.length} imagens importadas · ${looks.length} looks no catálogo`);
  if (report.failed.length) {
    console.log(`⚠ ${report.failed.length} falharam (URLs do Instagram expiram — rode o scraping de novo se necessário).`);
  }
  console.log("Relatório: scripts/output/import-report.json");
}

main().catch((error) => {
  console.error("\n✖", error instanceof Error ? error.message : error);
  process.exit(1);
});
