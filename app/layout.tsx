import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/data/site";
import { clothingStoreJsonLd } from "@/lib/seo";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const title = `${site.name} — Moda feminina e masculina em ${site.address.city}`;
const description = `${site.fullName}: boutique multimarcas de moda feminina e masculina na ${site.address.street}, ${site.address.district}, ${site.address.city} – ${site.address.state}. Curadoria, looks para cada ocasião e atendimento personalizado.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description,
  applicationName: site.fullName,
  keywords: [
    "loja de roupas Bento Gonçalves",
    "moda feminina Bento Gonçalves",
    "moda masculina Bento Gonçalves",
    "boutique multimarcas",
    "Lequarttiê",
    "Cidade Alta Bento Gonçalves",
    "Serra Gaúcha moda",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.fullName,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: site.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  other: {
    "geo.region": "BR-RS",
    "geo.placename": site.address.city,
  },
};

export const viewport: Viewport = {
  themeColor: "#171717",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Esconde a abertura antes do primeiro paint para quem já a viu (ou prefere menos movimento).
const introScript = `try{if(sessionStorage.getItem("lq-intro-seen")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="skip"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(clothingStoreJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#conteudo"
          className="eyebrow fixed top-3 left-3 z-[110] -translate-y-20 bg-ink px-4 py-3 text-[0.625rem] text-ivory focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <SmoothScroll>
          <Preloader />
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <MobileContactBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
