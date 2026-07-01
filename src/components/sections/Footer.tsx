import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Facebook, Instagram, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

const NAV_LINKS = ["Início", "Imóveis", "Lançamentos", "Sobre Nós", "Contato"];
const INFO_LINKS = ["Quem Somos", "Trabalhe Conosco", "Política de Privacidade", "Termos de Uso"];

type Contact = { icon: LucideIcon; value: string };
const CONTACTS: Contact[] = [
  { icon: Phone, value: "(11) 99999-9999" },
  { icon: Mail, value: "contato@lotusimoveis.com.br" },
  { icon: MapPin, value: "Av. Paulista, 1000 - São Paulo, SP" },
];

const SOCIAL = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

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

export function Footer() {
  return (
    <footer id="contato" className="bg-cream pb-8 pt-14 md:pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-sans text-base font-bold tracking-[0.14em] text-gold">
              LÓTUS IMÓVEIS
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Realizando sonhos e construindo histórias com confiança, qualidade e excelência.
            </p>
            <div className="mt-5 flex items-center gap-4">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-gold transition-opacity hover:opacity-70"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              ))}
              <a
                href="#"
                aria-label="WhatsApp"
                className="text-gold transition-opacity hover:opacity-70"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <Column title="NAVEGAÇÃO" items={NAV_LINKS} />
          <Column title="INFORMAÇÕES" items={INFO_LINKS} />
          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[0.22em] text-gold">CONTATO</h4>
            <ul className="space-y-3">
              {CONTACTS.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                  <span>{value}</span>
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
