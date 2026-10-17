import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "light" | "dark" | "outline-light" | "outline-dark";

const VARIANTS: Record<Variant, string> = {
  light: "bg-ivory text-ink before:bg-ink hover:text-ivory",
  dark: "bg-ink text-ivory before:bg-graphite hover:text-ivory",
  "outline-light": "border border-ivory/60 text-ivory before:bg-ivory hover:text-ink",
  "outline-dark": "border border-ink/30 text-ink before:bg-ink hover:text-ivory",
};

interface ButtonLinkProps extends ComponentProps<"a"> {
  variant?: Variant;
  icon?: ReactNode | false;
}

/** Link com aparência de botão e microinteração de preenchimento. */
export function ButtonLink({
  variant = "dark",
  icon,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const external = props.href?.startsWith("http");
  return (
    <a
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
      className={`group relative isolate inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-7 py-3.5 text-[0.6875rem] font-medium tracking-[0.24em] uppercase transition-colors duration-500 ease-[var(--ease-editorial)] before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-500 before:ease-[var(--ease-editorial)] hover:before:scale-y-100 focus-visible:before:scale-y-100 active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon !== false && (
        <span
          aria-hidden
          className="transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          {icon ?? <ArrowUpRight className="size-3.5" strokeWidth={1.5} />}
        </span>
      )}
    </a>
  );
}
