import { Await, createFileRoute, defer, notFound } from "@tanstack/react-router";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { PropertyDetail } from "@/components/sections/PropertyDetail";
import { PropertyDetailPending } from "@/components/PropertyDetailPending";
import { PropertyCard } from "@/components/PropertyCard";
import { fetchPropertyBySlug, fetchSimilarProperties, type Property } from "@/lib/properties";

export const Route = createFileRoute("/imoveis/$slug")({
  loader: async ({ params }) => {
    const property = await fetchPropertyBySlug(params.slug).then((result) => {
      if (!result) throw notFound();
      return result;
    });

    return {
      property,
      similar: defer(fetchSimilarProperties(params.slug)),
    };
  },
  staleTime: 0,
  preloadStaleTime: 0,
  pendingMs: 0,
  pendingMinMs: 150,
  pendingComponent: PropertyDetailPending,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.property.title ?? "Imóvel"} — Lótus Imóveis`,
      },
      {
        name: "description",
        content: loaderData?.property.description[0] ?? "Detalhes do imóvel",
      },
    ],
  }),
  component: PropertyDetailPage,
});

function SimilarPropertiesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
          <div className="space-y-3 p-5">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PropertyDetailPage() {
  const { property, similar } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      <main>
        <PropertyDetail
          property={property}
          similar={
            <Await promise={similar} fallback={<SimilarPropertiesSkeleton />}>
              {(items) => (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                  {items.map((p: Property) => (
                    <PropertyCard key={p.slug} property={p} />
                  ))}
                </div>
              )}
            </Await>
          }
        />
      </main>
      <Footer />
    </div>
  );
}
