import { site } from "@/data/site";

export const DEFAULT_MESSAGE =
  "Olá! Vim pelo site da Lequarttiê e gostaria de mais informações.";

export function whatsappUrl(message: string = DEFAULT_MESSAGE) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function lookInquiryMessage(lookName: string, postUrl?: string) {
  const reference = postUrl ? `${lookName} (${postUrl})` : lookName;
  return `Olá! Vi este look no site da Lequarttiê e gostaria de consultar disponibilidade, tamanhos e valores: ${reference}.`;
}
