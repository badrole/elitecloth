import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchContent } from "./search-content";

export const metadata: Metadata = {
  title: "Hasil Pencarian",
  description: "Cari outfit di Elitecloth. Temukan kombinasi pakaian terbaik sesuai gaya dan budgetmu.",
};

export default function SearchPage() {
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
      <SearchContent />
    </Suspense>
  );
}
