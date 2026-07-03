import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Car, Maximize } from "lucide-react";
import type { Property } from "@/lib/properties";
import { propertyBadgeLabel, propertyPurposeLabel } from "@/lib/property-labels";
import { cn } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  const specs = [
    { icon: BedDouble, value: property.beds },
    { icon: Bath, value: property.baths },
    { icon: Car, value: property.parking },
    { icon: Maximize, value: `${property.area}m²` },
  ];

  const purposeLabel = propertyPurposeLabel(property.purpose);

  return (
    <Link
      to="/imoveis/$slug"
      params={{ slug: property.slug }}
      state={{ property }}
      preload="intent"
      className="group block overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="relative overflow-hidden">
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {property.badge ? (
            <span className="rounded bg-gold px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em] text-primary-foreground">
              {propertyBadgeLabel(property.badge)} · {purposeLabel}
            </span>
          ) : (
            <span
              className={cn(
                "rounded px-2.5 py-1 text-[9px] font-semibold tracking-[0.16em]",
                property.purpose === "alugar"
                  ? "bg-foreground/90 text-background"
                  : "bg-gold text-primary-foreground",
              )}
            >
              {purposeLabel}
            </span>
          )}
        </div>
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-3.5 p-5">
        <div>
          <h3 className="font-display text-xl text-foreground">{property.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{property.location}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-border/70 pt-3.5 text-sm text-muted-foreground">
          {specs.map(({ icon: Icon, value }, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
              {value}
            </span>
          ))}
        </div>
        <p className="text-lg font-semibold text-gold">{property.price}</p>
      </div>
    </Link>
  );
}
