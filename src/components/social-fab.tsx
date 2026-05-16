"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const socialLinks = [
  {
    id: "tiktok",
    href: "https://tiktok.com/@elcloth.storee",
    label: "TikTok",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.61a8.24 8.24 0 0 0 4.76 1.52V6.69h-1z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    href: "https://instagram.com/elcloth.store",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "shopee",
    href: "https://collshp.com/elcloth",
    label: "Shopee",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 7.5c-0.2-1.3-1.3-2.3-2.6-2.5-0.1 0-0.3 0-0.4 0H10.6C9.2 5.1 8.1 6.2 8 7.5c0 0.1 0 0.2 0 0.3v0.7h8.5V7.5zM10.6 3.5h2.9c2 0.2 3.6 1.7 3.8 3.7v0.6h2.9c0.4 0 0.8 0.3 0.8 0.8v0.3l-1.9 10.5c-0.1 0.7-0.7 1.2-1.4 1.2H6.3C5.6 20.6 5 20.1 4.9 19.4L3 8.9v-0.3c0-0.4 0.3-0.8 0.8-0.8h2.9V7.2c0.2-2 1.8-3.5 3.8-3.7z" />
      </svg>
    ),
  },
];

export function SocialFAB() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-24 right-6 z-50 flex flex-col-reverse items-center gap-3 md:bottom-8 md:right-8">
      {/* Main FAB button with animated aura */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-surface-elevated shadow-lg backdrop-blur-xl transition-colors hover:border-border-hover"
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
        aria-label="Social links"
      >
        {/* Animated aura border */}
        <span className="absolute inset-[-3px] rounded-full animate-aura-spin bg-[conic-gradient(from_0deg,transparent,var(--color-shopee-orange),transparent,var(--color-shopee-orange),transparent)] opacity-60" />
        <span className="absolute inset-[1px] rounded-full bg-surface-elevated" />
        <motion.div
          className="relative z-10"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="/logo/logo.png"
            alt="Elitecloth"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain"
          />
        </motion.div>
      </motion.button>

      {/* Expanded icons */}
      <AnimatePresence>
        {open &&
          socialLinks.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 20 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-warm-white/70 shadow-md transition-colors hover:border-border-hover hover:text-warm-white"
              aria-label={link.label}
            >
              {link.icon}
            </motion.a>
          ))}
      </AnimatePresence>
    </div>
  );
}
