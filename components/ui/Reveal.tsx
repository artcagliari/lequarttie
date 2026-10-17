"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type RevealVariant = "fade-up" | "clip" | "fade";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  /** Anima os filhos diretos em sequência. */
  stagger?: number;
  as?: "div" | "figure" | "li" | "article";
}

/**
 * Revelação durante o scroll (GSAP ScrollTrigger).
 * Com prefers-reduced-motion, o conteúdo aparece sem animação.
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
  stagger,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = stagger ? Array.from(el.children) : el;
        const trigger = { trigger: el, start: "top 85%", once: true };

        if (variant === "clip") {
          const media = el.querySelector("img, [role='img']");
          const tl = gsap.timeline({ scrollTrigger: trigger, delay });
          tl.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
          );
          if (media) {
            tl.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
          }
          return;
        }

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: variant === "fade-up" ? 48 : 0 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            delay,
            stagger: stagger ?? 0,
            ease: "expo.out",
            scrollTrigger: trigger,
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
