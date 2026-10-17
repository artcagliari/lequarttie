"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { fullAddress, navigation, site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const [overHero, setOverHero] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setOverHero(y < window.innerHeight * 0.85);
      setHidden(y > last && y > window.innerHeight * 0.6);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const light = overHero || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-700 ease-[var(--ease-editorial)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${
          light
            ? "border-b border-transparent bg-transparent text-ivory"
            : "border-b border-ink/10 bg-ivory/85 text-ink backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">
          <nav aria-label="Principal" className="hidden flex-1 lg:block">
            <ul className="flex gap-7">
              {navigation.slice(1, 5).map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="eyebrow link-underline pb-1 text-[0.625rem]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a href="#inicio" aria-label={`${site.name} — início`} className="text-[0.95rem] sm:text-base">
            <Wordmark />
          </a>

          <div className="flex flex-1 items-center justify-end gap-7">
            <ul className="hidden gap-7 lg:flex">
              {navigation.slice(5).map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="eyebrow link-underline pb-1 text-[0.625rem]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="group -mr-2 flex size-11 flex-col items-center justify-center gap-[7px] lg:hidden"
            >
              <span
                className={`h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-editorial)] ${open ? "translate-y-[4px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-editorial)] ${open ? "-translate-y-[4px] -rotate-45" : "group-hover:scale-x-75"}`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink text-ivory lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Menu móvel" className="flex flex-1 flex-col justify-center px-6 pt-20">
              <ul className="space-y-1">
                {navigation.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="display flex items-baseline gap-4 py-1.5 text-[2.6rem]"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%", transition: { duration: 0.3 } }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.05, ease: EASE }}
                    >
                      <span className="eyebrow text-[0.5625rem] text-taupe tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="space-y-4 border-t border-ivory/15 px-6 py-8 text-sm text-ivory/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p>{fullAddress}</p>
              <div className="flex gap-6">
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="eyebrow text-ivory">
                  WhatsApp
                </a>
                <a href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" className="eyebrow text-ivory">
                  Instagram
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
