"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminTapLogo() {
  const tapCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();

  function handleTap() {
    tapCount.current++;
    if (timer.current) clearTimeout(timer.current);
    if (tapCount.current >= 10) {
      tapCount.current = 0;
      router.push("/admin/login");
      return;
    }
    timer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 3000);
  }

  return (
    <div className="animate-scale-in animate-float-slow" onClick={handleTap}>
      <Image
        src="/logo/logo.png"
        alt="Elitecloth"
        width={720}
        height={720}
        priority
        className="h-auto w-[min(80vw,520px)] select-none drop-shadow-[0_20px_60px_rgba(245,240,232,0.08)]"
      />
    </div>
  );
}
