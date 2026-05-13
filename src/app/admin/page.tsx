"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {
  const [outfits, setOutfits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("outfits")
      .select(`
        id, slug, name, category, cover_image_url, estimated_total_price,
        items:outfit_items(id, shopee_affiliate_url, tiktok_shop_affiliate_url)
      `)
      .order("created_at", { ascending: false });
    
    if (data) setOutfits(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus etalase "${name}"?`)) {
      const { error } = await supabase.from("outfits").delete().eq("id", id);
      if (error) {
        alert(`Gagal menghapus: ${error.message}`);
      } else {
        setOutfits((prev) => prev.filter((o) => o.id !== id));
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">Daftar Etalase</h1>
          <p className="text-warm-white/60">Kelola semua outfit yang ada di Elitecloth.</p>
        </div>
        <Link 
          href="/admin/upload" 
          className="flex items-center gap-2 bg-warm-white text-ink-black px-5 py-3 rounded-xl font-bold hover:bg-white transition-colors"
        >
          <Plus size={20} /> Tambah Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-surface-elevated rounded-2xl w-full"></div>
          ))}
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-20 bg-surface-elevated rounded-2xl border border-border-subtle">
          <p className="text-warm-white/60">Belum ada etalase.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border-subtle bg-surface-elevated">
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-ink-black rounded-lg overflow-hidden">
                <Image src={outfit.cover_image_url} alt={outfit.name} fill className="object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg truncate">{outfit.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-warm-white/10 rounded-full font-medium capitalize">{outfit.category}</span>
                  <span className="text-xs text-shopee-orange font-semibold">Rp {(outfit.estimated_total_price).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  {outfit.items?.[0]?.shopee_affiliate_url && <span className="text-shopee-orange">✓ Shopee</span>}
                  {outfit.items?.[0]?.tiktok_shop_affiliate_url && <span className="text-tiktok-red">✓ TikTok</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                <Link href={`/outfit/${outfit.slug}`} target="_blank" className="p-2 bg-warm-white/10 hover:bg-warm-white/20 rounded-lg transition-colors text-warm-white tooltip-trigger" title="Lihat">
                  <Eye size={18} />
                </Link>
                <Link href={`/admin/edit/${outfit.id}`} className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Edit">
                  <Edit size={18} />
                </Link>
                <button onClick={() => handleDelete(outfit.id, outfit.name)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Hapus">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
