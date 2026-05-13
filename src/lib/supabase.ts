import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ──────────────────────────────────────────────
   Database types matching PRD data model
   ────────────────────────────────────────────── */

export interface Outfit {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  occasion: string;
  niche: string;
  gender: string;
  cover_image_url: string;
  gallery_image_urls: string[];
  tags: string[];
  estimated_total_price: number;
  published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface OutfitItem {
  id: string;
  outfit_id: string;
  name: string;
  item_type: string;
  thumbnail_url: string;
  estimated_price: number;
  shopee_affiliate_url: string | null;
  tiktok_shop_affiliate_url: string | null;
  position: number;
}

export interface AffiliateClick {
  id?: string;
  outfit_id: string;
  item_id: string;
  marketplace: "shopee" | "tiktok_shop";
  user_agent: string;
  referrer: string;
  session_id: string;
  clicked_at?: string;
}

/* ── Queries ── */

export async function getOutfits(options?: {
  category?: string;
  tag?: string;
  gender?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "popular";
}) {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("outfits")
    .select("*", { count: "exact" })
    .eq("published", true);

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.gender) {
    query = query.eq("gender", options.gender);
  }
  if (options?.tag) {
    query = query.contains("tags", [options.tag]);
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  // Sorting
  switch (options?.sort) {
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;

    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  return {
    outfits: (data as Outfit[]) ?? [],
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
    error,
  };
}

export async function getOutfitBySlug(slug: string) {
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return { outfit: data as Outfit | null, error };
}

export async function getOutfitItems(outfitId: string) {
  const { data, error } = await supabase
    .from("outfit_items")
    .select("*")
    .eq("outfit_id", outfitId)
    .order("position", { ascending: true });

  return { items: (data as OutfitItem[]) ?? [], error };
}

export async function getSimilarOutfits(
  outfit: Outfit,
  limit = 4
) {
  const { data, error } = await supabase
    .from("outfits")
    .select("*")
    .eq("published", true)
    .eq("category", outfit.category)
    .neq("id", outfit.id)
    .order("view_count", { ascending: false })
    .limit(limit);

  return { outfits: (data as Outfit[]) ?? [], error };
}

export async function incrementViewCount(outfitId: string) {
  await supabase.rpc("increment_view_count", { outfit_id_input: outfitId });
}

export async function logAffiliateClick(click: AffiliateClick) {
  const { error } = await supabase.from("affiliate_clicks").insert([click]);
  return { error };
}

export async function getAllCategories(): Promise<string[]> {
  const { data } = await supabase
    .from("outfits")
    .select("category")
    .eq("published", true);

  const categories = [
    ...new Set((data ?? []).map((d: { category: string }) => d.category)),
  ];
  return categories.filter(Boolean);
}

export async function getAllTags(): Promise<string[]> {
  const { data } = await supabase
    .from("outfits")
    .select("tags")
    .eq("published", true);

  const tags = new Set<string>();
  (data ?? []).forEach((d: { tags: string[] }) => {
    d.tags?.forEach((t) => tags.add(t));
  });
  return Array.from(tags).filter(Boolean);
}

export async function getAllSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from("outfits")
    .select("slug")
    .eq("published", true);

  return (data ?? []).map((d: { slug: string }) => d.slug);
}
