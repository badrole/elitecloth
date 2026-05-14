"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "elite123") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
    } else {
      alert("PIN Salah!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
  };

  if (!mounted) return null; // Prevent hydration mismatch

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-warm-white">
        <div className="w-full max-w-sm rounded-2xl border border-border-subtle bg-surface-elevated/80 p-6 text-center backdrop-blur-md">
          <h1 className="mb-6 text-2xl font-bold font-heading">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Masukkan PIN Admin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-ink-black px-4 py-3 text-warm-white placeholder:text-warm-white/30 focus:border-shopee-orange focus:outline-none"
              required
            />
            <button type="submit" className="w-full rounded-xl bg-warm-white py-3 font-semibold text-ink-black hover:bg-white transition-colors">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-warm-white">
      {/* Top Nav */}
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
