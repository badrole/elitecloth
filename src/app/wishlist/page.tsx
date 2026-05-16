"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { OutfitCard } from "@/components/outfit-card";
import { getWishlist } from "@/lib/wishlist";
import { supabase } from "@/lib/supabase";
import type { Outfit } from "@/lib/supabase";

export default function WishlistPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      const ids = getWishlist();
      if (ids.length === 0) {
        setOutfits([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("outfits")
        .select("*")
        .in("id", ids)
        .eq("published", true);
      setOutfits((data as Outfit[]) ?? []);
      setLoading(false);
    }
    fetchWishlist();
    const handler = () => fetchWishlist();
    window.addEventListener("wishlist-change", handler);
    return () => window.removeEventListener("wishlist-change", handler);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <h1
        className="text-3xl font-bold tracking-tight text-warm-white md:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Wishlist
      </h1>
      <p className="mt-2 text-sm text-warm-white/40">
        Outfit yang kamu simpan
      </p>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated" />
          ))}
        </div>
      ) : outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-warm-white/5 p-6">
            <Heart size={32} className="text-warm-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-warm-white">Belum ada outfit disimpan</h3>
          <p className="mt-1 text-sm text-warm-white/40">Tap ❤️ di outfit yang kamu suka untuk menyimpannya.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
}
