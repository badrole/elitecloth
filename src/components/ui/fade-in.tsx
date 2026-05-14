"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Animation delay in milliseconds (used for staggered grid reveals). */
  delay?: number;
  /** Direction the element travels in from. Default: up. */
  direction?: Direction;
  /** Distance in px the element travels. Default: 24. */
  distance?: number;
  /** Duration in ms. Default: 700. */
  duration?: number;
  /** IntersectionObserver threshold. Default: 0.12. */
  threshold?: number;
  /** Trigger only once (default true) or every time the element enters viewport. */
  once?: boolean;
  /** Render as inline-block / block etc. */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * FadeIn — scroll-triggered fade/slide reveal. Lightweight, no deps.
 * Uses IntersectionObserver to add an `in-view` class once the element is visible.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 700,
  threshold = 0.12,
  once = true,
  as: Tag = "div",
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect users who prefer reduced motion.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const hiddenTransform = (() => {
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      case "scale":
        return `scale(0.94)`;
      case "none":
      default:
        return "none";
    }
  })();

  // Cast to satisfy TS for dynamic intrinsic element ref.
  const TagAny = Tag as unknown as React.ElementType;

  return (
    <TagAny
      ref={ref as React.Ref<HTMLElement>}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : hiddenTransform,
        willChange: "opacity, transform",
      }}
      className={cn(className)}
    >
      {children}
    </TagAny>
  );
}
