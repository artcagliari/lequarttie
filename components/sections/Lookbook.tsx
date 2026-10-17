"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useCallback, useMemo, useState, type PointerEvent } from "react";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Lightbox } from "@/components/ui/Lightbox";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { CatalogLook } from "@/lib/types";
import { lookInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Filter = "todos" | "feminino" | "masculino" | "novidades";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "feminino", label: "Feminino" },
  { id: "masculino", label: "Masculino" },
  { id: "novidades", label: "Novidades" },
];

const AVAILABILITY_LABEL = {
  disponivel: "Disponível",
  "sob-consulta": "Sob consulta",
  indisponivel: "Indisponível",
} as const;

function LookCard({
  look,
  number,
  onOpen,
}: {
  look: CatalogLook;
  number: number;
  onOpen: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  // Inclinação 3D sutil apenas com mouse/trackpad
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 7);
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 7);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <article className="group">
      <div className="[perspective:1200px]">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onPointerMove={onPointerMove}
          onPointerLeave={reset}
          className="relative"
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Ampliar ${look.name}`}
            className="relative block aspect-[3/4] w-full overflow-hidden"
          >
            <EditorialImage
              visual={look.visual}
              sizes="(min-width: 1280px) 24vw, (min-width: 768px) 32vw, 50vw"
              showLabel={false}
              className="h-full w-full"
              imageClassName="transition-transform duration-[1.4s] ease-[var(--ease-editorial)] group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
            <span className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-100 transition-all duration-500 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
              <Plus className="size-4" strokeWidth={1.3} aria-hidden />
            </span>
            {look.isNew && (
              <span className="eyebrow absolute top-3 left-3 bg-ivory px-2.5 py-1.5 text-[0.5rem] text-ink">
                Novidade
              </span>
            )}
          </button>
        </motion.div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-[0.5rem] text-taupe tabular-nums">
            N° {String(number).padStart(2, "0")} · {look.gender === "feminino" ? "Feminino" : "Masculino"}
          </p>
          <h3 className="mt-1.5 truncate font-serif text-xl sm:text-2xl">{look.name}</h3>
          {(look.brand || look.availability) && (
            <p className="mt-1 text-xs text-graphite/70">
              {look.brand}
              {look.brand && look.availability ? " · " : ""}
              {look.availability ? AVAILABILITY_LABEL[look.availability] : ""}
            </p>
          )}
          {look.description && <p className="mt-2 line-clamp-2 text-xs text-graphite/80">{look.description}</p>}
        </div>
      </div>
      <a
        href={whatsappUrl(lookInquiryMessage(look.name, look.postUrl))}
        target="_blank"
        rel="noopener noreferrer"
        className="eyebrow mt-4 inline-flex min-h-11 items-center gap-2 border-b border-ink/25 text-[0.5625rem] transition-colors hover:border-ink"
      >
        Consultar disponibilidade
        <ArrowUpRight className="size-3" strokeWidth={1.5} aria-hidden />
      </a>
    </article>
  );
}

export function Lookbook({ looks }: { looks: CatalogLook[] }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = useMemo(
    () => FILTERS.filter((f) => f.id !== "novidades" || looks.some((l) => l.isNew)),
    [looks],
  );

  const visible = useMemo(() => {
    const filtered = looks.filter((look) => {
      if (filter === "todos") return true;
      if (filter === "novidades") return look.isNew;
      return look.gender === filter;
    });
    return [...filtered].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [looks, filter]);

  const close = useCallback(() => setLightboxIndex(null), []);

  return (
    <section id="colecoes" className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 border-b border-ink/10 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="04" className="text-taupe">
              Lookbook
            </SectionLabel>
            <SplitHeading
              lines={["Coleções &", "*looks* selecionados"]}
              className="display mt-8 text-[clamp(3rem,8vw,7.5rem)]"
            />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-sm leading-relaxed text-graphite">
              Um catálogo editorial com produções da loja. Gostou de um look? Consulte disponibilidade,
              tamanhos e valores diretamente com a equipe.
            </p>
          </Reveal>
        </div>

        <div
          role="group"
          aria-label="Filtrar looks"
          className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0"
        >
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`eyebrow relative min-h-11 shrink-0 px-5 text-[0.5625rem] transition-colors duration-500 ${
                  active ? "text-ivory" : "text-ink/60 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="lookbook-filter"
                    className="absolute inset-0 -z-0 bg-ink"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((look, i) => (
              <motion.div
                key={look.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: Math.min(i, 8) * 0.04 }}
                className={i % 4 === 1 ? "md:mt-16" : i % 4 === 3 ? "xl:mt-16" : ""}
              >
                <LookCard look={look} number={i + 1} onOpen={() => setLightboxIndex(i)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && (
          <p className="mt-12 text-sm text-graphite">Nenhum look nesta categoria no momento.</p>
        )}
      </div>

      <Lightbox looks={visible} index={lightboxIndex} onClose={close} onNavigate={setLightboxIndex} />
    </section>
  );
}
