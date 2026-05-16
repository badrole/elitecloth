"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  outfitId: string;
  className?: string;
}

export function WishlistButton({ outfitId, className }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWishlist(outfitId));
    const handler = () => setSaved(isInWishlist(outfitId));
    window.addEventListener("wishlist-change", handler);
    return () => window.removeEventListener("wishlist-change", handler);
  }, [outfitId]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const newState = toggleWishlist(outfitId);
        setSaved(newState);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-ink-black/60 backdrop-blur-md transition-all",
        saved ? "text-shopee-orange" : "text-warm-white/50 hover:text-warm-white",
        className
      )}
      aria-label={saved ? "Hapus dari wishlist" : "Tambah ke wishlist"}
    >
      <Heart size={14} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
