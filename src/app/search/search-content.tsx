"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { OutfitCard } from "@/components/outfit-card";
import { SearchBar } from "@/components/search-bar";
import { FadeIn } from "@/components/ui/fade-in";
import { getOutfits } from "@/lib/supabase";
import type { Outfit } from "@/lib/supabase";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setOutfits([]);
      setTotal(0);
      return;
    }

    async function search() {
      setLoading(true);
      const result = await getOutfits({
        search: query,
        limit: 20,
      });
      setOutfits(result.outfits);
      setTotal(result.total);
      setLoading(false);
    }

    search();
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Search input */}
      <div className="mb-8">
        <h1
          className="mb-4 text-2xl font-bold tracking-tight text-warm-white md:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Hasil Pencarian
        </h1>
        <div className="max-w-xl">
          <SearchBar />
        </div>
        {query && (
          <p className="mt-3 text-sm text-warm-white/40">
            {loading
              ? "Mencari..."
              : `${total} hasil untuk "${query}"`}
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
            />
          ))}
        </div>
      ) : outfits.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {outfits.map((outfit, i) => (
            <FadeIn
              key={outfit.id}
              direction="up"
              delay={(i % 8) * 70}
              distance={28}
            >
              <OutfitCard outfit={outfit} />
            </FadeIn>
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-warm-white/5 p-6">
            <SearchIcon size={32} className="text-warm-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-warm-white">
            Tidak ada hasil
          </h3>
          <p className="mt-1 max-w-xs text-sm text-warm-white/40">
            Coba kata kunci lain, misalnya &quot;casual&quot;, &quot;kampus&quot;, atau
            &quot;celana cargo&quot;.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-warm-white/5 p-6">
            <SearchIcon size={32} className="text-warm-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-warm-white">
            Cari outfit favoritmu
          </h3>
          <p className="mt-1 max-w-xs text-sm text-warm-white/40">
            Ketik nama outfit, kategori, style, atau occasion untuk
            menemukan inspirasi.
          </p>
        </div>
      )}
    </div>
  );
}
