import type { Property, PropertyFilters } from "./api";

export const PROPERTY_PURPOSES = [
  { value: "comprar", label: "Comprar" },
  { value: "alugar", label: "Alugar" },
] as const;

export type PropertyPurpose = (typeof PROPERTY_PURPOSES)[number]["value"];

export type HeroSearchFilters = {
  purpose?: PropertyPurpose | "";
  propertyType?: string;
  condominium?: string;
  locationOrCode?: string;
  minPrice?: number;
  maxPrice?: number;
};

export function mergeCondominiumLists(...sources: Iterable<string>[]): string[] {
  const names = new Set<string>();
  for (const source of sources) {
    for (const name of source) {
      const normalized = normalizeCondominiumName(name);
      if (normalized) names.add(normalized);
    }
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function normalizeCondominiumName(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length > 0 ? normalized : undefined;
}

/** Prepares CONDOMÍNIO text from admin forms before saving to a listing. */
export function prepareCondominiumForListing(raw: string): string | undefined {
  return normalizeCondominiumName(raw);
}

export function matchesCondominiumFilter(
  propertyCondominium: string | undefined,
  filterCondominium: string,
): boolean {
  const normalizedFilter = normalizeCondominiumName(filterCondominium);
  if (!normalizedFilter) return true;

  const normalizedProperty = normalizeCondominiumName(propertyCondominium);
  if (!normalizedProperty) return false;

  return normalizeSearchText(normalizedProperty) === normalizeSearchText(normalizedFilter);
}

export function condominiumsFromProperties(properties: Property[]): string[] {
  return mergeCondominiumLists(
    properties.map((property) => property.condominium ?? "").filter(Boolean),
  );
}

const PROPERTY_CODE_PATTERN = /^(?:[A-Z]{2,}[-_])?\d{1,6}$|^[A-Z]{2,}[-_][A-Z0-9][-A-Z0-9]*$/i;

export function isPropertyCode(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  return PROPERTY_CODE_PATTERN.test(trimmed.replace(/\s/g, ""));
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function propertySearchableFields(property: Property): string[] {
  const derivedCode = property.code ?? property.slug.toUpperCase().replace(/-/g, "_");
  return [
    property.location,
    property.address,
    property.title,
    property.code,
    derivedCode,
    property.slug,
    property.slug.replace(/-/g, " "),
    property.condominium,
  ].filter((field): field is string => Boolean(field));
}

function matchesLocationOrCode(property: Property, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  if (isPropertyCode(query)) {
    const compactQuery = query.trim().replace(/\s/g, "").toUpperCase();
    const codeFields = [property.code, property.slug.toUpperCase().replace(/-/g, "_")]
      .filter(Boolean)
      .map((value) => value!.toUpperCase());
    if (codeFields.some((value) => value.includes(compactQuery) || compactQuery.includes(value))) {
      return true;
    }
  }

  return propertySearchableFields(property).some((field) =>
    normalizeSearchText(field).includes(normalizedQuery),
  );
}

export function heroSearchToPropertyFilters(filters: HeroSearchFilters): PropertyFilters {
  const result: PropertyFilters = {};

  if (filters.purpose) result.purpose = filters.purpose;
  if (filters.propertyType) result.propertyType = filters.propertyType;
  if (filters.condominium) {
    const normalized = prepareCondominiumForListing(filters.condominium);
    if (normalized) result.condominium = normalized;
  }

  if (filters.locationOrCode) {
    const term = filters.locationOrCode.trim();
    if (isPropertyCode(term)) {
      result.code = term;
    } else {
      result.q = term;
    }
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) result.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) result.maxPrice = filters.maxPrice;

  return result;
}

export function applyPropertyFilters(properties: Property[], filters: HeroSearchFilters): Property[] {
  return properties.filter((property) => {
    if (filters.purpose && property.purpose !== filters.purpose) {
      return false;
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }
    if (filters.condominium && !matchesCondominiumFilter(property.condominium, filters.condominium)) {
      return false;
    }
    if (filters.locationOrCode && !matchesLocationOrCode(property, filters.locationOrCode)) {
      return false;
    }
    if (filters.minPrice !== undefined && property.priceValue < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && property.priceValue > filters.maxPrice) {
      return false;
    }
    return true;
  });
}

export const PROPERTY_TYPES = [
  "Apartamento",
  "Casa",
  "Casa unifamiliar",
  "Casa em Condomínio",
  "Sobrado",
  "Casa de campo",
  "Casa de campo em condomínio",
  "Cobertura",
  "Chácara",
  "Galpão",
  "Prédio comercial",
  "Terreno",
  "Terreno em Condomínio",
  "Edifício",
  "Espaço comercial",
  "Condomínio",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export function parseBrazilianPrice(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) return 0;

  const normalized = trimmed.replace(/[^\d,.]/g, "");
  if (!normalized) return 0;

  if (normalized.includes(",")) {
    const withoutThousands = normalized.replace(/\./g, "").replace(",", ".");
    const value = Number.parseFloat(withoutThousands);
    return Number.isFinite(value) ? Math.round(value) : 0;
  }

  const value = Number.parseInt(normalized.replace(/\./g, ""), 10);
  return Number.isFinite(value) ? value : 0;
}

export function formatBrazilianPrice(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceInput(value: number): string {
  if (value <= 0) return "";
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function handlePriceInputChange(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const cents = Number.parseInt(digits, 10);
  if (!Number.isFinite(cents)) return "";
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
