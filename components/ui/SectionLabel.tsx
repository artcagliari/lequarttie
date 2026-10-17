interface SectionLabelProps {
  index: string;
  children: string;
  className?: string;
}

/** Numeração editorial de seção: "03 — Feminino". */
export function SectionLabel({ index, children, className = "" }: SectionLabelProps) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${className}`}>
      <span className="tabular-nums">{index}</span>
      <span aria-hidden className="h-px w-10 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}
