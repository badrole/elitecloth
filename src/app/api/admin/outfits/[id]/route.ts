import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// GET single outfit with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("outfits")
    .select(`*, items:outfit_items(*)`)
    .eq("id", id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 404 });
  return Response.json(data);
}

// PUT update outfit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  const { name, category, tags, cover_image_url, gallery_image_urls } = body;

  if (name && name.length > 200) return Response.json({ error: "Name too long" }, { status: 400 });
  if (category && category.length > 50) return Response.json({ error: "Category too long" }, { status: 400 });

  const payload: Record<string, unknown> = {};
  if (name) payload.name = name.trim();
  if (category) payload.category = category.toLowerCase().trim();
  if (tags) payload.tags = tags.map((t: string) => t.trim()).filter(Boolean);
  if (cover_image_url) payload.cover_image_url = cover_image_url;
  if (gallery_image_urls) payload.gallery_image_urls = gallery_image_urls;

  const { error } = await supabase.from("outfits").update(payload).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

// DELETE outfit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { error } = await supabase.from("outfits").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
