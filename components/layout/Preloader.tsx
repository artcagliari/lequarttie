"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { markIntroDone } from "@/lib/intro";

const SESSION_KEY = "lq-intro-seen";

/**
 * Abertura curta (≈1,6s) exibida uma vez por sessão. O conteúdo da
 * página já está renderizado por baixo, então não atrasa o LCP real.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage indisponível — exibe normalmente */
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skip = seen || reduceMotion;
    // Quem já viu a abertura nesta sessão: o CSS (data-intro="skip") já a escondeu antes do paint.
    const hide = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, skip ? 0 : 1650);
    // o hero começa a animar enquanto a cortina sobe
    const reveal = setTimeout(markIntroDone, skip ? 0 : 1950);
    return () => {
      clearTimeout(hide);
      clearTimeout(reveal);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          data-preloader
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink text-ivory"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            <div className="overflow-hidden">
              <motion.p
                className="font-serif text-3xl tracking-[0.32em] [margin-right:-0.32em] sm:text-5xl"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                LEQUARTTIÊ
              </motion.p>
            </div>
            <motion.span
              className="mt-6 block h-px w-40 origin-left bg-ivory/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.p
              className="eyebrow mt-5 text-[0.5625rem] text-ivory/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Magasin de Mode
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
