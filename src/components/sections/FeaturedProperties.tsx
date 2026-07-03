"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { IMAGES } from "@/lib/images";
import type { Property } from "@/lib/properties";

const INITIAL_VISIBLE = 6;

type PropertySectionProps = {
  eyebrow: string;
  title: string;
  properties: Property[];
  showAllInitially?: boolean;
};

function PropertySection({ eyebrow, title, properties, showAllInitially = false }: PropertySectionProps) {
  const [showAll, setShowAll] = useState(showAllInitially);
  const visibleProperties = showAll ? properties : properties.slice(0, INITIAL_VISIBLE);
  const hasMore = properties.length > INITIAL_VISIBLE;

  if (properties.length === 0) return null;

  return (
    <div className="mb-16 last:mb-0 md:mb-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
        <div>
          <p className="mb-2.5 text-[11px] font-semibold tracking-[0.24em] text-gold">{eyebrow}</p>
          <h2 className="font-display text-4xl text-foreground md:text-[2.75rem]">{title}</h2>
        </div>
        {hasMore && !showAll ? (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gold px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-foreground transition-colors hover:bg-gold-soft"
          >
            VER TODOS
            <ArrowRight className="h-4 w-4 text-gold" />
          </button>
        ) : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {visibleProperties.map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center md:py-14">
      <img
        src={IMAGES.emptySearch}
        alt="Imóvel não encontrado"
        width={480}
        height={320}
        className="w-full max-w-sm rounded-lg object-cover opacity-90"
      />
      <h3 className="mt-8 font-display text-2xl text-foreground md:text-3xl">O imóvel não existe</h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Não encontramos nenhum imóvel com os filtros selecionados. Tente ajustar sua busca.
      </p>
    </div>
  );
}

export function FeaturedProperties({
  properties,
  emptySearch = false,
  isLoading = false,
  hasSearched = false,
}: {
  properties: Property[];
  emptySearch?: boolean;
  isLoading?: boolean;
  hasSearched?: boolean;
}) {
  const featuredProperties = properties.filter((property) => property.badge !== "LANÇAMENTO");
  const launchProperties = properties.filter((property) => property.badge === "LANÇAMENTO");

  return (
    <section id="imoveis" className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            Buscando imóveis...
          </div>
        ) : emptySearch ? (
          <EmptySearchState />
        ) : hasSearched ? (
          <PropertySection
            eyebrow="RESULTADOS"
            title="Imóveis encontrados"
            properties={properties}
            showAllInitially
          />
        ) : (
          <>
            <PropertySection
              eyebrow="DESTAQUES"
              title="Imóveis em destaque"
              properties={featuredProperties.length > 0 ? featuredProperties : properties}
            />
            <PropertySection eyebrow="LANÇAMENTOS" title="Lançamentos" properties={launchProperties} />
          </>
        )}
      </div>
    </section>
  );
}
