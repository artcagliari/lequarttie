"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { MotionConfig } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update);
  return null;
}

/**
 * Smooth scrolling com Lenis, sincronizado ao ticker do GSAP para que
 * ScrollTrigger e parallax fiquem em fase. Sem suavização com reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  // A árvore é a mesma nos dois modos (evita remontar a página): com
  // movimento reduzido, o Lenis apenas deixa de suavizar a rolagem.
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        ref={lenisRef}
        options={{
          autoRaf: false,
          lerp: 0.09,
          smoothWheel: !reduceMotion,
          anchors: reduceMotion ? { immediate: true } : { offset: 0 },
          wheelMultiplier: 0.95,
        }}
      >
        <ScrollTriggerSync />
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
