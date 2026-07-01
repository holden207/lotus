import { Plus, X } from "lucide-react";
import { PropertyAmenityCard } from "@/components/PropertyAmenityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FEATURE_ICON_OPTIONS,
  FEATURE_ICONS,
  type PropertyFeatureIcon,
} from "@/lib/property-features";
import type { PropertyFeature } from "@/lib/api";

type PropertyCustomFeaturesFieldProps = {
  value: PropertyFeature[];
  onChange: (next: PropertyFeature[]) => void;
  submitting?: boolean;
};

const selectClassName =
  "flex h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm";

export function PropertyCustomFeaturesField({
  value,
  onChange,
  submitting = false,
}: PropertyCustomFeaturesFieldProps) {
  function removeFeature(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateFeature(index: number, patch: Partial<PropertyFeature>) {
    onChange(
      value.map((feature, itemIndex) =>
        itemIndex === index ? { ...feature, ...patch } : feature,
      ),
    );
  }

  function addFeature() {
    onChange([...value, { label: "", icon: "gourmet" }]);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-sm font-medium text-foreground">Diferenciais exclusivos</Label>
        <p className="text-xs text-muted-foreground">
          Adicione características únicas deste imóvel com nome e ícone personalizados.
        </p>
      </div>

      {value.length > 0 ? (
        <div className="space-y-3">
          {value.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.icon];
            return (
              <div
                key={`custom-feature-${index}`}
                className="grid gap-3 rounded-lg border border-border/60 bg-cream/20 p-3 sm:grid-cols-[minmax(0,1fr)_180px_auto_auto] sm:items-end"
              >
                <div className="space-y-1.5">
                  <Label htmlFor={`custom-feature-label-${index}`} className="text-xs">
                    Nome do diferencial
                  </Label>
                  <Input
                    id={`custom-feature-label-${index}`}
                    value={feature.label}
                    onChange={(event) => updateFeature(index, { label: event.target.value })}
                    placeholder="Ex: Adega climatizada"
                    className="rounded-lg border-border/70"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`custom-feature-icon-${index}`} className="text-xs">
                    Ícone
                  </Label>
                  <select
                    id={`custom-feature-icon-${index}`}
                    value={feature.icon}
                    onChange={(event) =>
                      updateFeature(index, { icon: event.target.value as PropertyFeatureIcon })
                    }
                    className={selectClassName}
                    disabled={submitting}
                  >
                    {FEATURE_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Prévia</span>
                  <PropertyAmenityCard icon={Icon} label={feature.label.trim() || "Diferencial"} />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="self-end text-muted-foreground hover:text-destructive"
                  onClick={() => removeFeature(index)}
                  disabled={submitting}
                  aria-label={`Remover diferencial ${feature.label || index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nenhum diferencial exclusivo adicionado.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-lg border-border/70"
        onClick={addFeature}
        disabled={submitting}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar diferencial exclusivo
      </Button>
    </div>
  );
}
