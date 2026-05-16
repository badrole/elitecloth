"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { OutfitCard } from "@/components/outfit-card";
import { FadeIn } from "@/components/ui/fade-in";
import { getOutfits, getAllCategories, getAllTags } from "@/lib/supabase";
import { categoryLabel } from "@/lib/helpers";
import type { Outfit } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "popular", label: "Populer" },
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
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Read filters from URL
  const category = searchParams.get("category") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const sort = (searchParams.get("sort") as "newest" | "popular") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1");

  const loadNextPage = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const result = await getOutfits({
      category: category || undefined,
      tag: tag || undefined,
      sort,
      page: nextPage,
      limit: 12,
    });
    setOutfits((prev) => [...prev, ...result.outfits]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    window.history.replaceState(null, "", `/outfit?${params.toString()}`);
    setLoadingMore(false);
  }, [loadingMore, page, totalPages, category, tag, sort, searchParams]);

  // Intersection Observer for infinite scroll on mobile
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNextPage]);

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

      const result = await getOutfits({
        category: category || undefined,
        tag: tag || undefined,
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
  }, [category, tag, sort, page]);

  // Fetch categories + tags once
  useEffect(() => {
    getAllCategories().then(setCategories);
    getAllTags().then(setTags);
  }, []);

  const activeFilters =
    (category ? 1 : 0) + (tag ? 1 : 0);

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
          <button
            onClick={() => updateParams({ category: "", tag: "" })}
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
        <>
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

          {/* Infinite scroll trigger (mobile) / Load more */}
          {page < totalPages && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {loadingMore ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-white/20 border-t-warm-white/60" />
              ) : (
                <button
                  onClick={() => loadNextPage()}
                  className="btn-pill border border-border-subtle bg-transparent text-xs text-warm-white/60 hover:border-border-hover hover:text-warm-white md:inline-flex hidden"
                >
                  Muat lebih banyak
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Pagination (desktop only) */}
      {totalPages > 1 && (
        <div className="mt-10 hidden items-center justify-center gap-2 md:flex">
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
