import { useEffect, useState } from "react";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { Differentials } from "@/components/sections/Differentials";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";
import { fetchCondominiums, fetchProperties, type Property } from "@/lib/properties";
import {
  applyPropertyFilters,
  condominiumsFromProperties,
  heroSearchToPropertyFilters,
  mergeCondominiumLists,
  type HeroSearchFilters,
} from "@/lib/property-search";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [properties, apiCondominiums] = await Promise.all([
      fetchProperties({ sort: "recent" }),
      fetchCondominiums().catch(() => [] as string[]),
    ]);

    const condominiums = mergeCondominiumLists(
      apiCondominiums,
      condominiumsFromProperties(properties),
    );

    return { properties, condominiums };
  },
  staleTime: 60_000,
  head: () => ({
    meta: [
      { title: "Lótus Imóveis — Investir com visão, transformando escolhas em valor" },
      {
        name: "description",
        content:
          "Encontre oportunidades imobiliárias selecionadas com estratégia, segurança e excelência.",
      },
      { property: "og:title", content: "Lótus Imóveis" },
      {
        property: "og:description",
        content:
          "Encontre oportunidades imobiliárias selecionadas com estratégia, segurança e excelência.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { properties: initialProperties, condominiums: initialCondominiums } = Route.useLoaderData();
  const hash = useRouterState({ select: (state) => state.location.hash });
  const [allProperties, setAllProperties] = useState<Property[]>(initialProperties);
  const [condominiums, setCondominiums] = useState<string[]>(initialCondominiums);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!hash) return;
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [hash]);

  async function handleSearch(filters: HeroSearchFilters) {
    setHasSearched(true);
    setIsSearching(true);

    try {
      const [latestProperties, apiCondominiums] = await Promise.all([
        fetchProperties({ sort: "recent", ...heroSearchToPropertyFilters(filters) }),
        fetchCondominiums().catch(() => [] as string[]),
      ]);

      const mergedCondominiums = mergeCondominiumLists(
        apiCondominiums,
        condominiumsFromProperties(latestProperties),
      );

      setAllProperties(latestProperties);
      setCondominiums(mergedCondominiums);
      setFilteredProperties(applyPropertyFilters(latestProperties, filters));
    } catch {
      setFilteredProperties(applyPropertyFilters(allProperties, filters));
    } finally {
      setIsSearching(false);
    }

    if (typeof window !== "undefined") {
      const section = document.getElementById("imoveis");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      <main>
        <Hero condominiums={condominiums} onSearch={handleSearch} />
        <FeaturedProperties
          properties={filteredProperties}
          emptySearch={hasSearched && !isSearching && filteredProperties.length === 0}
          isLoading={isSearching}
        />
        <Differentials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
