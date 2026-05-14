"use client";

import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen text-warm-white">
      <div className="border-b border-border-subtle bg-surface-elevated/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-warm-white/50 hover:text-warm-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <Link href="/admin" className="font-bold text-lg font-heading">
              Admin Panel
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
