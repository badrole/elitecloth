import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "outfits";

/** Extract storage file path from public URL */
function getStoragePath(url: string): string | null {
  const match = url.match(/\/storage\/v1\/object\/public\/outfits\/(.+)$/);
  return match ? match[1] : null;
}

/** Delete files from storage by their public URLs */
async function deleteStorageFiles(supabase: SupabaseClient, urls: string[]) {
  const paths = urls.map(getStoragePath).filter(Boolean) as string[];
  if (paths.length > 0) {
    await supabase.storage.from(BUCKET).remove(paths);
  }
}

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

  // Get old data to compare images
  const { data: oldData } = await supabase.from("outfits").select("cover_image_url, gallery_image_urls").eq("id", id).single();

  const payload: Record<string, unknown> = {};
  if (name) payload.name = name.trim();
  if (category) payload.category = category.toLowerCase().trim();
  if (tags) payload.tags = tags.map((t: string) => t.trim()).filter(Boolean);
  if (cover_image_url) payload.cover_image_url = cover_image_url;
  if (gallery_image_urls) payload.gallery_image_urls = gallery_image_urls;

  const { error } = await supabase.from("outfits").update(payload).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Delete old images that are no longer used
  if (oldData) {
    const oldUrls = [oldData.cover_image_url, ...(oldData.gallery_image_urls || [])].filter(Boolean);
    const newUrls = [cover_image_url, ...(gallery_image_urls || [])].filter(Boolean);
    const removedUrls = oldUrls.filter((url: string) => !newUrls.includes(url));
    await deleteStorageFiles(supabase, removedUrls);
  }

  return Response.json({ success: true });
}

// DELETE outfit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Get images and item thumbnails to delete from storage
  const { data: outfit } = await supabase.from("outfits").select("cover_image_url, gallery_image_urls").eq("id", id).single();
  const { data: items } = await supabase.from("outfit_items").select("thumbnail_url").eq("outfit_id", id);

  const { error } = await supabase.from("outfits").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Clean up storage
  const urls = [
    outfit?.cover_image_url,
    ...(outfit?.gallery_image_urls || []),
    ...(items || []).map((i: any) => i.thumbnail_url),
  ].filter(Boolean);
  await deleteStorageFiles(supabase, urls);

  return Response.json({ success: true });
}
