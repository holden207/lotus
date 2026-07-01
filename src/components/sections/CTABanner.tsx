import bannerBg from "@/assets/low.png";
import otherLogo from "@/assets/other-logo.png";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function CTABanner() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bannerBg})` }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-14">
        <div className="max-w-md">
          <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
            Vamos encontrar o imóvel perfeito para você.
          </h2>
          <a
            href="#contato"
            className="mt-6 inline-flex items-center gap-3 rounded-md border border-gold bg-cream/70 px-6 py-3 text-xs font-semibold tracking-[0.15em] text-foreground transition-colors hover:bg-cream"
          >
            FALE COM UM ESPECIALISTA
            <WhatsAppIcon className="h-4 w-4 text-gold" />
          </a>
        </div>
        <div className="flex items-center justify-center md:justify-center lg:pl-8">
          <img
            src={otherLogo}
            alt="Lótus Imóveis"
            className="h-20 w-auto md:h-24 lg:h-28"
          />
        </div>
      </div>
    </section>
  );
}
