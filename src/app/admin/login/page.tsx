"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      window.location.href = "/admin";
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-warm-white">
      <div className="w-full max-w-sm rounded-2xl border border-border-subtle bg-surface-elevated/80 p-6 text-center backdrop-blur-md">
        <h1 className="mb-6 text-2xl font-bold font-heading">Admin Login</h1>
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Masukkan Password Admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-ink-black px-4 py-3 text-warm-white placeholder:text-warm-white/30 focus:border-shopee-orange focus:outline-none"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-warm-white py-3 font-semibold text-ink-black hover:bg-white transition-colors disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
