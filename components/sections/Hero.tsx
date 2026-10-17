"use client";

import { Pause, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { SplitHeading } from "@/components/ui/SplitHeading";
import type { Visual } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";

export interface HeroCampaign {
  id: string;
  label: string;
  visual: Visual;
}

const SLIDE_SECONDS = 7;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ campaigns }: { campaigns: HeroCampaign[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Sem troca automática para quem prefere movimento reduzido
  const autoplay = !reduceMotion;
  const active = campaigns[index];

  const next = () => setIndex((i) => (i + 1) % campaigns.length);

  return (
    <section
      id="inicio"
      aria-roledescription="carrossel"
      aria-label="Campanhas Lequarttiê"
      className="relative isolate flex h-[100svh] min-h-[620px] flex-col justify-end overflow-hidden bg-ink text-ivory"
    >
      {/* Fotografias */}
      <AnimatePresence initial={false}>
        <motion.div
          key={active.id}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <EditorialImage
            visual={active.visual.kind === "placeholder" ? { ...active.visual, tone: "ink" } : active.visual}
            sizes="100vw"
            priority={index === 0}
            quality={85}
            minimal
            className="h-full w-full"
            imageClassName="animate-kenburns object-[50%_25%]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay editorial */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(23,23,23,0.55)_0%,rgba(23,23,23,0)_28%,rgba(23,23,23,0.05)_50%,rgba(23,23,23,0.78)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 h-4 overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active.id}
                  className="eyebrow text-[0.625rem] text-ivory/80"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {active.label}
                </motion.p>
              </AnimatePresence>
            </div>

            <SplitHeading
              as="h1"
              trigger="intro"
              lines={["Seu estilo.", "*Sua expressão.*"]}
              className="display text-[clamp(3.6rem,13.5vw,10.5rem)]"
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: reduceMotion ? 0 : 2.4, ease: EASE }}
            >
              <p className="mt-7 max-w-md text-[0.95rem] leading-relaxed text-ivory/80 sm:text-base">
                Uma curadoria de moda feminina e masculina para quem valoriza personalidade, qualidade
                e autenticidade.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#feminino" variant="light">
                  Explorar feminino
                </ButtonLink>
                <ButtonLink href="#masculino" variant="outline-light">
                  Explorar masculino
                </ButtonLink>
              </div>
            </motion.div>
          </div>

          {/* Controle das campanhas */}
          <motion.div
            className="flex items-end justify-between gap-6 lg:col-span-4 lg:flex-col lg:items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduceMotion ? 0 : 2.7 }}
          >
            <a href="#colecoes" className="eyebrow link-underline hidden pb-1 text-[0.625rem] lg:inline-block">
              Conheça a coleção
            </a>
            <div className="flex w-full items-center gap-5 sm:w-auto">
              <ol className="flex flex-1 gap-5 sm:flex-none">
                {campaigns.map((campaign, i) => (
                  <li key={campaign.id} className="flex-1 sm:w-36 sm:flex-none">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-current={i === index}
                      aria-label={`Ver campanha ${campaign.label}`}
                      className="group flex w-full flex-col gap-3 py-2 text-left"
                    >
                      <span className="eyebrow flex gap-3 text-[0.5625rem] text-ivory/60 transition-colors group-hover:text-ivory group-aria-[current=true]:text-ivory">
                        <span className="tabular-nums">0{i + 1}</span>
                        {campaign.id === "feminino" ? "Feminino" : "Masculino"}
                      </span>
                      <span className="relative block h-px w-full bg-ivory/25">
                        {i === index && (
                          <span
                            key={`${index}`}
                            onAnimationEnd={next}
                            className="absolute inset-y-0 left-0 block w-full origin-left bg-ivory"
                            style={
                              autoplay
                                ? {
                                    animation: `hero-progress ${SLIDE_SECONDS}s linear forwards`,
                                    animationPlayState: paused ? "paused" : "running",
                                  }
                                : undefined
                            }
                          />
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              {autoplay && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Retomar troca automática" : "Pausar troca automática"}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ivory/30 transition-colors hover:bg-ivory hover:text-ink"
              >
                {paused ? (
                  <Play className="size-3.5" strokeWidth={1.5} aria-hidden />
                ) : (
                  <Pause className="size-3.5" strokeWidth={1.5} aria-hidden />
                )}
              </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#sobre"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 pb-6 text-ivory/70 lg:flex"
      >
        <span className="eyebrow text-[0.5rem]">Role</span>
        <span className="relative block h-14 w-px overflow-hidden bg-ivory/20">
          <span className="animate-scroll-cue absolute inset-0 block bg-ivory" />
        </span>
      </a>
    </section>
  );
}
