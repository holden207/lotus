import type { ParsedLocation } from "@tanstack/react-router";

import type { Property } from "@/lib/properties";

export type PropertyLinkState = {
  property?: Property;
};

/** True when a list/card payload has enough fields to render the detail page. */
export function isPropertyDetailReady(property: Property): boolean {
  return Boolean(
    property.slug &&
    property.title &&
    property.description.length > 0 &&
    (property.gallery.length > 0 || property.image),
  );
}

export function getPropertyFromLinkState(state: unknown, slug: string): Property | undefined {
  if (!state || typeof state !== "object") return undefined;

  const property = (state as PropertyLinkState).property;
  if (!property || property.slug !== slug) return undefined;
  if (!isPropertyDetailReady(property)) return undefined;

  return property;
}

export function resolveCachedProperty(
  slug: string,
  location: ParsedLocation,
): Property | undefined {
  return getPropertyFromLinkState(location.state, slug);
}
