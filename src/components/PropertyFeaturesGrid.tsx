import type { PropertyFeature } from "@/lib/api";
import { PropertyAmenityCard } from "@/components/PropertyAmenityCard";
import { allFeaturesForDisplay, FEATURE_ICONS } from "@/lib/property-features";
import { cn } from "@/lib/utils";

type PropertyFeaturesGridProps = {
  features: PropertyFeature[];
  parking?: number;
  className?: string;
  emptyMessage?: string;
  usePageLabels?: boolean;
};

export function PropertyFeaturesGrid({
  features,
  parking,
  className,
  emptyMessage = "No key features listed for this property.",
  usePageLabels = true,
}: PropertyFeaturesGridProps) {
  const items = allFeaturesForDisplay(features ?? [], parking, { usePageLabels });

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <div className={cn("mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4", className)}>
      {items.map((feature, index) => {
        const Icon = FEATURE_ICONS[feature.icon];
        const key = feature.amenityId ?? `${feature.icon}-${index}`;

        return (
          <PropertyAmenityCard
            key={key}
            icon={Icon}
            label={feature.label}
          />
        );
      })}
    </div>
  );
}
