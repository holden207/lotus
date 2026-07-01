import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const NAV = [
  { label: "INÍCIO", hash: "inicio" as const },
  { label: "IMÓVEIS", hash: "imoveis" as const },
  { label: "CONTATO", hash: "contato" as const },
];

function useActiveNavHash(): (typeof NAV)[number]["hash"] | null {
  const { pathname, hash } = useRouterState({ select: (state) => state.location });
  if (pathname !== "/") return null;
  if (hash === "imoveis" || hash === "contato") return hash;
  return "inicio";
}

export function Header() {
  const activeHash = useActiveNavHash();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:py-5">
        <Link
          to="/"
          hash="inicio"
          className="flex shrink-0 items-center justify-self-start"
          aria-label="Lótus Imóveis"
        >
          <img src={logo} alt="Lótus Imóveis" className="h-14 w-auto md:h-16" />
        </Link>

        <nav className="hidden items-center justify-center gap-7 lg:flex xl:gap-9">
          {NAV.map((item) => {
            const isActive = activeHash === item.hash;
            return (
              <Link
                key={item.label}
                to="/"
                hash={item.hash}
                className={`text-[11px] font-medium tracking-[0.2em] transition-colors hover:text-gold ${
                  isActive
                    ? "border-b border-gold pb-0.5 text-gold"
                    : "text-foreground/75"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/"
          hash="contato"
          className="inline-flex items-center justify-self-end gap-2 rounded-md border border-gold px-4 py-2.5 text-[11px] font-semibold tracking-[0.18em] text-foreground transition-colors hover:bg-gold-soft md:px-5"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 text-gold" />
          FALE CONOSCO
        </Link>
      </div>
    </header>
  );
}
