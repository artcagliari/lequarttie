import { ButtonLink } from "@/components/ui/ButtonLink";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Visual } from "@/lib/types";

function Frame({
  visual,
  aspect,
  sizes,
  caption,
  delay = 0,
}: {
  visual: Visual;
  aspect: string;
  sizes: string;
  caption: string;
  delay?: number;
}) {
  return (
    <Reveal as="figure" variant="clip" delay={delay} className="group relative">
      <div className={`relative overflow-hidden ${aspect}`}>
        <EditorialImage
          visual={visual}
          sizes={sizes}
          showLabel={false}
          className="h-full w-full"
          imageClassName="transition-transform duration-[1.6s] ease-[var(--ease-editorial)] group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10" />
      </div>
      <figcaption className="eyebrow mt-3 flex items-center justify-between text-[0.5625rem] text-ink/60">
        <span>{caption}</span>
        <span
          aria-hidden
          className="h-px w-8 origin-right scale-x-0 bg-current transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-x-100"
        />
      </figcaption>
    </Reveal>
  );
}

export function Feminine({ visuals }: { visuals: Visual[] }) {
  const [a, b, c, d, e] = visuals;
  return (
    <section id="feminino" className="bg-ivory pb-24 sm:pb-32 lg:pb-44">
      <div className="mx-auto max-w-[1600px] px-5 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <div className="mb-14 grid items-end gap-8 lg:mb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="02" className="text-taupe">
              Universo feminino
            </SectionLabel>
            <SplitHeading
              lines={["Feminino"]}
              className="display mt-8 text-[clamp(4.2rem,14vw,12.5rem)] leading-[0.85]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9 lg:pb-6">
            <p className="font-serif text-3xl italic sm:text-4xl">Estilo em cada detalhe.</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-graphite">
              Peças que acompanham a sua rotina e os seus momentos especiais, com a delicadeza e a
              força de quem sabe o que quer vestir.
            </p>
            <ButtonLink href="#colecoes" variant="outline-dark" className="mt-8">
              Descobrir coleção feminina
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="col-span-2 lg:col-span-6">
            <Frame visual={a} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 48vw, 100vw" caption="Look 01" />
          </div>
          <div className="flex flex-col gap-3 sm:gap-5 lg:col-span-3 lg:gap-6 lg:pt-44">
            <Frame visual={b} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, 50vw" caption="Look 02" delay={0.1} />
            <Frame visual={d} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 24vw, 50vw" caption="Look 04" delay={0.1} />
          </div>
          <div className="flex flex-col gap-3 sm:gap-5 lg:col-span-3 lg:gap-6">
            <Frame visual={c} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 24vw, 50vw" caption="Look 03" delay={0.2} />
            <Frame visual={e} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, 50vw" caption="Look 05" delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
}
