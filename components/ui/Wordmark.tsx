interface WordmarkProps {
  className?: string;
  showTagline?: boolean;
}

/**
 * Logotipo tipográfico provisório. Substituir pelo arquivo oficial
 * (ex.: /public/brand/logo.svg) quando a loja enviar o logotipo.
 */
export function Wordmark({ className = "", showTagline = true }: WordmarkProps) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif text-[1.35em] font-normal tracking-[0.28em] [margin-right:-0.28em]">
        LEQUARTTIÊ
      </span>
      {showTagline && (
        <span className="mt-[0.55em] text-[0.42em] font-medium tracking-[0.5em] uppercase opacity-70 [margin-right:-0.5em]">
          Magasin de Mode
        </span>
      )}
    </span>
  );
}
