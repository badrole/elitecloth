"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search-bar";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/outfit", label: "Katalog" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
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
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-warm-white/60 transition-colors hover:border-border-hover hover:text-warm-white"
            aria-label="Cari outfit"
          >
            <Search size={18} />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-warm-white/60 transition-colors hover:border-border-hover hover:text-warm-white md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="border-b border-border-subtle bg-ink-black/95 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="mx-auto max-w-2xl">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

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
