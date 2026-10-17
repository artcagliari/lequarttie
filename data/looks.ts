import type { Look } from "@/lib/types";

/**
 * Ajustes manuais do catálogo.
 *
 * Os looks base são gerados em `looks.generated.json` pelo script
 * `npm run images:import`. Use este objeto para sobrescrever campos
 * (nome, marca, descrição, destaque, disponibilidade) pelo `id` — sem
 * editar o arquivo gerado, que é recriado a cada importação.
 *
 * Preencha somente com informações confirmadas pela loja.
 */
export const lookOverrides: Record<string, Partial<Look>> = {
  // "look-feminino-01": { name: "Vestido midi em linho", brand: "…", featured: true },
};

/** Looks cadastrados manualmente (por exemplo, fotos enviadas pela loja). */
export const manualLooks: Look[] = [];
