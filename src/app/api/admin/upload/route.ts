import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) return Response.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Only JPEG, PNG, and WebP allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  // Compress to WebP quality 80 — visually lossless, much smaller file
  const compressed = await sharp(rawBuffer)
    .webp({ quality: 80 })
    .toBuffer();

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const supabase = createAdminClient();
  const { error: uploadError } = await supabase.storage
    .from("outfits")
    .upload(fileName, compressed, { contentType: "image/webp" });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from("outfits").getPublicUrl(fileName);

  return Response.json({ url: publicUrl });
}
