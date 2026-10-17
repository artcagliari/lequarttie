import { MapPin, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { mapsLinks } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

const MARQUEE = ["Feminino", "Masculino", "Multimarcas", "Bento Gonçalves", "Curadoria"];

export function CallToAction() {
  return (
    <section aria-label="Encontre seu próximo look" className="grain relative overflow-hidden bg-ink py-28 text-ivory sm:py-36 lg:py-48">
      <div aria-hidden className="absolute inset-x-0 top-10 overflow-hidden opacity-[0.07] select-none">
        <div className="animate-marquee flex w-max gap-12 pr-12 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={i} className="display text-[clamp(4rem,10vw,9rem)] italic">
              {word} ·
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 text-center sm:px-8 lg:px-12">
        <p className="eyebrow text-[0.625rem] text-taupe">Encontre seu próximo look</p>
        <SplitHeading
          lines={["Seu próximo look", "está *esperando* por você."]}
          className="display mx-auto mt-10 max-w-5xl text-[clamp(2.8rem,7.5vw,7.5rem)]"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-[0.95rem] leading-relaxed text-ivory/70">
            Explore nossa seleção e descubra peças que combinam com seu estilo.
          </p>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={whatsappUrl()}
              variant="light"
              icon={<MessageCircle className="size-3.5" strokeWidth={1.5} />}
            >
              Falar com a loja
            </ButtonLink>
            <ButtonLink
              href={mapsLinks.directions}
              variant="outline-light"
              icon={<MapPin className="size-3.5" strokeWidth={1.5} />}
            >
              Como chegar
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
