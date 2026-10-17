import Image from "next/image";
import type { PlaceholderTone, Visual } from "@/lib/types";

const TONE_STYLES: Record<PlaceholderTone, { bg: string; fg: string; line: string }> = {
  ivory: { bg: "bg-[#efe9df]", fg: "text-ink/45", line: "border-ink/10" },
  sand: { bg: "bg-sand", fg: "text-ink/45", line: "border-ink/10" },
  taupe: { bg: "bg-taupe", fg: "text-ivory/80", line: "border-ivory/25" },
  graphite: { bg: "bg-graphite", fg: "text-ivory/55", line: "border-ivory/15" },
  ink: { bg: "bg-[#1c1b1a]", fg: "text-ivory/45", line: "border-ivory/10" },
};

interface EditorialImageProps {
  visual: Visual;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Imagem acima da dobra (LCP). */
  priority?: boolean;
  quality?: 60 | 75 | 85;
  /** Placeholder sem moldura/rótulos (ex.: hero em tela cheia). */
  minimal?: boolean;
  /** Exibe o rótulo de categoria no placeholder (desligue quando houver legenda própria). */
  showLabel?: boolean;
}

/**
 * Fotografia com `next/image` (fill) ou, enquanto não houver imagem
 * autorizada, um espaço reservado editorial no mesmo enquadramento.
 * O elemento pai define a proporção (aspect-ratio ou altura).
 */
export function EditorialImage({
  visual,
  sizes,
  className = "",
  imageClassName = "",
  priority = false,
  quality = 75,
  minimal = false,
  showLabel = true,
}: EditorialImageProps) {
  if (visual.kind === "photo") {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          placeholder={visual.blurDataURL ? "blur" : "empty"}
          blurDataURL={visual.blurDataURL}
          className={`object-cover ${imageClassName}`}
        />
      </div>
    );
  }

  const tone = TONE_STYLES[visual.tone];
  return (
    <div
      role="img"
      aria-label={visual.alt}
      className={`grain relative overflow-hidden ${tone.bg} ${tone.fg} ${className}`}
    >
      <div
        className={`absolute inset-0 ${imageClassName}`}
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 28% 12%, rgba(255,255,255,0.32), transparent 55%), radial-gradient(90% 70% at 85% 100%, rgba(0,0,0,0.18), transparent 60%)",
        }}
      >
        {!minimal && (
          <span
            aria-hidden
            className="display absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(6rem,22vw,16rem)] italic opacity-25 select-none"
          >
            L
          </span>
        )}
      </div>
      {!minimal && (
        <>
          <div aria-hidden className={`absolute inset-3 border ${tone.line} sm:inset-4`} />
          {showLabel && (
            <span aria-hidden className="eyebrow absolute bottom-6 left-6 text-[0.625rem] sm:bottom-7 sm:left-7">
              {visual.label}
            </span>
          )}
          <span
            aria-hidden
            className="eyebrow absolute top-6 right-6 hidden text-[0.5625rem] sm:block tracking-[0.24em] opacity-80 sm:top-7 sm:right-7"
          >
            Foto em breve
          </span>
        </>
      )}
    </div>
  );
}
