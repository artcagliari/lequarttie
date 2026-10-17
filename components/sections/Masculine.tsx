"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Visual } from "@/lib/types";

/**
 * Layout diferente do feminino: no desktop a seção fica fixa e as
 * fotografias deslizam na horizontal conforme o scroll. No celular
 * (ou com movimento reduzido) vira uma galeria com scroll-snap.
 */
export function Masculine({ visuals }: { visuals: Visual[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax-img]", track).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="masculino"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink py-24 text-ivory lg:flex lg:h-[100svh] lg:items-center lg:py-0"
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 sm:scroll-px-8 sm:gap-6 sm:px-8 lg:snap-none lg:gap-10 lg:overflow-visible lg:px-12 motion-reduce:lg:overflow-x-auto"
      >
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end pb-2 sm:w-[60vw] lg:w-[34vw] lg:pr-10">
          <SectionLabel index="03" className="text-taupe">
            Universo masculino
          </SectionLabel>
          <SplitHeading
            lines={["Masculino"]}
            className="display mt-8 text-[clamp(3.8rem,9vw,9rem)] leading-[0.85]"
          />
          <p className="mt-8 font-serif text-3xl text-ivory/90 italic sm:text-4xl">
            Elegância com personalidade.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/60">
            Do casual ao alfaiatado, uma seleção masculina que equilibra conforto, caimento e atitude.
          </p>
          <ButtonLink href="#colecoes" variant="outline-light" className="mt-10 self-start">
            Descobrir coleção masculina
          </ButtonLink>
        </div>

        {visuals.map((visual, i) => (
          <figure
            key={visual.id}
            className={`group relative w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-[26vw] ${
              i % 2 === 1 ? "lg:mt-24" : "lg:-mt-16"
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden lg:aspect-auto lg:h-[68svh]">
              {/* Parallax interno só para fotos — o placeholder tem moldura e não pode ser cortado */}
              <div
                data-parallax-img={visual.kind === "photo" ? "" : undefined}
                className={`absolute inset-y-0 ${visual.kind === "photo" ? "-inset-x-[10%]" : "inset-x-0"}`}
              >
                <EditorialImage
                  visual={visual.kind === "placeholder" ? { ...visual, tone: i % 2 ? "graphite" : "taupe" } : visual}
                  sizes="(min-width: 1024px) 30vw, 75vw"
                  showLabel={false}
                  className="h-full w-full"
                  imageClassName="transition-transform duration-[1.6s] ease-[var(--ease-editorial)] group-hover:scale-[1.05]"
                />
              </div>
            </div>
            <figcaption className="eyebrow mt-4 flex justify-between text-[0.5625rem] text-ivory/50">
              <span>Look {String(i + 1).padStart(2, "0")}</span>
              <span className="tabular-nums">
                {String(i + 1).padStart(2, "0")} / {String(visuals.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}

        <div aria-hidden className="w-1 shrink-0 lg:w-[6vw]" />
      </div>
    </section>
  );
}
