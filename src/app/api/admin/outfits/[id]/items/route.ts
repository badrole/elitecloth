import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// POST create/update items for an outfit
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: outfitId } = await params;
  const supabase = createAdminClient();
  const body = await request.json().catch(() => null);
  if (!body?.items || !Array.isArray(body.items)) {
    return Response.json({ error: "Items array required" }, { status: 400 });
  }

  const results = [];
  for (let i = 0; i < body.items.length; i++) {
    const item = body.items[i];
    const payload = {
      outfit_id: outfitId,
      name: (item.name || item.item_type || "Item").slice(0, 200),
      item_type: item.item_type || "atasan",
      thumbnail_url: item.thumbnail_url || "",
      estimated_price: 0,
      shopee_affiliate_url: item.shopee_affiliate_url || null,
      tiktok_shop_affiliate_url: item.tiktok_shop_affiliate_url || null,
      position: i,
    };

    if (item.id) {
      const { error } = await supabase.from("outfit_items").update(payload).eq("id", item.id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      results.push({ id: item.id, action: "updated" });
    } else {
      const { data, error } = await supabase.from("outfit_items").insert(payload).select("id").single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      results.push({ id: data.id, action: "created" });
    }
  }

  // Delete items not in the list
  if (body.deleteIds && Array.isArray(body.deleteIds) && body.deleteIds.length > 0) {
    await supabase.from("outfit_items").delete().in("id", body.deleteIds);
  }

  return Response.json({ results });
}
