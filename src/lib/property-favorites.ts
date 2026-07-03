const STORAGE_KEY = "lotus-favorite-properties";

function readFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

function writeFavorites(slugs: Set<string>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(slugs)));
}

export function isPropertyFavorite(slug: string): boolean {
  return readFavorites().has(slug);
}

/** Returns the new favorite state after toggling. */
export function togglePropertyFavorite(slug: string): boolean {
  const favorites = readFavorites();
  if (favorites.has(slug)) {
    favorites.delete(slug);
    writeFavorites(favorites);
    return false;
  }

  favorites.add(slug);
  writeFavorites(favorites);
  return true;
}
