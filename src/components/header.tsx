"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/outfit", label: "Katalog" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-warm-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-xl tracking-[-0.02em]">ELITECLOTH</span>
        </Link>

        {/* Desktop: Nav + Search */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200",
                pathname === link.href
                  ? "text-warm-white"
                  : "text-warm-white/50 hover:text-warm-white/80"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-warm-white" />
              )}
            </Link>
          ))}

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari outfit..."
              className="w-48 rounded-full border border-border-subtle bg-warm-white/5 py-2 pl-9 pr-3 text-xs text-warm-white placeholder:text-warm-white/30 focus:w-64 focus:border-border-hover focus:outline-none transition-all"
            />
          </form>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-warm-white/60 transition-colors hover:border-border-hover hover:text-warm-white md:hidden"
          aria-label="Menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-b border-border-subtle bg-ink-black/95 px-4 py-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "text-sm font-semibold uppercase tracking-[0.1em]",
                  pathname === link.href
                    ? "text-warm-white"
                    : "text-warm-white/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
