/**
 * Dados institucionais da Lequarttiê.
 *
 * Cada campo traz a fonte onde foi verificado. Antes de publicar,
 * confirme tudo diretamente com a loja — principalmente horários.
 */

export const site = {
  name: "LEQUARTTIÊ",
  fullName: "Lequarttiê Magasin de Mode",
  tagline: "Magasin de Mode",
  // Bio do Instagram: "Feminino e masculino · MULTIMARCAS"
  segment: "Boutique multimarcas de moda feminina e masculina",
  description:
    "Uma curadoria de moda feminina e masculina para quem valoriza personalidade, qualidade e autenticidade.",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lequarttie.vercel.app",
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",

  // Fontes: O Vermelhinho, Waze (Google Places)
  address: {
    street: "Rua Xingu, 7",
    district: "Cidade Alta",
    city: "Bento Gonçalves",
    state: "RS",
    postalCode: "95700-000",
    country: "BR",
  },

  // Fonte: O Vermelhinho; o link da bio do Instagram (wa.link/sz1lgj)
  // redireciona para o WhatsApp deste mesmo número.
  phone: {
    display: "(54) 3702-1110",
    e164: "+555437021110",
  },
  whatsapp: "555437021110",

  // Fonte: bio do Instagram e Waze
  hours: [
    {
      label: "Segunda a sexta",
      opens: "09:00",
      closes: "18:30",
      schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    {
      label: "Sábado",
      opens: "09:00",
      closes: "17:00",
      schemaDays: ["Saturday"],
    },
  ],
  closedLabel: "Domingo · fechado",

  social: {
    instagram: {
      handle: "@lequarttie.mm",
      url: "https://www.instagram.com/lequarttie.mm/",
    },
    facebook: "https://www.facebook.com/lequarttie/",
  },
} as const;

export const fullAddress = `${site.address.street} – ${site.address.district}, ${site.address.city} – ${site.address.state}`;

const mapsQuery = encodeURIComponent(
  `Lequarttiê, ${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}`,
);

export const mapsLinks = {
  embed: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`,
} as const;

export const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Feminino", href: "#feminino" },
  { label: "Masculino", href: "#masculino" },
  { label: "Coleções", href: "#colecoes" },
  { label: "Sobre", href: "#sobre" },
  { label: "A Loja", href: "#loja" },
  { label: "Contato", href: "#contato" },
] as const;
