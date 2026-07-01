import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function PropertyDetailPending() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-6 md:py-8">
        <Shimmer className="mb-6 h-4 w-64" />
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <div className="space-y-8">
            <Shimmer className="aspect-[16/9] w-full md:aspect-[2/1]" />
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Shimmer key={i} className="aspect-[4/3] w-full" />
              ))}
            </div>
            <div className="space-y-3">
              <Shimmer className="h-10 w-3/4" />
              <Shimmer className="h-5 w-1/2" />
              <Shimmer className="h-9 w-40" />
            </div>
          </div>
          <div className="space-y-6">
            <Shimmer className="h-96 w-full" />
            <Shimmer className="h-40 w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
