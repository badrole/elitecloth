import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";
import type { Outfit } from "@/lib/supabase";
import { categoryLabel } from "@/lib/helpers";

interface OutfitCardProps {
  outfit: Outfit;
  priority?: boolean;
}

function isNew(createdAt: string): boolean {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
}

export function OutfitCard({ outfit, priority = false }: OutfitCardProps) {
  return (
    <Link
      href={`/outfit/${outfit.slug}`}
      className="card-glow group block overflow-hidden rounded-2xl border border-border-subtle bg-surface-card transition-all duration-300 hover:border-border-hover"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={outfit.cover_image_url}
          alt={outfit.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent" />

        {/* Tags */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-warm-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warm-white backdrop-blur-md"
          >
            {categoryLabel(outfit.category)}
          </Badge>
          {isNew(outfit.created_at) && (
            <Badge
              variant="secondary"
              className="rounded-full border-none bg-shopee-orange/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-shopee-orange backdrop-blur-md"
            >
              Baru
            </Badge>
          )}
        </div>

        {/* View count */}
        {outfit.view_count > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ink-black/60 px-2 py-1 backdrop-blur-md">
            <Eye size={10} className="text-warm-white/50" />
            <span className="text-[10px] font-medium text-warm-white/50">
              {outfit.view_count}
            </span>
          </div>
        )}

        {/* Wishlist */}
        <WishlistButton outfitId={outfit.id} className="absolute right-3 top-3" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="line-clamp-2 text-sm font-semibold leading-snug text-warm-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {outfit.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-warm-white/40">
          {outfit.description}
        </p>

        {/* Style tags */}
        {outfit.tags && outfit.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {outfit.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-warm-white/5 px-2 py-0.5 text-[10px] font-medium text-warm-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
