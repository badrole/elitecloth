export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("elitecloth_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("elitecloth_session_id", sessionId);
  }
  return sessionId;
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    kampus: "Kampus",
    casual: "Casual",
    "semi-formal": "Semi-formal",
    nongkrong: "Nongkrong",
    olahraga: "Olahraga",
    "acara-khusus": "Acara Khusus",
  };
  return map[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

export function priceRangeLabel(range: string): string {
  const map: Record<string, string> = {
    "0-200000": "< Rp 200rb",
    "200000-500000": "Rp 200rb - 500rb",
    "500000-1000000": "Rp 500rb - 1jt",
    "1000000-999999999": "> Rp 1jt",
  };
  return map[range] ?? range;
}
