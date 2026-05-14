"use client";

import { useEffect, useState } from "react";
import { OutfitForm } from "@/components/admin/outfit-form";
import { useParams } from "next/navigation";

export default function AdminEditPage() {
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/admin/outfits/${id}`);
      if (res.ok) {
        setInitialData(await res.json());
      }
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  if (isLoading) return <div className="text-center py-20">Memuat data...</div>;
  if (!initialData) return <div className="text-center py-20 text-red-400">Etalase tidak ditemukan.</div>;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2">Edit Etalase</h1>
        <p className="text-warm-white/60 text-sm">Update informasi outfit, harga, dan link affiliate.</p>
      </div>
      <div className="bg-surface-elevated rounded-2xl p-6 md:p-8 border border-border-subtle">
        <OutfitForm initialData={initialData} isEdit={true} />
      </div>
    </div>
  );
}
