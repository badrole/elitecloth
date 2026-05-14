import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET all outfits (admin view - includes unpublished)
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("outfits")
    .select(`id, slug, name, category, cover_image_url, estimated_total_price, items:outfit_items(id, shopee_affiliate_url, tiktok_shop_affiliate_url)`)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// POST create new outfit
export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const { name, category, tags, cover_image_url, gallery_image_urls, slug } = body;

  if (!name || !category || !cover_image_url || !slug) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate field lengths
  if (name.length > 200) return Response.json({ error: "Name too long" }, { status: 400 });
  if (category.length > 50) return Response.json({ error: "Category too long" }, { status: 400 });

  const { data, error } = await supabase
    .from("outfits")
    .insert({
      name: name.trim(),
      slug,
      category: category.toLowerCase().trim(),
      tags: Array.isArray(tags) ? tags.map((t: string) => t.trim()).filter(Boolean) : [],
      cover_image_url,
      gallery_image_urls: gallery_image_urls || [],
      estimated_total_price: 0,
      published: true,
    })
    .select("id")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
