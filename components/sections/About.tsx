import { EditorialImage } from "@/components/ui/EditorialImage";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Visual } from "@/lib/types";

const PILLARS = ["Feminino & Masculino", "Multimarcas", "Atendimento personalizado"];

export function About({ main, detail }: { main: Visual; detail: Visual }) {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ivory py-24 sm:py-32 lg:py-44">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-5 lg:pt-16">
          <SectionLabel index="01" className="text-taupe">
            Conheça a Lequarttiê
          </SectionLabel>
          <SplitHeading
            lines={["Moda para", "*expressar*", "quem você é."]}
            className="display mt-10 text-[clamp(3rem,7vw,6.5rem)]"
          />
          <Reveal stagger={0.12} className="mt-12 max-w-md space-y-5 text-[0.95rem] leading-[1.8] text-graphite">
            <p>
              Na Lequarttiê, cada peça é escolhida com intenção. Reunimos marcas selecionadas de moda
              feminina e masculina em uma curadoria que valoriza caimento, qualidade e personalidade.
            </p>
            <p>
              O atendimento é próximo e sem pressa: ajudamos você a encontrar o look certo para cada
              ocasião — do dia a dia aos momentos especiais.
            </p>
          </Reveal>
          <Reveal stagger={0.08} delay={0.2} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-8">
            {PILLARS.map((pillar) => (
              <p key={pillar} className="eyebrow text-[0.5625rem] text-ink/70">
                {pillar}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <Reveal variant="clip" className="relative aspect-[4/5] overflow-hidden">
            <Parallax speed={6} className="absolute -inset-y-[8%] inset-x-0">
              <EditorialImage
                visual={main}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="h-full w-full"
              />
            </Parallax>
          </Reveal>
          <Parallax
            speed={-14}
            className="absolute -bottom-10 -left-4 w-[44%] sm:-left-10 lg:-bottom-20 lg:-left-24 lg:w-[42%]"
          >
            <Reveal variant="clip" delay={0.3} className="aspect-[3/4] border-[6px] border-ivory sm:border-[10px]">
              <EditorialImage visual={detail} sizes="(min-width: 1024px) 20vw, 45vw" className="h-full w-full" />
            </Reveal>
          </Parallax>
          <p
            aria-hidden
            className="display absolute top-8 -right-2 hidden origin-top-right translate-x-full -rotate-90 text-sm tracking-[0.4em] text-taupe lg:block"
          >
            MAGASIN DE MODE
          </p>
        </div>
      </div>
    </section>
  );
}
