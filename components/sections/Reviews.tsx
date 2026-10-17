import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Review } from "@/lib/types";

/** Depoimentos reais com link para a fonte. Oculta quando não há avaliações verificadas. */
export function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionLabel index="—" className="text-taupe">
          Avaliações
        </SectionLabel>
        <h2 id="avaliacoes-titulo" className="display mt-8 text-[clamp(2.6rem,6vw,5.5rem)]">
          Quem conhece, <em>recomenda.</em>
        </h2>
        <Reveal stagger={0.1} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure key={`${review.author}-${review.date}`} className="flex flex-col justify-between border border-ink/10 p-8">
              <blockquote className="font-serif text-2xl leading-snug">“{review.text}”</blockquote>
              <figcaption className="mt-8 flex items-end justify-between gap-4 text-sm">
                <span>
                  <span className="block font-medium">{review.author}</span>
                  {review.rating && (
                    <span className="text-graphite/70" aria-label={`${review.rating} de 5 estrelas`}>
                      {"★".repeat(review.rating)}
                    </span>
                  )}
                </span>
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex items-center gap-1 text-[0.5rem] text-taupe"
                >
                  {review.sourceName}
                  <ArrowUpRight className="size-3" aria-hidden />
                </a>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
