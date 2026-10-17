import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { fullAddress, mapsLinks, site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** "09:00" → "9h", "18:30" → "18h30" */
const formatHour = (time: string) => time.replace(/^0/, "").replace(":00", "h").replace(":", "h");

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1.75rem_1fr] gap-4 border-t border-ink/10 py-6">
      <span aria-hidden className="pt-0.5 text-taupe">
        {icon}
      </span>
      <div>
        <p className="eyebrow mb-2 text-[0.5625rem] text-taupe">{label}</p>
        <div className="text-[0.95rem] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function Location() {
  const iconProps = { className: "size-4", strokeWidth: 1.3 } as const;
  return (
    <section id="contato" className="bg-ivory py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-5">
          <SectionLabel index="08" className="text-taupe">
            Localização
          </SectionLabel>
          <SplitHeading
            lines={["Visite a", "*Lequarttiê*"]}
            className="display mt-8 text-[clamp(2.8rem,6.5vw,6rem)]"
          />

          <Reveal stagger={0.08} className="mt-12">
            <InfoRow icon={<MapPin {...iconProps} />} label="Endereço">
              <address className="not-italic">
                {site.address.street} – {site.address.district}
                <br />
                {site.address.city} – {site.address.state}, {site.address.postalCode}
              </address>
            </InfoRow>
            <InfoRow icon={<Clock {...iconProps} />} label="Horário">
              <ul>
                {site.hours.map((h) => (
                  <li key={h.label} className="flex justify-between gap-6 sm:max-w-xs">
                    <span>{h.label}</span>
                    <span className="tabular-nums">
                      {formatHour(h.opens)} às {formatHour(h.closes)}
                    </span>
                  </li>
                ))}
                <li className="text-graphite/60">{site.closedLabel}</li>
              </ul>
            </InfoRow>
            <InfoRow icon={<Phone {...iconProps} />} label="Telefone & WhatsApp">
              <a href={`tel:${site.phone.e164}`} className="link-underline">
                {site.phone.display}
              </a>
            </InfoRow>
            <InfoRow icon={<ArrowUpRight {...iconProps} />} label="Instagram">
              <a href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                {site.social.instagram.handle}
              </a>
            </InfoRow>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={mapsLinks.directions} variant="dark" icon={<MapPin className="size-3.5" strokeWidth={1.5} />}>
              Traçar rota
            </ButtonLink>
            <ButtonLink
              href={whatsappUrl()}
              variant="outline-dark"
              icon={<MessageCircle className="size-3.5" strokeWidth={1.5} />}
            >
              WhatsApp
            </ButtonLink>
          </div>
        </div>

        <Reveal variant="clip" className="relative min-h-[420px] overflow-hidden bg-sand lg:col-span-7 lg:min-h-0">
          <iframe
            title={`Mapa — ${fullAddress}`}
            src={mapsLinks.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.9] contrast-[1.05] transition-[filter] duration-700 hover:grayscale-0"
          />
        </Reveal>
      </div>
    </section>
  );
}
