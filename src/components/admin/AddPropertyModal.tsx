"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyAmenitiesField } from "@/components/PropertyAmenitiesField";
import { createProperty, fetchCondominiums, updateProperty, type Property, type PropertyFeature } from "@/lib/api";
import {
  amenitiesToFeatures,
  extractCustomFeatures,
  featuresToAmenityIds,
  type AmenityId,
} from "@/lib/property-features";
import { prepareCondominiumForListing, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/property-search";
import { cn } from "@/lib/utils";

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property;
}

type GalleryItem = {
  key: string;
  preview: string;
  file?: File;
};

function formatPriceForInput(value: number): string {
  return value.toLocaleString("pt-BR");
}

function descriptionToText(description: string[]): string {
  return description.join("\n\n");
}

function isBlobUrl(url: string): boolean {
  return url.startsWith("blob:");
}

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}{" "}
      <span className="text-destructive" aria-hidden="true">
        *
      </span>
    </Label>
  );
}

function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <h3 className="text-base font-semibold text-foreground">
      {number}. {title}
    </h3>
  );
}

const selectClassName =
  "flex h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm";

function CondominiumLabel({ htmlFor }: { htmlFor: string }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase"
    >
      CONDOMÍNIO
    </Label>
  );
}

function CondominiumField({
  property,
  submitting,
  condominiumSuggestions,
}: {
  property?: Property;
  submitting: boolean;
  condominiumSuggestions: string[];
}) {
  return (
    <div className="space-y-2">
      <CondominiumLabel htmlFor="property-condominium" />
      <Input
        id="property-condominium"
        name="condominium"
        list="property-condominium-suggestions"
        defaultValue={property?.condominium ?? ""}
        placeholder="Ex: Alphaville Residencial One"
        className="h-10 rounded-lg border-border/70"
        disabled={submitting}
      />
      <datalist id="property-condominium-suggestions">
        {condominiumSuggestions.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <p className="text-xs text-muted-foreground">
        Informe o condomínio do imóvel para que ele apareça no filtro de busca.
      </p>
    </div>
  );
}

function PropertyListingFields({
  property,
  submitting,
}: {
  property?: Property;
  submitting: boolean;
}) {
  const locationOrCodeDefault = property?.code || property?.location || "";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RequiredLabel htmlFor="property-purpose">Finalidade</RequiredLabel>
        <select
          id="property-purpose"
          name="purpose"
          defaultValue={property?.purpose ?? "comprar"}
          className={selectClassName}
          required
          disabled={submitting}
        >
          {PROPERTY_PURPOSES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="property-type">Tipo de imóvel</RequiredLabel>
        <select
          id="property-type"
          name="propertyType"
          defaultValue={property?.propertyType ?? "Apartamento"}
          className={selectClassName}
          required
          disabled={submitting}
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <RequiredLabel htmlFor="property-location-or-code">Localização ou código</RequiredLabel>
        <Input
          id="property-location-or-code"
          name="locationOrCode"
          defaultValue={locationOrCodeDefault}
          placeholder="Bairro, cidade ou código do imóvel"
          className="h-10 rounded-lg border-border/70"
          required
          disabled={submitting}
        />
      </div>
    </div>
  );
}

function ImageUploadZone({
  id,
  label,
  hint,
  preview,
  onSelect,
  onRemove,
  multiple = false,
}: {
  id: string;
  label: string;
  hint: string;
  preview?: string | null;
  onSelect: (files: FileList) => void;
  onRemove?: () => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}{" "}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-border/70">
          <img src={preview} alt="" className="aspect-video w-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/90 shadow-sm"
            onClick={onRemove}
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/70 bg-muted/30 px-6 py-10 text-center transition-colors hover:border-gold/50 hover:bg-gold-soft/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-gold-dark">
            <Upload className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium text-foreground">Clique para enviar</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </button>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = event.target.files;
          if (files?.length) onSelect(files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function GalleryUploadZone({
  id,
  label,
  items,
  onSelect,
  onRemove,
}: {
  id: string;
  label: string;
  items: GalleryItem[];
  onSelect: (files: FileList) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}{" "}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.key} className="relative overflow-hidden rounded-lg border border-border/70">
            <img src={item.preview} alt="" className="aspect-square w-full object-cover" />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full bg-background/90 shadow-sm"
              onClick={() => onRemove(index)}
              aria-label="Remover imagem"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/70 bg-muted/30 px-3 text-center transition-colors hover:border-gold/50 hover:bg-gold-soft/40"
        >
          <ImagePlus className="h-5 w-5 text-gold-dark" />
          <span className="text-xs font-medium text-foreground">Adicionar</span>
        </button>
      </div>
      <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP. Você pode selecionar várias imagens de uma vez.</p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => {
          const files = event.target.files;
          if (files?.length) onSelect(files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

export function AddPropertyModal({ open, onOpenChange, property }: AddPropertyModalProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(property);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [condominiumSuggestions, setCondominiumSuggestions] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityId[]>([]);
  const [customFeatures, setCustomFeatures] = useState<PropertyFeature[]>([]);
  const [parkingSpots, setParkingSpots] = useState(property?.parking ?? 0);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    if (coverPreview && isBlobUrl(coverPreview)) URL.revokeObjectURL(coverPreview);
    galleryItems.forEach((item) => {
      if (isBlobUrl(item.preview)) URL.revokeObjectURL(item.preview);
    });
    setCoverFile(null);
    setCoverPreview(null);
    setGalleryItems([]);
    setSelectedAmenities([]);
    setCustomFeatures([]);
    setParkingSpots(0);
    formRef.current?.reset();
  }

  function loadPropertyData(nextProperty: Property) {
    setCoverFile(null);
    setCoverPreview(nextProperty.image);
    setGalleryItems(nextProperty.gallery.map((url) => ({ key: url, preview: url })));
    setSelectedAmenities(featuresToAmenityIds(nextProperty.features));
    setCustomFeatures(extractCustomFeatures(nextProperty.features));
    setParkingSpots(nextProperty.parking);
  }

  useEffect(() => {
    if (!open) return;
    if (property) {
      loadPropertyData(property);
    } else {
      resetForm();
    }
    void fetchCondominiums()
      .then(setCondominiumSuggestions)
      .catch(() => setCondominiumSuggestions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, property?.slug]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  function handleCoverSelect(files: FileList) {
    const file = files[0];
    if (!file) return;
    if (coverPreview && isBlobUrl(coverPreview)) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleGallerySelect(files: FileList) {
    const newItems = Array.from(files).map((file) => ({
      key: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      file,
    }));
    setGalleryItems((current) => [...current, ...newItems]);
  }

  function handleGalleryRemove(index: number) {
    setGalleryItems((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed && isBlobUrl(removed.preview)) URL.revokeObjectURL(removed.preview);
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hasCover = Boolean(coverFile || (coverPreview && !isBlobUrl(coverPreview)));
    if (!hasCover) {
      toast.error("Selecione uma imagem de capa.");
      return;
    }

    if (galleryItems.length === 0) {
      toast.error("Adicione pelo menos uma imagem na galeria.");
      return;
    }

    if (!isEdit && (!coverFile || galleryItems.some((item) => !item.file))) {
      toast.error("Envie as imagens do imóvel.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const locationOrCode = String(formData.get("locationOrCode") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    const purpose = String(formData.get("purpose") ?? "comprar").trim() as "comprar" | "alugar";
    const propertyType = String(formData.get("propertyType") ?? "Apartamento").trim();
    const condominium = prepareCondominiumForListing(String(formData.get("condominium") ?? ""));
    const looksLikeCode = /^[A-Z]{2,}[-\s]?\d+/i.test(locationOrCode);
    const location = locationOrCode;
    const code = looksLikeCode
      ? locationOrCode
      : isEdit && property?.code
        ? property.code
        : undefined;
    const beds = Number(formData.get("beds"));
    const baths = Number(formData.get("baths"));
    const parking = Number(formData.get("parking"));
    const area = Number(formData.get("area"));
    const features = [
      ...amenitiesToFeatures(selectedAmenities, parking),
      ...customFeatures
        .map((feature) => ({
          label: feature.label.trim(),
          icon: feature.icon,
        }))
        .filter((feature) => feature.label.length > 0),
    ];

    const existingGalleryUrls = galleryItems.filter((item) => !item.file).map((item) => item.preview);
    const newGalleryFiles = galleryItems.filter((item) => item.file).map((item) => item.file!);
    const existingCoverUrl =
      !coverFile && coverPreview && !isBlobUrl(coverPreview) ? coverPreview : undefined;

    setSubmitting(true);
    try {
      if (isEdit && property) {
        const updated = await updateProperty({
          slug: property.slug,
          title,
          beds,
          baths,
          parking,
          area,
          description,
          location,
          price,
          purpose,
          propertyType,
          condominium,
          code,
          badge: property.badge,
          coverImage: coverFile ?? undefined,
          existingCoverUrl,
          gallery: newGalleryFiles,
          existingGalleryUrls,
          features,
        });
        toast.success(`Imóvel "${updated.title}" atualizado com sucesso!`);
      } else {
        const created = await createProperty({
          title,
          beds,
          baths,
          parking,
          area,
          description,
          location,
          price,
          purpose,
          propertyType,
          condominium,
          code,
          coverImage: coverFile!,
          gallery: newGalleryFiles,
          features,
        });
        toast.success(`Imóvel "${created.title}" criado com sucesso!`);
      }

      await router.invalidate({
        filter: (match) =>
          match.routeId === "/admin_page/" ||
          match.routeId === "/" ||
          match.routeId === "/imoveis/$slug",
      });
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar o imóvel.");
    } finally {
      setSubmitting(false);
    }
  }

  const formKey = property?.slug ?? "new";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-[680px] gap-0 overflow-y-auto rounded-2xl border-border/60 p-8 shadow-xl sm:p-10",
          "duration-300 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]",
        )}
      >
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Editar imóvel" : "Adicionar novo imóvel"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações do imóvel." : "Preencha as informações do imóvel."}
          </DialogDescription>
        </DialogHeader>

        <form key={formKey} ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section className="space-y-4">
            <SectionHeading number={1} title="Título do imóvel" />
            <div className="space-y-2">
              <RequiredLabel htmlFor="property-title">Título do imóvel</RequiredLabel>
              <Input
                id="property-title"
                name="title"
                defaultValue={property?.title ?? ""}
                placeholder="Ex: Apartamento Luxo com Vista Mar"
                className="h-10 rounded-lg border-border/70"
                required
                disabled={submitting}
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeading number={2} title="CONDOMÍNIO" />
            <CondominiumField
              property={property}
              submitting={submitting}
              condominiumSuggestions={condominiumSuggestions}
            />
          </section>

          <section className="space-y-4">
            <SectionHeading number={3} title="Informações do imóvel" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <RequiredLabel htmlFor="property-beds">Número de Quartos</RequiredLabel>
                <Input
                  id="property-beds"
                  name="beds"
                  type="number"
                  min={0}
                  defaultValue={property?.beds ?? ""}
                  placeholder="Ex: 3"
                  className="h-10 rounded-lg border-border/70"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="property-baths">Número de Banheiros</RequiredLabel>
                <Input
                  id="property-baths"
                  name="baths"
                  type="number"
                  min={0}
                  defaultValue={property?.baths ?? ""}
                  placeholder="Ex: 2"
                  className="h-10 rounded-lg border-border/70"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="property-parking">Número de Vagas</RequiredLabel>
                <Input
                  id="property-parking"
                  name="parking"
                  type="number"
                  min={0}
                  defaultValue={property?.parking ?? ""}
                  placeholder="Ex: 2"
                  className="h-10 rounded-lg border-border/70"
                  required
                  disabled={submitting}
                  onChange={(event) => setParkingSpots(Number(event.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="property-area">Área construída (m²)</RequiredLabel>
                <div className="flex">
                  <Input
                    id="property-area"
                    name="area"
                    type="number"
                    min={1}
                    defaultValue={property?.area ?? ""}
                    placeholder="Ex: 120"
                    className="h-10 rounded-r-none rounded-l-lg border-border/70"
                    required
                    disabled={submitting}
                  />
                  <span className="flex h-10 items-center rounded-r-lg border border-l-0 border-border/70 bg-muted px-3 text-sm text-muted-foreground">
                    m²
                  </span>
                </div>
              </div>
            </div>
          </section>


          <section className="space-y-4">
            <SectionHeading number={4} title="Diferenciais do imóvel" />
            <PropertyAmenitiesField
              selected={selectedAmenities}
              onChange={setSelectedAmenities}
              customFeatures={customFeatures}
              onCustomFeaturesChange={setCustomFeatures}
              parking={parkingSpots}
              submitting={submitting}
            />
          </section>

          <section className="space-y-4">
            <SectionHeading number={5} title="Descrição do imóvel" />
            <div className="space-y-2">
              <RequiredLabel htmlFor="property-description">Descrição do imóvel</RequiredLabel>
              <Textarea
                id="property-description"
                name="description"
                defaultValue={property ? descriptionToText(property.description) : ""}
                placeholder="Ex: Apartamento amplo com vista para o mar, acabamento de alto padrão e área de lazer completa..."
                className="min-h-[120px] resize-y rounded-lg border-border/70"
                required
                disabled={submitting}
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeading number={6} title="Imagem de capa" />
            <ImageUploadZone
              id="property-cover"
              label="Imagem de capa"
              hint="PNG, JPG ou WEBP até 5 MB"
              preview={coverPreview}
              onSelect={handleCoverSelect}
              onRemove={() => {
                if (coverPreview && isBlobUrl(coverPreview)) URL.revokeObjectURL(coverPreview);
                setCoverFile(null);
                setCoverPreview(null);
              }}
            />
          </section>

          <section className="space-y-4">
            <SectionHeading number={7} title="Galeria de imagens" />
            <GalleryUploadZone
              id="property-gallery"
              label="Imagens do imóvel"
              items={galleryItems}
              onSelect={handleGallerySelect}
              onRemove={handleGalleryRemove}
            />
          </section>

          <section className="space-y-4">
            <SectionHeading number={8} title="Finalidade e localização" />
            <PropertyListingFields property={property} submitting={submitting} />
          </section>

          <section className="space-y-4">
            <SectionHeading number={9} title="Preço" />
            <div className="space-y-2">
              <RequiredLabel htmlFor="property-price">Preço do imóvel</RequiredLabel>
              <div className="flex">
                <span className="flex h-10 items-center rounded-l-lg border border-r-0 border-border/70 bg-muted px-3 text-sm text-muted-foreground">
                  R$
                </span>
                <Input
                  id="property-price"
                  name="price"
                  defaultValue={property ? formatPriceForInput(property.priceValue) : ""}
                  placeholder="Ex: 1.250.000,00"
                  className="h-10 rounded-l-none rounded-r-lg border-border/70"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </section>

          <DialogFooter className="gap-2 pt-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-border/70 px-6"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-lg bg-gold px-6 text-primary-foreground hover:bg-gold-dark"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : isEdit ? (
                "Salvar alterações"
              ) : (
                "Salvar imóvel"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
