import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { phoneToTel, phoneToWhatsApp } from "@/lib/site-settings";
import { Facebook, Instagram, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

const NAV_LINKS = ["Início", "Imóveis", "Lançamentos", "Contato"];
const INFO_LINKS = ["Trabalhe Conosco", "Política de Privacidade", "Termos de Uso"];

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-gold">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-gold">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gold transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const { settings } = useSiteSettings();

  const contacts: { icon: LucideIcon; value: string; href?: string }[] = [
    { icon: Phone, value: settings.footerPhone, href: phoneToTel(settings.footerPhone) },
    { icon: Mail, value: settings.footerEmail, href: `mailto:${settings.footerEmail}` },
    { icon: MapPin, value: settings.footerAddress },
  ];

  const whatsAppUrl = phoneToWhatsApp(settings.consultantWhatsApp);

  return (
    <footer id="contato" className="bg-cream pb-8 pt-14 md:pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-sans text-base font-bold tracking-[0.14em] text-gold">
              LÓTUS IMÓVEIS
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Encontre oportunidades imobiliárias selecionadas com estratégia, segurança e excelência.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <SocialLink href={settings.instagramUrl} label="Instagram">
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </SocialLink>
              <SocialLink href={settings.facebookUrl} label="Facebook">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </SocialLink>
              <SocialLink href={whatsAppUrl} label="WhatsApp">
                <WhatsAppIcon className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>
          <Column title="NAVEGAÇÃO" items={NAV_LINKS} />
          <Column title="INFORMAÇÕES" items={INFO_LINKS} />
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-gold">CONTATO</h4>
            <ul className="space-y-3">
              {contacts.map(({ icon: Icon, value, href }) => (
                <li key={value} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                  {href ? (
                    <a href={href} className="transition-colors hover:text-gold">
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Lótus Imóveis. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
