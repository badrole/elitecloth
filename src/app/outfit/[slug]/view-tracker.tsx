"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "@/lib/supabase";

export function ViewTracker({ outfitId }: { outfitId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    incrementViewCount(outfitId);
  }, [outfitId]);

  return null;
}
