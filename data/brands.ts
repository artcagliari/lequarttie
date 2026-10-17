import type { Brand } from "@/lib/types";

/**
 * Marcas comercializadas pela Lequarttiê.
 *
 * Nenhuma marca foi confirmada em fontes públicas até agora — a seção
 * "Marcas selecionadas" fica oculta enquanto esta lista estiver vazia.
 * Após rodar o scraping, consulte `scripts/output/brand-signals.json`
 * (menções e marcações nas legendas) e confirme com a loja antes de
 * adicionar qualquer nome aqui.
 */
export const brands: Brand[] = [];
