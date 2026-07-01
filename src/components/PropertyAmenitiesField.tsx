import { PropertyAmenityCard } from "@/components/PropertyAmenityCard";
import { PropertyFeaturesGrid } from "@/components/PropertyFeaturesGrid";
import type { PropertyFeature } from "@/lib/api";
import { PropertyCustomFeaturesField } from "@/components/PropertyCustomFeaturesField";
import {
  AMENITY_CATALOG,
  allFeaturesForDisplay,
  amenitiesToFeatures,
  FEATURE_ICONS,
  mergeFeaturesForStorage,
  toggleAmenitySelection,
  type AmenityId,
} from "@/lib/property-features";

type PropertyAmenitiesFieldProps = {
  selected: AmenityId[];
  onChange: (next: AmenityId[]) => void;
  customFeatures: PropertyFeature[];
  onCustomFeaturesChange: (next: PropertyFeature[]) => void;
  parking?: number;
  submitting?: boolean;
};

export function PropertyAmenitiesField({
  selected,
  onChange,
  customFeatures,
  onCustomFeaturesChange,
  parking,
  submitting = false,
}: PropertyAmenitiesFieldProps) {
  function toggleAmenity(id: AmenityId) {
    onChange(toggleAmenitySelection(selected, id));
  }

  const previewFeatures = allFeaturesForDisplay(
    mergeFeaturesForStorage(amenitiesToFeatures(selected, parking), customFeatures, parking),
    parking,
    { usePageLabels: false },
  );

  return (
    <div className="space-y-4">
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="group"
        aria-label="Diferenciais do imóvel"
      >
        {AMENITY_CATALOG.map((amenity) => {
          const Icon = FEATURE_ICONS[amenity.icon];
          return (
            <PropertyAmenityCard
              key={amenity.id}
              icon={Icon}
              label={amenity.label}
              selected={selected.includes(amenity.id)}
              interactive
              disabled={submitting}
              onClick={() => toggleAmenity(amenity.id)}
            />
          );
        })}
      </div>

      <PropertyCustomFeaturesField
        value={customFeatures}
        onChange={onCustomFeaturesChange}
        submitting={submitting}
      />

      {previewFeatures.length > 0 ? (
        <div className="space-y-2 rounded-lg border border-border/60 bg-cream/30 p-4">
          <p className="text-xs font-medium text-foreground">
            {previewFeatures.length} diferencial{previewFeatures.length === 1 ? "" : "is"} — prévia na
            página do imóvel:
          </p>
          <PropertyFeaturesGrid
            features={previewFeatures}
            parking={parking}
            className="mt-0"
            usePageLabels={false}
            emptyMessage="Nenhum diferencial selecionado."
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Selecione diferenciais do catálogo ou adicione diferenciais exclusivos acima.
        </p>
      )}
    </div>
  );
}
