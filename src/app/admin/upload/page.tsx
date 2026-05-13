"use client";

import { OutfitForm } from "@/components/admin/outfit-form";

export default function AdminUploadPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2">Upload Etalase Baru</h1>
        <p className="text-warm-white/60 text-sm">Tambahkan outfit baru beserta link affiliate dari Shopee & TikTok.</p>
      </div>
      
      <div className="bg-surface-elevated rounded-2xl p-6 md:p-8 border border-border-subtle">
        <OutfitForm />
      </div>
    </div>
  );
}
