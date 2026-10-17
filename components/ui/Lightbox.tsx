"use client";

import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { EditorialImage } from "@/components/ui/EditorialImage";
import type { CatalogLook } from "@/lib/types";
import { lookInquiryMessage, whatsappUrl } from "@/lib/whatsapp";

interface LightboxProps {
  looks: CatalogLook[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ looks, index, onClose, onNavigate }: LightboxProps) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const look = open ? looks[index] : null;

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % looks.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + looks.length) % looks.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, looks.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {look && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={look.name}
          className="fixed inset-0 z-[60] flex flex-col bg-ink/[0.97] text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:h-20 sm:px-8">
            <p className="eyebrow text-[0.5625rem] text-ivory/60 tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="-mr-2 flex size-11 items-center justify-center transition-transform hover:rotate-90"
            >
              <X className="size-5" strokeWidth={1.2} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={look.id}
                className="relative h-full max-h-[78svh] w-full max-w-[min(100%,62svh)]"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {look.visual.kind === "photo" ? (
                  <Image
                    src={look.visual.src}
                    alt={look.visual.alt}
                    fill
                    sizes="(min-width: 640px) 62vh, 90vw"
                    quality={85}
                    placeholder={look.visual.blurDataURL ? "blur" : "empty"}
                    blurDataURL={look.visual.blurDataURL}
                    className="object-contain"
                  />
                ) : (
                  <EditorialImage visual={look.visual} sizes="60vh" showLabel={false} className="h-full w-full" />
                )}
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => onNavigate((index - 1 + looks.length) % looks.length)}
              aria-label="Look anterior"
              className="absolute left-2 flex size-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:bg-ivory hover:text-ink sm:left-8"
            >
              <ArrowLeft className="size-4" strokeWidth={1.3} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % looks.length)}
              aria-label="Próximo look"
              className="absolute right-2 flex size-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:bg-ivory hover:text-ink sm:right-8"
            >
              <ArrowRight className="size-4" strokeWidth={1.3} />
            </button>
          </div>

          <div className="flex shrink-0 flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="font-serif text-2xl">{look.name}</p>
              <p className="eyebrow mt-1 text-[0.5625rem] text-ivory/50">
                {look.gender === "feminino" ? "Feminino" : "Masculino"}
                {look.brand ? ` · ${look.brand}` : ""}
              </p>
            </div>
            <a
              href={whatsappUrl(lookInquiryMessage(look.name, look.postUrl))}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow inline-flex min-h-12 items-center justify-center bg-ivory px-7 text-[0.625rem] text-ink transition-colors hover:bg-sand"
            >
              Consultar disponibilidade
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
