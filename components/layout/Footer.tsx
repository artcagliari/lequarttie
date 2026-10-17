import { Wordmark } from "@/components/ui/Wordmark";
import { fullAddress, mapsLinks, navigation, site } from "@/data/site";
import { usesUnauthorizedMedia, hasRealMedia } from "@/lib/media";
import { whatsappUrl } from "@/lib/whatsapp";

// Ano fixo para manter a página 100% estática (atualizar anualmente).
const COPYRIGHT_YEAR = 2026;

export function Footer() {
  const demoNotice = !hasRealMedia() || usesUnauthorizedMedia();

  return (
    <footer className="bg-ink pb-28 text-ivory/70 lg:pb-0">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 sm:px-8 lg:px-12 lg:pt-28">
        <div className="grid gap-14 border-b border-ivory/10 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#inicio" aria-label={`${site.name} — voltar ao início`} className="text-ivory">
              <Wordmark className="items-start text-xl" />
            </a>
            <p className="mt-8 max-w-sm text-sm leading-relaxed">
              {site.segment} em {site.address.city}. Curadoria, atendimento personalizado e moda
              contemporânea.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-2">
            <p className="eyebrow mb-6 text-[0.625rem] text-taupe">Navegação</p>
            <ul className="space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline transition-colors hover:text-ivory">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="eyebrow mb-6 text-[0.625rem] text-taupe">Coleções</p>
            <ul className="space-y-3 text-sm">
              <li><a href="#feminino" className="link-underline hover:text-ivory">Feminino</a></li>
              <li><a href="#masculino" className="link-underline hover:text-ivory">Masculino</a></li>
              <li><a href="#colecoes" className="link-underline hover:text-ivory">Lookbook</a></li>
              <li><a href="#novidades" className="link-underline hover:text-ivory">Novidades</a></li>
            </ul>
          </div>

          <address className="text-sm not-italic md:col-span-3">
            <p className="eyebrow mb-6 text-[0.625rem] text-taupe">Contato</p>
            <ul className="space-y-3">
              <li>
                <a href={mapsLinks.directions} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ivory">
                  {fullAddress}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.e164}`} className="link-underline hover:text-ivory">
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ivory">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ivory">
                  Instagram {site.social.instagram.handle}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div
          aria-hidden
          className="display overflow-hidden py-10 text-center text-[clamp(3.5rem,15vw,15rem)] leading-none tracking-[0.06em] text-ivory/[0.06] select-none"
        >
          LEQUARTTIÊ
        </div>

        <div className="flex flex-col gap-3 border-t border-ivory/10 py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {site.fullName}. Todos os direitos reservados.
          </p>
          {demoNotice && (
            <p className="text-ivory/45">
              Proposta de site — demonstração. Imagens sujeitas à autorização da loja.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
