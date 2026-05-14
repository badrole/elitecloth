import { createAdminClient } from "@/lib/supabase-server";

export async function POST() {
  const supabase = createAdminClient();

  // 1. Get all image URLs from database
  const { data: outfits } = await supabase.from("outfits").select("cover_image_url, gallery_image_urls");
  const { data: items } = await supabase.from("outfit_items").select("thumbnail_url");

  const usedUrls = new Set<string>();
  (outfits || []).forEach((o: any) => {
    if (o.cover_image_url) usedUrls.add(o.cover_image_url);
    (o.gallery_image_urls || []).forEach((url: string) => usedUrls.add(url));
  });
  (items || []).forEach((i: any) => {
    if (i.thumbnail_url) usedUrls.add(i.thumbnail_url);
  });

  // Extract file paths from URLs that are in our storage
  const usedPaths = new Set<string>();
  usedUrls.forEach((url) => {
    const match = url.match(/\/storage\/v1\/object\/public\/outfits\/(.+)$/);
    if (match) usedPaths.add(match[1]);
  });

  // 2. List all files in storage bucket
  const { data: storageFiles, error } = await supabase.storage.from("outfits").list("", { limit: 1000 });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  // 3. Find orphaned files (in storage but not in database)
  const orphaned = (storageFiles || [])
    .filter((f) => !f.id?.endsWith("/") && !usedPaths.has(f.name))
    .map((f) => f.name);

  if (orphaned.length === 0) {
    return Response.json({ message: "Tidak ada file orphan", deleted: 0 });
  }

  // 4. Delete orphaned files
  const { error: deleteError } = await supabase.storage.from("outfits").remove(orphaned);
  if (deleteError) return Response.json({ error: deleteError.message }, { status: 500 });

  return Response.json({ message: `Berhasil hapus ${orphaned.length} file orphan`, deleted: orphaned.length, files: orphaned });
}
