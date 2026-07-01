"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { IMAGES } from "@/lib/images";
import type { Property } from "@/lib/properties";

const INITIAL_VISIBLE = 6;

export function FeaturedProperties({
  properties,
  emptySearch = false,
  isLoading = false,
}: {
  properties: Property[];
  emptySearch?: boolean;
  isLoading?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleProperties = showAll ? properties : properties.slice(0, INITIAL_VISIBLE);
  const hasMore = properties.length > INITIAL_VISIBLE;

  return (
    <section id="imoveis" className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <p className="mb-2.5 text-[11px] font-semibold tracking-[0.24em] text-gold">
              SELEÇÃO ESPECIAL
            </p>
            <h2 className="font-display text-4xl text-foreground md:text-[2.75rem]">
              Imóveis em destaque
            </h2>
          </div>
          {hasMore && !showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-md border border-gold px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-foreground transition-colors hover:bg-gold-soft"
            >
              VER TODOS OS IMÓVEIS
              <ArrowRight className="h-4 w-4 text-gold" />
            </button>
          ) : null}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            Buscando imóveis...
          </div>
        ) : emptySearch ? (
          <div className="flex flex-col items-center justify-center py-10 text-center md:py-14">
            <img
              src={IMAGES.emptySearch}
              alt="Imóvel não encontrado"
              width={480}
              height={320}
              className="w-full max-w-sm rounded-lg object-cover opacity-90"
            />
            <h3 className="mt-8 font-display text-2xl text-foreground md:text-3xl">
              O imóvel não existe
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Não encontramos nenhum imóvel com os filtros selecionados. Tente ajustar sua busca.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {visibleProperties.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
