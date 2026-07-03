import type { Property, PropertyBadge } from "./api";

export function propertyPurposeLabel(purpose: Property["purpose"]): string {
  return purpose === "alugar" ? "Aluguel" : "Venda";
}

export function propertyBadgeLabel(badge: PropertyBadge): string {
  if (badge === "LANÇAMENTO") return "Lançamento";
  return "Destaque";
}
