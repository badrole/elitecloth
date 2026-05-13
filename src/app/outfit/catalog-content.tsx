"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { OutfitCard } from "@/components/outfit-card";
import { getOutfits, getAllCategories, getAllTags } from "@/lib/supabase";
import { categoryLabel, priceRangeLabel } from "@/lib/helpers";
import type { Outfit } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { value: "", label: "Semua Harga" },
  { value: "0-200000", label: "< Rp 200rb" },
  { value: "200000-500000", label: "Rp 200rb - 500rb" },
  { value: "500000-1000000", label: "Rp 500rb - 1jt" },
  { value: "1000000-999999999", label: "> Rp 1jt" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "popular", label: "Populer" },
  { value: "price_asc", label: "Harga ↑" },
  { value: "price_desc", label: "Harga ↓" },
];

export function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Read filters from URL
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const price = searchParams.get("price") ?? "";
  const sort = (searchParams.get("sort") as "newest" | "popular" | "price_asc" | "price_desc") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1");

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      // Reset to page 1 when changing filters
      if (!updates.page) params.delete("page");
      router.push(`/outfit?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [minPrice, maxPrice] = price
        ? price.split("-").map(Number)
        : [undefined, undefined];

      const result = await getOutfits({
        category: category || undefined,
        tag: tag || undefined,
        minPrice,
        maxPrice,
        sort,
        page,
        limit: 12,
      });

      setOutfits(result.outfits);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setLoading(false);
    }

    fetchData();
  }, [category, tag, price, sort, page]);

  // Fetch categories + tags once
  useEffect(() => {
    getAllCategories().then(setCategories);
    getAllTags().then(setTags);
  }, []);

  const activeFilters =
    (category ? 1 : 0) + (tag ? 1 : 0) + (price ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight text-warm-white md:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Katalog Outfit
        </h1>
        <p className="mt-2 text-sm text-warm-white/40">
          {total} outfit tersedia
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn(
            "btn-pill border text-xs md:hidden",
            activeFilters > 0
              ? "border-shopee-orange bg-shopee-orange/10 text-shopee-orange"
              : "border-border-subtle bg-transparent text-warm-white/60"
          )}
        >
          <SlidersHorizontal size={14} />
          Filter {activeFilters > 0 && `(${activeFilters})`}
        </button>

        {/* Desktop filter chips */}
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-warm-white/30">Kategori:</span>
            {(categories.length > 0
              ? categories
              : ["kampus", "casual", "semi-formal", "nongkrong"]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateParams({ category: category === cat ? "" : cat })
                }
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  category === cat
                    ? "bg-warm-white text-ink-black"
                    : "border border-border-subtle text-warm-white/50 hover:border-border-hover hover:text-warm-white"
                )}
              >
                {categoryLabel(cat)}
              </button>
            ))}
          </div>

          {/* Price range */}
          <div className="ml-3 flex items-center gap-1.5">
            <span className="text-xs text-warm-white/30">Harga:</span>
            {PRICE_RANGES.slice(1).map((pr) => (
              <button
                key={pr.value}
                onClick={() =>
                  updateParams({ price: price === pr.value ? "" : pr.value })
                }
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  price === pr.value
                    ? "bg-warm-white text-ink-black"
                    : "border border-border-subtle text-warm-white/50 hover:border-border-hover hover:text-warm-white"
                )}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-warm-white/30">Urut:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParams({ sort: opt.value })}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                sort === opt.value
                  ? "bg-warm-white/10 text-warm-white"
                  : "text-warm-white/30 hover:text-warm-white/60"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile filter panel */}
      {filtersOpen && (
        <div className="mb-6 rounded-2xl border border-border-subtle bg-surface-elevated p-4 md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-warm-white">Filter</h3>
            <button onClick={() => setFiltersOpen(false)}>
              <X size={16} className="text-warm-white/40" />
            </button>
          </div>

          {/* Category */}
          <div className="mb-4">
            <p className="mb-2 text-xs text-warm-white/30">Kategori</p>
            <div className="flex flex-wrap gap-2">
              {(categories.length > 0
                ? categories
                : ["kampus", "casual", "semi-formal", "nongkrong"]
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    updateParams({ category: category === cat ? "" : cat })
                  }
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    category === cat
                      ? "bg-warm-white text-ink-black"
                      : "border border-border-subtle text-warm-white/50"
                  )}
                >
                  {categoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="mb-2 text-xs text-warm-white/30">Harga Total</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((pr) => (
                <button
                  key={pr.value}
                  onClick={() =>
                    updateParams({ price: price === pr.value ? "" : pr.value })
                  }
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    price === pr.value
                      ? "bg-warm-white text-ink-black"
                      : "border border-border-subtle text-warm-white/50"
                  )}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="mb-2 text-xs text-warm-white/30">Style</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => updateParams({ tag: tag === t ? "" : t })}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                      tag === t
                        ? "bg-warm-white text-ink-black"
                        : "border border-border-subtle text-warm-white/50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active filter badges */}
      {activeFilters > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {category && (
            <span className="flex items-center gap-1 rounded-full bg-warm-white/10 px-3 py-1 text-xs text-warm-white">
              {categoryLabel(category)}
              <button onClick={() => updateParams({ category: "" })}>
                <X size={12} />
              </button>
            </span>
          )}
          {tag && (
            <span className="flex items-center gap-1 rounded-full bg-warm-white/10 px-3 py-1 text-xs text-warm-white">
              {tag}
              <button onClick={() => updateParams({ tag: "" })}>
                <X size={12} />
              </button>
            </span>
          )}
          {price && (
            <span className="flex items-center gap-1 rounded-full bg-warm-white/10 px-3 py-1 text-xs text-warm-white">
              {priceRangeLabel(price)}
              <button onClick={() => updateParams({ price: "" })}>
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={() => updateParams({ category: "", tag: "", price: "" })}
            className="text-xs text-warm-white/30 hover:text-warm-white"
          >
            Hapus semua
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
            />
          ))}
        </div>
      ) : outfits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 rounded-full bg-warm-white/5 p-6">
            <SlidersHorizontal size={32} className="text-warm-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-warm-white">
            Tidak ada outfit ditemukan
          </h3>
          <p className="mt-1 text-sm text-warm-white/40">
            Coba ubah filter atau cari dengan kata kunci lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={page <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-warm-white/40 transition-colors hover:border-border-hover hover:text-warm-white disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParams({ page: String(p) })}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                p === page
                  ? "bg-warm-white text-ink-black"
                  : "text-warm-white/40 hover:text-warm-white"
              )}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={page >= totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-warm-white/40 transition-colors hover:border-border-hover hover:text-warm-white disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
