import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p
        className="text-7xl font-bold text-warm-white/10"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        404
      </p>
      <h1
        className="mt-4 text-2xl font-bold text-warm-white"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 text-sm text-warm-white/40">
        Outfit yang kamu cari mungkin sudah dihapus atau belum tersedia.
      </p>
      <Link
        href="/"
        className="btn-pill mt-8 border border-border-subtle bg-transparent text-warm-white hover:border-border-hover"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
