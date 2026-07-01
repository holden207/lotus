export type PropertyBadge = "DESTAQUE" | "LANÇAMENTO";

export type PropertyAmenityId =
  | "private_pool"
  | "terrace"
  | "security_24h"
  | "air_conditioning"
  | "private_beach"
  | "marina"
  | "wifi"
  | "parking_space";

export type PropertyFeature = {
  label: string;
  icon:
    | "pool"
    | "gourmet"
    | "security"
    | "ac"
    | "gym"
    | "garden"
    | "wifi"
    | "parking"
    | "elevator"
    | "balcony"
    | "beach"
    | "marina";
  amenityId?: PropertyAmenityId;
};

export type Property = {
  slug: string;
  title: string;
  location: string;
  address: string;
  badge?: PropertyBadge;
  purpose: "comprar" | "alugar";
  propertyType: string;
  condominium?: string;
  code?: string;
  image: string;
  gallery: string[];
  beds: number;
  baths: number;
  parking: number;
  area: number;
  price: string;
  priceValue: number;
  description: string[];
  features: PropertyFeature[];
  createdAt: string;
};

export type CreatePropertyFormInput = {
  title: string;
  beds: number;
  baths: number;
  parking: number;
  area: number;
  description: string;
  location: string;
  address?: string;
  price: string;
  purpose?: "comprar" | "alugar";
  propertyType?: string;
  condominium?: string;
  code?: string;
  badge?: PropertyBadge;
  coverImage: File;
  gallery: File[];
  features: PropertyFeature[];
};

export type PropertySort = "recent" | "price";

export type PropertyFilters = {
  q?: string;
  badge?: PropertyBadge;
  location?: string;
  purpose?: "comprar" | "alugar";
  propertyType?: string;
  condominium?: string;
  code?: string;
  minBeds?: number;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  sort?: PropertySort;
};

export type InquiryInput = {
  propertySlug?: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
};

export type Inquiry = {
  id: number;
  propertySlug: string | null;
  propertyTitle: string | null;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  createdAt: string;
  readAt: string | null;
};

type ApiListResponse<T> = { data: T; total?: number };
type ApiItemResponse<T> = { data: T };

// const DEFAULT_API_ORIGIN = "http://127.0.0.1:3001";
const DEFAULT_API_ORIGIN = "http://127.0.0.1:3001";

function normalizeApiOrigin(url: string): string {
  return url.replace(/\/$/, "");
}

/** Public API origin used to resolve uploaded media paths (`/uploads/...`). */
export function getApiOrigin(): string {
  return getApiBase();
}

function getApiBase(): string {
  const runtimeApiUrl =
    typeof process !== "undefined"
      ? (process.env.VITE_API_URL ?? process.env.API_URL)
      : undefined;

  if (runtimeApiUrl) {
    return normalizeApiOrigin(runtimeApiUrl);
  }

  if (import.meta.env.VITE_API_URL) {
    return normalizeApiOrigin(import.meta.env.VITE_API_URL);
  }

  if (import.meta.env.SSR) {
    // Never call localhost in production — it does not exist on Vercel.
    if (typeof process !== "undefined" && process.env.VERCEL) {
      throw new Error("VITE_API_URL is not set in Vercel environment variables.");
    }
    return DEFAULT_API_ORIGIN;
  }

  return "";
}

/** Turn backend-relative upload paths into absolute URLs in production. */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (/^(https?:|blob:|data:)/.test(url)) return url;

  const base = getApiBase();
  if (!base) return url;

  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
}

/** Strip API origin before sending stored paths back to the backend. */
function toRelativeMediaUrl(url: string): string {
  if (!url || !url.startsWith("http")) return url;

  const base = getApiBase();
  if (base && url.startsWith(base)) {
    return url.slice(base.length) || url;
  }

  return url;
}

function normalizeProperty(property: Property): Property {
  return {
    ...property,
    purpose: property.purpose ?? "comprar",
    propertyType: property.propertyType ?? "Apartamento",
    image: resolveMediaUrl(property.image),
    gallery: property.gallery.map(resolveMediaUrl),
    features: property.features ?? [],
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const url = `${base}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: string }).error)
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function toQuery(filters?: PropertyFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.badge) params.set("badge", filters.badge);
  if (filters.location) params.set("location", filters.location);
  if (filters.purpose) params.set("purpose", filters.purpose);
  if (filters.propertyType) params.set("propertyType", filters.propertyType);
  if (filters.condominium) params.set("condominium", filters.condominium);
  if (filters.code) params.set("code", filters.code);
  if (filters.minBeds !== undefined) params.set("minBeds", String(filters.minBeds));
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  if (filters.sort) params.set("sort", filters.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchProperties(filters?: PropertyFilters): Promise<Property[]> {
  const res = await apiFetch<ApiListResponse<Property[]>>(`/api/properties${toQuery(filters)}`);
  return res.data.map(normalizeProperty);
}

export async function fetchRecentProperties(limit = 5): Promise<Property[]> {
  const res = await apiFetch<ApiListResponse<Property[]>>(`/api/properties/recent?limit=${limit}`);
  return res.data.map(normalizeProperty);
}

export async function fetchCondominiums(): Promise<string[]> {
  const res = await apiFetch<ApiListResponse<string[]>>("/api/properties/condominiums");
  return res.data;
}

export async function fetchPropertyBySlug(slug: string): Promise<Property | undefined> {
  try {
    const res = await apiFetch<ApiItemResponse<Property>>(`/api/properties/${slug}`);
    return normalizeProperty(res.data);
  } catch (err) {
    if (err instanceof Error && err.message === "Property not found") return undefined;
    throw err;
  }
}

export async function fetchSimilarProperties(slug: string, limit = 3): Promise<Property[]> {
  const res = await apiFetch<ApiListResponse<Property[]>>(
    `/api/properties/${slug}/similar?limit=${limit}`,
  );
  return res.data.map(normalizeProperty);
}

export async function submitInquiry(input: InquiryInput): Promise<{ id: number; message: string }> {
  const res = await apiFetch<ApiItemResponse<{ id: number; message: string }>>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function fetchInquiries(limit?: number): Promise<Inquiry[]> {
  const query = limit !== undefined ? `?limit=${limit}` : "";
  const res = await apiFetch<ApiListResponse<Inquiry[]>>(`/api/inquiries${query}`);
  return res.data;
}

export async function deleteInquiry(id: number): Promise<void> {
  await apiFetch<ApiItemResponse<{ id: number; message: string }>>(`/api/inquiries/${id}`, {
    method: "DELETE",
  });
}

export type ReservationNotification = {
  name: string;
  date: string;
};

export async function fetchNotificationCount(): Promise<number> {
  const res = await apiFetch<ApiItemResponse<{ count: number }>>("/api/notifications/count");
  return res.data.count;
}

export async function fetchUnreadInquiries(): Promise<Inquiry[]> {
  const res = await apiFetch<ApiListResponse<Inquiry[]>>("/api/notifications/unread");
  return res.data;
}

export async function postNotification(input: ReservationNotification): Promise<void> {
  await apiFetch<ApiItemResponse<ReservationNotification & { message: string }>>(
    "/api/notifications",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function markNotificationsRead(ids?: number[]): Promise<void> {
  await apiFetch<ApiItemResponse<{ marked: number }>>("/api/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify(ids ? { ids } : {}),
  });
}

export type UpdatePropertyFormInput = {
  slug: string;
  title: string;
  beds: number;
  baths: number;
  parking: number;
  area: number;
  description: string;
  location: string;
  address?: string;
  price: string;
  purpose?: "comprar" | "alugar";
  propertyType?: string;
  condominium?: string;
  code?: string;
  badge?: PropertyBadge;
  coverImage?: File;
  existingCoverUrl?: string;
  gallery: File[];
  existingGalleryUrls: string[];
  features: PropertyFeature[];
};

function formatApiError(body: unknown, fallback: string): string {
  if (typeof body !== "object" || body === null) return fallback;

  const details = (body as { details?: { fieldErrors?: Record<string, string[]> } }).details;
  if (details?.fieldErrors) {
    const messages = Object.values(details.fieldErrors).flat();
    if (messages.length > 0) return messages.join(" ");
  }

  if ("error" in body) return String((body as { error: string }).error);
  return fallback;
}

async function submitPropertyForm(
  path: string,
  method: "POST" | "PUT",
  input: CreatePropertyFormInput | UpdatePropertyFormInput,
): Promise<Property> {
  const base = getApiBase();
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("beds", String(input.beds));
  formData.append("baths", String(input.baths));
  formData.append("parking", String(input.parking));
  formData.append("area", String(input.area));
  formData.append("description", input.description);
  formData.append("location", input.location);
  if (input.address) formData.append("address", input.address);
  formData.append("price", input.price);
  if (input.purpose) formData.append("purpose", input.purpose);
  if (input.propertyType) formData.append("propertyType", input.propertyType);
  formData.append("condominium", (input.condominium ?? "").trim().replace(/\s+/g, " "));
  if (input.code) formData.append("code", input.code);
  if (input.badge) formData.append("badge", input.badge);
  formData.append("features", JSON.stringify(input.features ?? []));  

  if ("existingCoverUrl" in input && input.existingCoverUrl) {
    formData.append("existingCoverUrl", toRelativeMediaUrl(input.existingCoverUrl));
  }
  if ("existingGalleryUrls" in input && input.existingGalleryUrls.length > 0) {
    formData.append(
      "existingGallery",
      JSON.stringify(input.existingGalleryUrls.map(toRelativeMediaUrl)),
    );
  }

  if (input.coverImage) {
    formData.append("coverImage", input.coverImage);
  }
  for (const file of input.gallery) {
    formData.append("gallery", file);
  }  

  const response = await fetch(`${base}${path}`, {
    method,
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(formatApiError(body, `Request failed (${response.status})`));
  }

  const res = (await response.json()) as ApiItemResponse<Property>;

  
  return normalizeProperty(res.data);


}

export async function createProperty(input: CreatePropertyFormInput): Promise<Property> {
  return submitPropertyForm("/api/properties", "POST", input);
}

export async function updateProperty(input: UpdatePropertyFormInput): Promise<Property> {
  return submitPropertyForm(`/api/properties/${input.slug}`, "PUT", input);
}

export async function deleteProperty(slug: string): Promise<void> {
  await apiFetch<ApiItemResponse<{ slug: string; message: string }>>(`/api/properties/${slug}`, {
    method: "DELETE",
  });
}
