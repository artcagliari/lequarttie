"use client";

import { useRef, type ElementType } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

interface SplitHeadingProps {
  /** Cada item é uma linha; trechos entre *asteriscos* ficam em itálico. */
  lines: string[];
  as?: ElementType;
  className?: string;
  /** "scroll" anima ao entrar na tela; "intro" anima ao fim da abertura. */
  trigger?: "scroll" | "intro";
  delay?: number;
}

function renderWords(line: string) {
  return line.split(/(\*[^*]+\*)/).flatMap((chunk, ci) => {
    const italic = chunk.startsWith("*") && chunk.endsWith("*");
    const text = italic ? chunk.slice(1, -1) : chunk;
    return text
      .split(" ")
      .filter(Boolean)
      .map((word, wi) => (
        <span key={`${ci}-${wi}`} className="-mt-[0.12em] -mb-[0.18em] inline-block overflow-hidden pt-[0.12em] pb-[0.18em] align-bottom">
          <span data-word className={`inline-block will-change-transform ${italic ? "italic" : ""}`}>
            {word}
          </span>
          {" "}
        </span>
      ));
  });
}

/** Título com revelação palavra por palavra (máscara + translate). */
export function SplitHeading({
  lines,
  as: Tag = "h2",
  className = "",
  trigger = "scroll",
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const label = lines.join(" ").replaceAll("*", "");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = ref.current?.querySelectorAll("[data-word]");
        if (!words?.length) return;
        const tween = gsap.fromTo(
          words,
          { yPercent: 115, rotate: 3 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.3,
            delay,
            ease: "expo.out",
            stagger: 0.06,
            paused: trigger === "intro",
            scrollTrigger:
              trigger === "scroll" ? { trigger: ref.current, start: "top 88%", once: true } : undefined,
          },
        );
        if (trigger === "intro") return onIntroDone(() => tween.play());
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={label}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block">
          {renderWords(line)}
        </span>
      ))}
    </Tag>
  );
}
