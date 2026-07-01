import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  ChevronRight,
  Heart,
  Images,
  Mail,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LazyPropertyMap } from "@/components/LazyPropertyMap";
import type { Property } from "@/lib/properties";
import { submitInquiry } from "@/lib/properties";
import { PropertyFeaturesGrid } from "@/components/PropertyFeaturesGrid";
import { toast } from "sonner";

function PropertyGallery({ property }: { property: Property }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = property.gallery;

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg">
        {property.badge && (
          <span className="absolute left-4 top-4 z-10 rounded bg-gold px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-primary-foreground">
            {property.badge}
          </span>
        )}
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
            aria-label="Compartilhar"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background"
            aria-label="Favoritar"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <img
          src={images[activeIndex]}
          alt={`${property.title} — foto ${activeIndex + 1}`}
          fetchPriority="high"
          decoding="async"
          className="aspect-[16/9] w-full object-cover md:aspect-[2/1]"
        />
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
          aria-label="Próxima foto"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-background/95 px-4 py-2 text-xs font-medium text-foreground shadow-md transition-colors hover:bg-background"
        >
          <Images className="h-4 w-4 text-gold" />
          Ver todas as fotos
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`overflow-hidden rounded-md border-2 transition-colors ${
              i === activeIndex ? "border-gold" : "border-transparent opacity-80 hover:opacity-100"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactSidebar({ property }: { property: Property }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      const result = await submitInquiry({
        propertySlug: property.slug,
        name: String(data.get("nome") ?? ""),
        phone: String(data.get("telefone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("mensagem") ?? "") || undefined,
      });
      toast.success(result.message);
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível enviar a mensagem.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <aside className="space-y-6">
      <div className="rounded-lg border border-border/70 bg-card p-6 shadow-sm">
        <h3 className="font-display text-lg text-foreground">Tenho interesse neste imóvel</h3>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <Input id="nome" name="nome" placeholder="Seu nome" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <div className="relative">
              <Input
                id="telefone"
                name="telefone"
                placeholder="(11) 99999-9999"
                className="pr-10"
                required
              />
              <MessageCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem (opcional)</Label>
            <Textarea
              id="mensagem"
              name="mensagem"
              placeholder={`Olá, tenho interesse no imóvel ${property.title}.`}
              rows={3}
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-primary-foreground hover:bg-gold-dark"
          >
            {submitting ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      </div>

      <div className="rounded-lg border border-border/70 bg-card p-6 shadow-sm">
        <h3 className="font-display text-lg text-foreground">Fale com um consultor</h3>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <a
            href="tel:+551140028922"
            className="flex items-center gap-3 transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4 shrink-0 text-gold" />
            (11) 4002-8922
          </a>
          <a
            href="mailto:contato@lotusimoveis.com.br"
            className="flex items-center gap-3 transition-colors hover:text-gold"
          >
            <Mail className="h-4 w-4 shrink-0 text-gold" />
            contato@lotusimoveis.com.br
          </a>
        </div>
      </div>

      <div className="rounded-lg border border-border/70 bg-card p-6 shadow-sm">
        <h3 className="font-display text-lg text-foreground">Localização</h3>
        <div className="mt-4 overflow-hidden rounded-md">
          <LazyPropertyMap address={property.address} />
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {property.address}
        </p>
      </div>
    </aside>
  );
}

export function PropertyDetail({ property, similar }: { property: Property; similar: ReactNode }) {
  const stats = [
    { icon: BedDouble, label: `${property.beds} Quartos` },
    { icon: Bath, label: `${property.baths} Banheiros` },
    { icon: Car, label: `${property.parking} Vagas` },
    { icon: Maximize, label: `${property.area}m² Área construída` },
  ];

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Início</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" hash="imoveis">
                  Imóveis
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{property.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <div className="min-w-0 space-y-8">
            <PropertyGallery property={property} />

            <div>
              <h1 className="font-display text-3xl text-foreground md:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold" />
                {property.location}
              </p>
              <p className="mt-4 text-3xl font-semibold text-gold md:text-4xl">{property.price}</p>

              <div className="mt-6 flex flex-wrap gap-6 border-y border-border/70 py-5">
                {stats.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <section>
              <h2 className="font-display text-2xl text-foreground">Sobre o imóvel</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {property.description.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl text-foreground">Diferenciais do imóvel</h2>
              <PropertyFeaturesGrid
                features={property.features}
                parking={property.parking}
                usePageLabels={false}
                emptyMessage="Nenhum diferencial cadastrado para este imóvel."
              />
            </section>
          </div>

          <ContactSidebar property={property} />
        </div>

        <section className="mt-16 border-t border-border/70 pt-12 md:mt-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-foreground">Imóveis semelhantes</h2>
            <Link
              to="/"
              hash="imoveis"
              className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-dark"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {similar}
        </section>
      </div>
    </div>
  );
}
