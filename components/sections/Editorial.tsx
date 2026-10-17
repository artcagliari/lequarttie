import { EditorialImage } from "@/components/ui/EditorialImage";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Visual } from "@/lib/types";

/** Composição de revista: fotografias verticais em velocidades diferentes sob tipografia grande. */
export function Editorial({ visuals }: { visuals: Visual[] }) {
  const [left, center, right] = visuals;
  return (
    <section id="editorial" className="relative overflow-hidden bg-sand py-24 sm:py-32 lg:py-48">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <SectionLabel index="05" className="text-graphite/70">
          Editorial Lequarttiê
        </SectionLabel>

        <div className="relative mt-14 lg:mt-20 lg:min-h-[115svh]">
          {/* Fotografias */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:block">
            <Parallax speed={8} className="lg:absolute lg:top-0 lg:left-0 lg:w-[27%]">
              <Reveal variant="clip" className="aspect-[3/4]">
                <EditorialImage visual={left} sizes="(min-width: 1024px) 27vw, 50vw" className="h-full w-full" />
              </Reveal>
            </Parallax>
            <Parallax speed={-6} className="mt-16 lg:absolute lg:top-[24%] lg:left-[36%] lg:mt-0 lg:w-[30%]">
              <Reveal variant="clip" delay={0.15} className="aspect-[2/3]">
                <EditorialImage visual={center} sizes="(min-width: 1024px) 30vw, 50vw" className="h-full w-full" />
              </Reveal>
            </Parallax>
            <Parallax speed={14} className="col-span-2 mx-auto w-2/3 lg:absolute lg:top-[8%] lg:right-0 lg:mx-0 lg:w-[24%]">
              <Reveal variant="clip" delay={0.3} className="aspect-[3/4]">
                <EditorialImage visual={right} sizes="(min-width: 1024px) 24vw, 66vw" className="h-full w-full" />
              </Reveal>
            </Parallax>
          </div>

          {/* Tipografia sobreposta */}
          <div className="pointer-events-none relative mt-14 lg:absolute lg:inset-x-0 lg:top-[38%] lg:mt-0">
            <SplitHeading
              lines={["Mais do que vestir.", "*Expressar.*"]}
              className="display text-center text-[clamp(3.2rem,10.5vw,11rem)] text-ink lg:text-ivory lg:mix-blend-difference"
            />
          </div>

          <Reveal className="relative mt-12 max-w-xs lg:absolute lg:bottom-0 lg:left-[8%] lg:mt-0">
            <p className="text-sm leading-relaxed text-graphite">
              Cada produção é um convite para descobrir novas combinações — e uma forma de mostrar,
              sem dizer nada, quem você é.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
