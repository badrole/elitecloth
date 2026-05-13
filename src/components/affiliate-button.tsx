"use client";

import { logAffiliateClick } from "@/lib/supabase";
import { generateSessionId } from "@/lib/helpers";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AffiliateBtnProps {
  outfitId: string;
  itemId: string;
  marketplace: "shopee" | "tiktok_shop";
  url: string | null;
  label?: string;
  className?: string;
}

export function AffiliateButton({
  outfitId,
  itemId,
  marketplace,
  url,
  label,
  className,
}: AffiliateBtnProps) {
  const isShopee = marketplace === "shopee";
  const disabled = !url;

  const defaultLabel = isShopee
    ? "Beli di Shopee"
    : "Beli di TikTok Shop";

  const handleClick = async () => {
    if (!url) return;

    // Log to Supabase BEFORE redirect (PRD requirement)
    try {
      await logAffiliateClick({
        outfit_id: outfitId,
        item_id: itemId,
        marketplace,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        session_id: generateSessionId(),
      });
    } catch {
      // Fail silently — don't block the redirect
    }

    // Open affiliate link in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (disabled) {
    return (
      <button
        disabled
        className={cn(
          "btn-pill cursor-not-allowed opacity-40",
          isShopee
            ? "border border-shopee-orange/20 bg-shopee-orange/5 text-shopee-orange/40"
            : "border border-warm-white/10 bg-warm-white/5 text-warm-white/30",
          className
        )}
      >
        Stok Habis
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "btn-pill",
        isShopee
          ? "bg-shopee-orange text-white hover:bg-shopee-orange/90 glow-shopee"
          : "bg-ink-black text-warm-white border border-warm-white/20 hover:border-tiktok-red hover:text-tiktok-red glow-tiktok",
        className
      )}
    >
      {isShopee ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 7.5c-0.2-1.3-1.3-2.3-2.6-2.5-0.1 0-0.3 0-0.4 0H10.6C9.2 5.1 8.1 6.2 8 7.5c0 0.1 0 0.2 0 0.3v0.7h8.5V7.5zM10.6 3.5h2.9c2 0.2 3.6 1.7 3.8 3.7v0.6h2.9c0.4 0 0.8 0.3 0.8 0.8v0.3l-1.9 10.5c-0.1 0.7-0.7 1.2-1.4 1.2H6.3C5.6 20.6 5 20.1 4.9 19.4L3 8.9v-0.3c0-0.4 0.3-0.8 0.8-0.8h2.9V7.2c0.2-2 1.8-3.5 3.8-3.7zM15 11.2c0-0.4-0.3-0.8-0.8-0.8H9.8c-0.4 0-0.8 0.3-0.8 0.8s0.3 0.8 0.8 0.8h3.3c0.9 0 1.6 0.7 1.6 1.6 0 0.9-0.7 1.6-1.6 1.6H9.4c-0.4 0-0.8 0.4-0.8 0.8s0.4 0.8 0.8 0.8h3.7c1.7 0 3.2-1.4 3.2-3.2 0-1.7-1.4-3.2-3.2-3.2h-3.3c-0.1 0-0.1-0.1-0.1-0.1 0-0.1 0.1-0.1 0.1-0.1h4.4C14.7 12 15 11.6 15 11.2z"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.61a8.24 8.24 0 0 0 4.76 1.52V6.69h-1z"/>
        </svg>
      )}
      <span>{label ?? defaultLabel}</span>
      <ExternalLink size={12} className="opacity-50" />
    </button>
  );
}
