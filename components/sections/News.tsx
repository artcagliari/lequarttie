import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { site } from "@/data/site";
import { placeholder, toVisual } from "@/lib/media";
import type { MediaItem } from "@/lib/types";

const CATEGORY_LABEL: Record<string, string> = {
  feminino: "Feminino",
  masculino: "Masculino",
  loja: "A Loja",
  campanha: "Campanha",
  detalhe: "Detalhe",
};

function excerpt(caption = "") {
  const clean = caption
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > 110 ? `${clean.slice(0, 110).trimEnd()}…` : clean;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });
}

/**
 * Publicações recentes do Instagram. Mostra a data e a legenda original
 * da postagem — nunca afirma que a peça está disponível.
 */
export function News({ items }: { items: MediaItem[] }) {
  const hasItems = items.length > 0;
  const cards = hasItems
    ? items.map((item) => ({
        id: item.id,
        visual: toVisual(item),
        category: CATEGORY_LABEL[item.categories.find((c) => c in CATEGORY_LABEL) ?? ""] ?? "Instagram",
        date: formatDate(item.source.timestamp),
        text: excerpt(item.source.caption),
        href: item.source.postUrl,
      }))
    : [0, 1, 2, 3].map((i) => ({
        id: `news-${i}`,
        visual: placeholder("novidades", i, (["taupe", "sand", "graphite", "ivory"] as const)[i]),
        category: "Instagram",
        date: "",
        text: "As publicações mais recentes da loja aparecem aqui automaticamente após a importação.",
        href: site.social.instagram.url,
      }));

  return (
    <section id="novidades" className="overflow-hidden bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="06" className="text-taupe">
              Novidades
            </SectionLabel>
            <SplitHeading lines={["Últimas *produções*"]} className="display mt-8 text-[clamp(2.8rem,7vw,6.5rem)]" />
          </div>
          <ButtonLink href={site.social.instagram.url} variant="outline-dark">
            Seguir {site.social.instagram.handle}
          </ButtonLink>
        </div>

        <Reveal
          stagger={0.1}
          className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-6"
        >
          {cards.map((card) => (
            <a
              key={card.id}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-[72vw] shrink-0 snap-start sm:w-auto"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <EditorialImage
                  visual={card.visual}
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 72vw"
                  className="h-full w-full"
                  imageClassName="transition-transform duration-[1.4s] ease-[var(--ease-editorial)] group-hover:scale-[1.05]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="eyebrow text-[0.5rem] text-taupe">
                  {card.category}
                  {card.date && ` · ${card.date}`}
                </p>
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.4}
                  aria-hidden
                />
              </div>
              {card.text && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-graphite">{card.text}</p>}
              <span className="sr-only"> — abrir publicação no Instagram</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
