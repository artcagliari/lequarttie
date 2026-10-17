import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Brand } from "@/lib/types";

/** Faixa de marcas confirmadas. Não renderiza nada enquanto a lista estiver vazia. */
export function Brands({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;
  const loop = [...brands, ...brands];

  return (
    <section id="marcas" aria-labelledby="marcas-titulo" className="border-y border-ink/10 bg-ivory py-16 sm:py-20">
      <div className="mx-auto mb-10 max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionLabel index="—" className="text-taupe">
          Marcas selecionadas
        </SectionLabel>
        <h2 id="marcas-titulo" className="sr-only">
          Marcas selecionadas
        </h2>
      </div>
      <div className="overflow-hidden">
        <ul className="animate-marquee flex w-max items-center gap-16 pr-16 hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center">
          {loop.map((brand, i) => (
            <li key={`${brand.name}-${i}`} aria-hidden={i >= brands.length} className="shrink-0">
              {brand.logo ? (
                <Image src={brand.logo} alt={brand.name} width={140} height={48} className="h-10 w-auto opacity-70 grayscale" />
              ) : (
                <span className="display text-3xl text-ink/70 sm:text-4xl">{brand.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
