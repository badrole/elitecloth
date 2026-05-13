import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { OutfitCard } from "@/components/outfit-card";
import { Badge } from "@/components/ui/badge";
import { getOutfits, getAllCategories } from "@/lib/supabase";
import { categoryLabel } from "@/lib/helpers";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [latestResult, popularResult, categories] = await Promise.all([
    getOutfits({ sort: "newest", limit: 8 }),
    getOutfits({ sort: "popular", limit: 8 }),
    getAllCategories(),
  ]);

  const latestOutfits = latestResult.outfits;
  const popularOutfits = popularResult.outfits;

  // Pick hero outfit (most popular with image)
  const heroOutfit =
    popularOutfits[0] ?? latestOutfits[0];

  return (
    <>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <GridBackground className="relative min-h-[85vh] overflow-hidden">
        {/* Hero background image */}
        {heroOutfit && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroOutfit.cover_image_url}
              alt={heroOutfit.name}
              fill
              className="object-cover opacity-20 blur-sm"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-black/60 via-ink-black/80 to-ink-black" />
          </div>
        )}

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center md:px-8 md:py-32 lg:py-40">
          {/* Eyebrow */}
          <div className="animate-fade-up mb-6 flex items-center gap-2 rounded-full border border-border-subtle bg-warm-white/5 px-4 py-2 backdrop-blur-md">
            <Sparkles size={14} className="text-shopee-orange" />
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-white/60">
              Outfit Terkurasi oleh AI
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-warm-white md:text-6xl lg:text-7xl"
            style={{
              fontFamily: "var(--font-heading)",
              animationDelay: "0.1s",
            }}
          >
            Tampil Keren{" "}
            <span className="bg-gradient-to-r from-shopee-orange to-tiktok-red bg-clip-text text-transparent">
              Tanpa Ribet
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-warm-white/50 md:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Katalog outfit cowok kuliah low budget — sudah di-mix-and-match,
            langsung terhubung ke Shopee dan TikTok Shop.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/outfit"
              className="btn-pill bg-warm-white text-ink-black hover:bg-warm-white/90"
            >
              Jelajahi Outfit
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/outfit?sort=popular"
              className="btn-pill border border-border-subtle bg-transparent text-warm-white hover:border-border-hover"
            >
              <TrendingUp size={16} />
              Yang Lagi Trending
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up mt-16 grid grid-cols-3 gap-8 md:gap-16"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { value: `${latestResult.total}+`, label: "Outfit" },
              { value: "Rp 50rb", label: "Mulai Dari" },
              { value: "2", label: "Marketplace" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-warm-white md:text-3xl"
                   style={{ fontFamily: "var(--font-heading)" }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-warm-white/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </GridBackground>

      {/* ═══════════════════ KATEGORI CEPAT ═══════════════════ */}
      <section className="border-b border-border-subtle py-10">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
            <Zap size={16} className="shrink-0 text-shopee-orange" />
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-warm-white/40">
              Kategori:
            </span>
            {(categories.length > 0
              ? categories
              : [
                  "kampus",
                  "casual",
                  "semi-formal",
                  "nongkrong",
                  "olahraga",
                ]
            ).map((cat) => (
              <Link
                key={cat}
                href={`/outfit?category=${cat}`}
                className="shrink-0 rounded-full border border-border-subtle bg-warm-white/5 px-4 py-2 text-xs font-semibold text-warm-white/60 transition-all hover:border-border-hover hover:text-warm-white"
              >
                {categoryLabel(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ OUTFIT TERBARU ═══════════════════ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Badge
                variant="secondary"
                className="mb-3 rounded-full border-none bg-warm-white/5 text-[10px] font-semibold uppercase tracking-wider text-warm-white/40"
              >
                Baru Ditambahkan
              </Badge>
              <h2
                className="text-2xl font-bold tracking-tight text-warm-white md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Outfit Terbaru
              </h2>
            </div>
            <Link
              href="/outfit?sort=newest"
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-warm-white/40 transition-colors hover:text-warm-white"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {latestOutfits.length > 0 ? (
              latestOutfits.map((outfit, i) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  priority={i < 4}
                />
              ))
            ) : (
              // Empty state with placeholder
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PALING POPULER ═══════════════════ */}
      <section className="border-t border-border-subtle py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Badge
                variant="secondary"
                className="mb-3 rounded-full border-none bg-shopee-orange/10 text-[10px] font-semibold uppercase tracking-wider text-shopee-orange"
              >
                <TrendingUp size={10} className="mr-1" />
                Trending
              </Badge>
              <h2
                className="text-2xl font-bold tracking-tight text-warm-white md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Paling Populer
              </h2>
            </div>
            <Link
              href="/outfit?sort=popular"
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-warm-white/40 transition-colors hover:text-warm-white"
            >
              Lihat Semua
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {popularOutfits.length > 0 ? (
              popularOutfits.map((outfit, i) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  priority={i < 2}
                />
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════ */}
      <section className="border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8 md:py-28">
          <h2
            className="mx-auto max-w-lg text-2xl font-bold tracking-tight text-warm-white md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Outfit Keren, Harga{" "}
            <span className="text-shopee-orange">Mahasiswa</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-warm-white/40">
            Semua outfit sudah dikurasi dan dilengkapi link beli langsung.
            Tinggal pilih, klik, dan checkout di marketplace favoritmu.
          </p>
          <Link
            href="/outfit"
            className="btn-pill mt-8 inline-flex bg-warm-white text-ink-black hover:bg-warm-white/90"
          >
            Mulai Jelajahi
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
