import { EditorialImage } from "@/components/ui/EditorialImage";
import { Parallax } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { site } from "@/data/site";
import type { Visual } from "@/lib/types";

const PILLARS = [
  { title: "Ambiente", text: "Um espaço para ver, tocar e experimentar cada peça de perto." },
  { title: "Atendimento", text: "Atendimento personalizado, para ajudar você a compor o look certo." },
  { title: "Curadoria", text: "Marcas e peças selecionadas para diferentes estilos e ocasiões." },
  {
    title: "Experiência",
    text: `Moda feminina e masculina reunidas em um só endereço, na ${site.address.district}.`,
  },
];

export function Store({ visuals }: { visuals: Visual[] }) {
  const [wide, tall, small] = visuals;
  return (
    <section id="loja" className="bg-sand py-24 sm:py-32 lg:py-44">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="07" className="text-graphite/70">
              Nossa loja
            </SectionLabel>
            <SplitHeading
              lines={["Uma experiência", "*além da escolha.*"]}
              className="display mt-8 text-[clamp(2.8rem,7vw,6.8rem)]"
            />
          </div>
          <Reveal className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-sm leading-relaxed text-graphite">
              Na {site.address.street}, em {site.address.city}, a Lequarttiê recebe você para descobrir
              as novidades pessoalmente — com tempo, conversa e atenção a cada detalhe.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-24 lg:grid-cols-12 lg:gap-6">
          <Reveal variant="clip" className="relative col-span-2 aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-auto lg:h-[78svh]">
            <Parallax speed={5} className="absolute -inset-y-[6%] inset-x-0">
              <EditorialImage visual={wide} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full" />
            </Parallax>
          </Reveal>
          <div className="col-span-2 grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-5 lg:grid-cols-1 lg:gap-6">
            <Reveal variant="clip" delay={0.15} className="aspect-[3/4] lg:aspect-auto lg:h-[44svh]">
              <EditorialImage visual={tall} sizes="(min-width: 1024px) 40vw, 50vw" className="h-full w-full" />
            </Reveal>
            <Reveal variant="clip" delay={0.3} className="aspect-[3/4] lg:aspect-auto lg:h-[30svh]">
              <EditorialImage visual={small} sizes="(min-width: 1024px) 40vw, 50vw" className="h-full w-full" />
            </Reveal>
          </div>
        </div>

        <Reveal stagger={0.1} as="div" className="mt-16 grid gap-10 border-t border-ink/15 pt-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <div key={pillar.title}>
              <p className="eyebrow text-[0.5625rem] text-taupe tabular-nums">0{i + 1}</p>
              <h3 className="mt-4 font-serif text-3xl">{pillar.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-graphite">{pillar.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
