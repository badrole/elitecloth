import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import { OutfitCard } from "@/components/outfit-card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
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

  return (
    <>
      {/* ═══════════════════ HERO — BIG LOGO ═══════════════════ */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-20 md:py-28">
        {/* Soft radial halo behind logo */}
        <div
          aria-hidden="true"
          className="animate-glow-pulse pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[70vw] max-h-[600px] w-[70vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(238, 77, 45, 0.12) 0%, rgba(254, 44, 85, 0.06) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Big Elitecloth Logo */}
          <div className="animate-scale-in animate-float-slow">
            <Image
              src="/logo/logo.png"
              alt="Elitecloth"
              width={720}
              height={720}
              priority
              className="h-auto w-[min(80vw,520px)] select-none drop-shadow-[0_20px_60px_rgba(245,240,232,0.08)]"
            />
          </div>

          {/* Optional minimal tagline below the logo */}
          <p
            className="animate-fade-up mt-6 max-w-md text-sm font-medium uppercase tracking-[0.3em] text-warm-white/40 md:text-base"
            style={{ animationDelay: "0.5s", animationFillMode: "both" }}
          >
            Tampil Keren · Tanpa Ribet
          </p>
        </div>

        {/* Scroll cue */}
        <div
          className="animate-fade-up absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animationDelay: "0.9s", animationFillMode: "both" }}
        >
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-warm-white/15 p-1">
            <span className="block h-2 w-1 animate-bounce rounded-full bg-warm-white/40" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ KATEGORI CEPAT ═══════════════════ */}
      <FadeIn direction="up">
        <section className="border-b border-border-subtle py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="hide-scrollbar flex items-center gap-3 overflow-x-auto pb-2">
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
      </FadeIn>

      {/* ═══════════════════ OUTFIT TERBARU ═══════════════════ */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <FadeIn direction="up">
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
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {latestOutfits.length > 0
              ? latestOutfits.map((outfit, i) => (
                  <FadeIn
                    key={outfit.id}
                    direction="up"
                    delay={i * 80}
                    distance={28}
                  >
                    <OutfitCard outfit={outfit} priority={i < 4} />
                  </FadeIn>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PALING POPULER ═══════════════════ */}
      <section className="border-t border-border-subtle py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <FadeIn direction="up">
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
          </FadeIn>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {popularOutfits.length > 0
              ? popularOutfits.map((outfit, i) => (
                  <FadeIn
                    key={outfit.id}
                    direction="up"
                    delay={i * 80}
                    distance={28}
                  >
                    <OutfitCard outfit={outfit} priority={i < 2} />
                  </FadeIn>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════ */}
      <FadeIn direction="up" distance={32}>
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
      </FadeIn>
    </>
  );
}
