import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Share2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AffiliateButton } from "@/components/affiliate-button";
import { OutfitCard } from "@/components/outfit-card";
import { ShareButton } from "./share-button";
import { ViewTracker } from "./view-tracker";
import { ImageGallery } from "./image-gallery";
import {
  getOutfitBySlug,
  getOutfitItems,
  getSimilarOutfits,
  getAllSlugs,
} from "@/lib/supabase";
import { categoryLabel } from "@/lib/helpers";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { outfit } = await getOutfitBySlug(slug);

  if (!outfit) return { title: "Outfit Tidak Ditemukan" };

  return {
    title: outfit.name,
    description: `${outfit.description} Beli langsung di Shopee atau TikTok Shop.`,
    openGraph: {
      title: `${outfit.name} | Elitecloth`,
      description: outfit.description,
      images: [{ url: outfit.cover_image_url, width: 600, height: 800 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: outfit.name,
      description: outfit.description,
      images: [outfit.cover_image_url],
    },
  };
}

export default async function OutfitDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [{ outfit }, ] = await Promise.all([
    getOutfitBySlug(slug),
  ]);

  if (!outfit) notFound();

  const [{ items }, { outfits: similarOutfits }] = await Promise.all([
    getOutfitItems(outfit.id),
    getSimilarOutfits(outfit),
  ]);

  return (
    <>
      <ViewTracker outfitId={outfit.id} />

      <article className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        {/* Back link */}
        <Link
          href="/outfit"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-white/40 transition-colors hover:text-warm-white"
        >
          <ArrowLeft size={14} />
          Kembali ke Katalog
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ── Left: Images Slider ── */}
          <div className="space-y-4">
            <ImageGallery 
              coverImage={outfit.cover_image_url}
              galleryImages={outfit.gallery_image_urls}
              name={outfit.name}
            />
          </div>

          {/* ── Right: Info ── */}
          <div>
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="rounded-full border-none bg-warm-white/10 text-[10px] font-semibold uppercase tracking-wider text-warm-white"
              >
                {categoryLabel(outfit.category)}
              </Badge>
              {outfit.occasion && (
                <Badge
                  variant="secondary"
                  className="rounded-full border-none bg-warm-white/5 text-[10px] font-semibold uppercase tracking-wider text-warm-white/60"
                >
                  {outfit.occasion}
                </Badge>
              )}
            </div>

            {/* Name */}
            <h1
              className="text-2xl font-bold leading-tight tracking-tight text-warm-white md:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {outfit.name}
            </h1>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-warm-white/50">
              {outfit.description}
            </p>

            {/* Price section removed */}

            {/* Tags */}
            {outfit.tags && outfit.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                <Tag size={14} className="text-warm-white/20" />
                {outfit.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/outfit?tag=${tag}`}
                    className="rounded-full bg-warm-white/5 px-3 py-1 text-xs font-medium text-warm-white/40 transition-colors hover:bg-warm-white/10 hover:text-warm-white/70"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-6">
              <ShareButton
                title={outfit.name}
                text={`Cek outfit "${outfit.name}" di Elitecloth!`}
                slug={outfit.slug}
              />
            </div>

            {/* ── Item breakdown ── */}
            <div className="mt-8">
              <h2
                className="mb-4 text-lg font-semibold tracking-tight text-warm-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Item dalam Outfit
              </h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-border-subtle bg-surface-card p-4 transition-colors hover:border-border-hover"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border-subtle">
                      <Image
                        src={item.thumbnail_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-warm-white/30">
                          {item.item_type}
                        </span>
                        <h3 className="text-sm font-semibold text-warm-white">
                          {item.name}
                        </h3>
                        {/* Price removed */}
                      </div>

                      {/* Affiliate buttons */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <AffiliateButton
                          outfitId={outfit.id}
                          itemId={item.id}
                          marketplace="shopee"
                          url={item.shopee_affiliate_url}
                          className="text-xs px-4 py-2"
                        />
                        <AffiliateButton
                          outfitId={outfit.id}
                          itemId={item.id}
                          marketplace="tiktok_shop"
                          url={item.tiktok_shop_affiliate_url}
                          className="text-xs px-4 py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>

        {/* ═══ Outfit Serupa ═══ */}
        {similarOutfits.length > 0 && (
          <section className="mt-16 border-t border-border-subtle pt-12">
            <h2
              className="mb-6 text-xl font-bold tracking-tight text-warm-white md:text-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Outfit Serupa
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {similarOutfits.map((o) => (
                <OutfitCard key={o.id} outfit={o} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
