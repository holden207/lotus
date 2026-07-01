import { Award, Gem, ShieldCheck, Users, type LucideIcon } from "lucide-react";

type Differential = { icon: LucideIcon; title: string; description: string };

const ITEMS: Differential[] = [
  {
    icon: ShieldCheck,
    title: "Segurança",
    description: "Transações seguras e processos transparentes.",
  },
  {
    icon: Users,
    title: "Atendimento Personalizado",
    description: "Entendemos suas necessidades e oferecemos as melhores soluções.",
  },
  {
    icon: Gem,
    title: "Imóveis Selecionados",
    description: "Imóveis de alto padrão e localizações estratégicas.",
  },
  {
    icon: Award,
    title: "Experiência e Credibilidade",
    description: "Anos de experiência no mercado imobiliário com excelência.",
  },
];

export function Differentials() {
  return (
    <section id="sobre" className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.24em] text-gold">
          POR QUE ESCOLHER A LÓTUS
        </p>
        <h2 className="font-display text-4xl text-foreground md:text-[2.75rem]">Nossos diferenciais</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-gold/25">
          {ITEMS.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="lg:px-8 first:lg:pl-0 last:lg:pr-0">
              <Icon className="h-9 w-9 text-gold" strokeWidth={1.25} />
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
