"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutGrid, Search, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const dockItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutGrid, label: "Katalog", href: "/outfit" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
];

export function MobileDock() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-ink-black/90 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {dockItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors",
                isActive ? "text-warm-white" : "text-warm-white/40"
              )}
              aria-label={item.label}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[9px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -top-0.5 h-0.5 w-6 rounded-full bg-warm-white"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
