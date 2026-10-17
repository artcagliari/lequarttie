"use client";

import { MapPin, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { mapsLinks } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Barra de contato fixa no celular, exibida após o hero. */
export function MobileContactBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden"
          initial={{ y: "140%" }}
          animate={{ y: 0 }}
          exit={{ y: "140%" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-2 overflow-hidden bg-ink/95 text-ivory shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow flex min-h-14 items-center justify-center gap-2.5 text-[0.625rem] active:bg-graphite"
            >
              <MessageCircle className="size-4" strokeWidth={1.4} aria-hidden />
              Falar com a loja
            </a>
            <a
              href={mapsLinks.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow flex min-h-14 items-center justify-center gap-2.5 border-l border-ivory/15 text-[0.625rem] active:bg-graphite"
            >
              <MapPin className="size-4" strokeWidth={1.4} aria-hidden />
              Como chegar
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
