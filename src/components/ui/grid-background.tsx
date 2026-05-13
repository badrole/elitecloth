"use client";

import { cn } from "@/lib/utils";

export function GridBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Dot texture */}
      <div className="pointer-events-none absolute inset-0 z-0 dot-texture" />
      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-0 z-0 grid-background" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
