"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-white/40"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari outfit, kategori, atau style..."
        className="h-12 w-full rounded-2xl border border-border-subtle bg-surface-elevated pl-11 pr-4 text-sm text-warm-white placeholder:text-warm-white/30 focus:border-border-hover focus:outline-none focus:ring-1 focus:ring-warm-white/10"
        autoFocus
      />
    </form>
  );
}
