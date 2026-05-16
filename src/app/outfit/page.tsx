import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogContent } from "./catalog-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katalog Outfit",
  description:
    "Jelajahi koleksi outfit cowok kuliah dari Elitecloth. Filter berdasarkan kategori, style, dan budget. Langsung terhubung ke Shopee dan TikTok Shop.",
  openGraph: {
    title: "Katalog Outfit | Elitecloth",
    description:
      "Koleksi outfit cowok kuliah terkurasi. Temukan gaya terbaikmu.",
  },
};

export default function OutfitCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl border border-border-subtle bg-surface-elevated"
              />
            ))}
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
