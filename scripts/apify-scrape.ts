/**
 * Etapa 1 — Coleta no Instagram via Apify (apify/instagram-scraper).
 *
 *   npm run apify:scrape            # posts (100) + detalhes do perfil
 *   npm run apify:scrape -- --limit 60
 *
 * Valida o input schema atual do Actor antes de executar e salva o
 * resultado bruto em scripts/output/ (fora do frontend e do git).
 */
import { ApifyClient } from "apify-client";
import {
  ACTOR_ID,
  PROFILE_URL,
  paths,
  requireToken,
  writeJson,
  type ApifyPost,
  type ApifyProfileDetails,
} from "./shared";

type JsonSchemaProperty = { type?: string; enum?: string[]; editor?: string };
type InputSchema = { properties?: Record<string, JsonSchemaProperty>; required?: string[] };

const args = process.argv.slice(2);
const limitArg = args.indexOf("--limit");
const RESULTS_LIMIT = limitArg >= 0 ? Number(args[limitArg + 1]) : 100;

const client = new ApifyClient({ token: requireToken() });

async function loadInputSchema(): Promise<InputSchema | null> {
  const buildClient = await client.actor(ACTOR_ID).defaultBuild();
  const build = await buildClient.get();
  if (!build) return null;
  const fromDefinition = build.actorDefinition?.input as InputSchema | undefined;
  if (fromDefinition?.properties) return fromDefinition;
  return build.inputSchema ? (JSON.parse(build.inputSchema) as InputSchema) : null;
}

function validateInput(schema: InputSchema, input: Record<string, unknown>) {
  const props = schema.properties ?? {};
  const problems: string[] = [];

  for (const [key, value] of Object.entries(input)) {
    const prop = props[key];
    if (!prop) {
      problems.push(`campo "${key}" não existe no schema atual`);
      continue;
    }
    if (prop.enum && !prop.enum.includes(String(value))) {
      problems.push(`"${key}" = "${value}" fora dos valores aceitos: ${prop.enum.join(", ")}`);
    }
    const actual = Array.isArray(value) ? "array" : typeof value === "number" ? "integer" : typeof value;
    if (prop.type && prop.type !== actual && !(prop.type === "number" && actual === "integer")) {
      problems.push(`"${key}" deveria ser ${prop.type}, recebido ${actual}`);
    }
  }
  for (const key of schema.required ?? []) {
    if (!(key in input)) problems.push(`campo obrigatório "${key}" ausente`);
  }
  return problems;
}

async function runActor<T>(input: Record<string, unknown>, label: string): Promise<T[]> {
  console.log(`\n▶ Executando ${ACTOR_ID} (${label})…`);
  const run = await client.actor(ACTOR_ID).call(input, { waitSecs: 900 });
  console.log(`  run ${run.id} — status ${run.status}`);
  if (run.status !== "SUCCEEDED") {
    throw new Error(`A execução "${label}" terminou com status ${run.status}`);
  }
  const { items } = await client.dataset(run.defaultDatasetId).listItems({ clean: true });
  console.log(`  ${items.length} itens recebidos`);
  return items as T[];
}

async function main() {
  const postsInput = {
    directUrls: [PROFILE_URL],
    resultsType: "posts",
    resultsLimit: RESULTS_LIMIT,
    addParentData: false,
  };
  const detailsInput = {
    directUrls: [PROFILE_URL],
    resultsType: "details",
    resultsLimit: 1,
  };

  console.log("▶ Validando o input schema atual do Actor…");
  const schema = await loadInputSchema();
  if (!schema) {
    console.warn("  ⚠ Não foi possível ler o schema — prosseguindo com a configuração padrão.");
  } else {
    const resultTypes = schema.properties?.resultsType?.enum;
    if (resultTypes) console.log(`  resultsType aceitos: ${resultTypes.join(", ")}`);
    const problems = [...validateInput(schema, postsInput), ...validateInput(schema, detailsInput)];
    if (problems.length) {
      console.error("✖ O input não corresponde ao schema atual:\n  - " + problems.join("\n  - "));
      process.exit(1);
    }
    console.log("  ✓ Input compatível com o schema");
  }

  const posts = await runActor<ApifyPost>(postsInput, "posts");
  const details = await runActor<ApifyProfileDetails>(detailsInput, "details");

  const validPosts = posts.filter((p) => !p.error && p.shortCode);
  await writeJson(paths.posts, validPosts);
  await writeJson(paths.details, details[0] ?? null);
  await writeJson(paths.runMeta, {
    actor: ACTOR_ID,
    profile: PROFILE_URL,
    scrapedAt: new Date().toISOString(),
    postsInput,
    detailsInput,
    postsReceived: posts.length,
    postsValid: validPosts.length,
    errors: posts.filter((p) => p.error).map((p) => p.error),
  });

  console.log(`\n✓ ${validPosts.length} publicações salvas em scripts/output/posts.json`);
  console.log("✓ Detalhes do perfil salvos em scripts/output/details.json");
  console.log("\nPróximo passo: npm run apify:prepare");
}

main().catch((error) => {
  console.error("\n✖", error instanceof Error ? error.message : error);
  process.exit(1);
});
