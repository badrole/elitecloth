const WISHLIST_KEY = "elitecloth_wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleWishlist(outfitId: string): boolean {
  const list = getWishlist();
  const exists = list.includes(outfitId);
  const updated = exists ? list.filter((id) => id !== outfitId) : [...list, outfitId];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("wishlist-change"));
  return !exists; // returns new state: true = added, false = removed
}

export function isInWishlist(outfitId: string): boolean {
  return getWishlist().includes(outfitId);
}
