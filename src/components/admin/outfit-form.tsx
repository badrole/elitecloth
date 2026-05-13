"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, UploadCloud, Plus, Save, Trash2, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface OutfitFormProps {
  initialData?: any;
  isEdit?: boolean;
}

type OutfitItemForm = {
  id?: string;
  type: string;
  name: string;
  shopeeUrl: string;
  tiktokUrl: string;
  file?: File | null;
  previewUrl?: string;
  thumbnail_url?: string;
};

export function OutfitForm({ initialData, isEdit = false }: OutfitFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  // Form states
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "casual");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  
  // Image states for Main Outfit
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Items State
  const [items, setItems] = useState<OutfitItemForm[]>(() => {
    if (initialData?.items && initialData.items.length > 0) {
      return initialData.items.map((i: any) => ({
        id: i.id,
        type: i.item_type || "atasan",
        name: i.name,
        shopeeUrl: i.shopee_affiliate_url || "",
        tiktokUrl: i.tiktok_shop_affiliate_url || "",
        thumbnail_url: i.thumbnail_url || "",
      }));
    }
    return [
      { type: "atasan", name: "Atasan", shopeeUrl: "", tiktokUrl: "" },
      { type: "bawahan", name: "Bawahan", shopeeUrl: "", tiktokUrl: "" },
      { type: "sepatu", name: "Sepatu", shopeeUrl: "", tiktokUrl: "" },
      { type: "aksesoris", name: "Aksesoris", shopeeUrl: "", tiktokUrl: "" },
    ];
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("outfits").select("category");
      if (data) {
        const unique = Array.from(new Set(data.map(d => d.category)));
        setExistingCategories(unique);
      }
    };
    fetchCategories();

    if (isEdit && initialData) {
      const imgs = [initialData.cover_image_url];
      if (initialData.gallery_image_urls) {
        imgs.push(...initialData.gallery_image_urls);
      }
      setExistingImages(imgs.filter(Boolean));
    }
  }, [isEdit, initialData]);

  const handleOutfitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewOutfitFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingOutfitImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OutfitItemForm, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  const handleItemFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setItems((prev) => {
        const newItems = [...prev];
        newItems[index] = { ...newItems[index], file, previewUrl };
        return newItems;
      });
    }
  };

  const addItem = (type: string, defaultName: string) => {
    setItems((prev) => [
      ...prev,
      { type, name: defaultName, shopeeUrl: "", tiktokUrl: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);
  };

  const uploadFileToSupabase = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from("outfits").upload(fileName, file);
    if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);
    const { data: { publicUrl } } = supabase.storage.from("outfits").getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (existingImages.length === 0 && files.length === 0) {
      setMessage({ text: "Minimal harus ada 1 gambar etalase!", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "Menyimpan data...", type: "info" });

    try {
      const slug = isEdit ? initialData.slug : generateSlug(name);
      const uploadedUrls: string[] = [...existingImages];

      // 1. Upload New Outfit Images
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToSupabase(files[i], `${slug}-main`);
        uploadedUrls.push(url);
      }

      const cover_image_url = uploadedUrls[0];
      const gallery_image_urls = uploadedUrls.slice(1);
      const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

      const outfitPayload = {
        name,
        category: category.toLowerCase().trim(),
        tags: tagsArray,
        estimated_total_price: 0, // removed price
        cover_image_url,
        gallery_image_urls,
        published: true,
      };

      let outfitId = initialData?.id;

      if (isEdit) {
        const { error: outfitError } = await supabase.from("outfits").update(outfitPayload).eq("id", outfitId);
        if (outfitError) throw new Error(`Update error: ${outfitError.message}`);
      } else {
        const { data, error: outfitError } = await supabase.from("outfits").insert({ ...outfitPayload, slug }).select("id").single();
        if (outfitError) throw new Error(`Insert error: ${outfitError.message}`);
        outfitId = data.id;
      }

      // 2. Handle Items
      // Filter out items that are completely empty (no links, no photo)
      const validItems = items.filter(item => 
        item.shopeeUrl || item.tiktokUrl || item.file || item.thumbnail_url
      );

      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        let thumbnailUrl = item.thumbnail_url || cover_image_url;

        // Upload item specific photo if exists
        if (item.file) {
          thumbnailUrl = await uploadFileToSupabase(item.file, `${slug}-item-${i}`);
        }

        const itemPayload = {
          outfit_id: outfitId,
          name: item.name || item.type,
          item_type: item.type,
          thumbnail_url: thumbnailUrl,
          estimated_price: 0, // removed price
          shopee_affiliate_url: item.shopeeUrl || null,
          tiktok_shop_affiliate_url: item.tiktokUrl || null,
          position: i
        };

        if (item.id) {
          const { error: itemError } = await supabase.from("outfit_items").update(itemPayload).eq("id", item.id);
          if (itemError) throw new Error(`Item update error: ${itemError.message}`);
        } else {
          const { error: itemError } = await supabase.from("outfit_items").insert(itemPayload);
          if (itemError) throw new Error(`Item insert error: ${itemError.message}`);
        }
      }

      // Handle items that were deleted by the user
      if (isEdit && initialData?.items) {
        const validItemIds = validItems.map(vi => vi.id).filter(Boolean);
        const idsToDelete = initialData.items.map((i: any) => i.id).filter((id: string) => !validItemIds.includes(id));
        if (idsToDelete.length > 0) {
          await supabase.from("outfit_items").delete().in("id", idsToDelete);
        }
      }

      setMessage({ text: isEdit ? "✅ Berhasil diupdate!" : "✅ Berhasil ditambahkan!", type: "success" });
      
      if (!isEdit) {
        // Reset form
        setName(""); setTags(""); setFiles([]); setPreviewUrls([]); setCategory("casual");
        setItems([
          { type: "atasan", name: "Atasan", shopeeUrl: "", tiktokUrl: "" },
          { type: "bawahan", name: "Bawahan", shopeeUrl: "", tiktokUrl: "" },
          { type: "sepatu", name: "Sepatu", shopeeUrl: "", tiktokUrl: "" },
          { type: "aksesoris", name: "Aksesoris", shopeeUrl: "", tiktokUrl: "" },
        ]);
      } else {
        router.refresh();
      }

    } catch (error: any) {
      setMessage({ text: `❌ Gagal: ${error.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
          {message.text}
        </div>
      )}

      {/* --- BAGIAN 1: INFO UTAMA OUTFIT --- */}
      <div className="space-y-6 rounded-2xl border border-border-subtle bg-surface-elevated p-6">
        <h3 className="text-lg font-bold font-heading text-warm-white border-b border-border-subtle pb-2">1. Info Utama Etalase</h3>
        
        {/* Gambar Etalase */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-warm-white/80">Gambar Etalase (Bisa lebih dari 1 untuk Slider)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {existingImages.map((url, i) => (
              <div key={`exist-${i}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border-subtle group">
                <img src={url} alt="Existing" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingOutfitImage(i)} className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
                {i === 0 && <div className="absolute bottom-0 left-0 right-0 bg-shopee-orange/90 text-[10px] text-center font-bold py-1">COVER</div>}
              </div>
            ))}
            {previewUrls.map((url, i) => (
              <div key={`new-${i}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border-subtle group">
                <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewOutfitFile(i)} className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
                {existingImages.length === 0 && i === 0 && <div className="absolute bottom-0 left-0 right-0 bg-shopee-orange/90 text-[10px] text-center font-bold py-1">COVER</div>}
              </div>
            ))}
            <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-border-subtle hover:border-warm-white/30 hover:bg-warm-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-warm-white/40">
              <Plus size={24} className="mb-2" />
              <span className="text-xs font-medium">Tambah Foto</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleOutfitFileChange} />
            </label>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold text-warm-white/80">Judul Outfit</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border-subtle bg-ink-black px-4 py-3 focus:border-warm-white focus:outline-none" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-warm-white/80">Kategori</label>
            <input 
              type="text" 
              list="categories" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full rounded-xl border border-border-subtle bg-ink-black px-4 py-3 focus:border-warm-white focus:outline-none" 
              placeholder="Contoh: casual, vintage..." 
              required 
            />
            <datalist id="categories">
              {existingCategories.map(c => <option key={c} value={c} />)}
              <option value="kampus" />
              <option value="casual" />
              <option value="semi-formal" />
              <option value="nongkrong" />
            </datalist>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-warm-white/80">Tags (Pisahkan koma)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full rounded-xl border border-border-subtle bg-ink-black px-4 py-3 focus:border-warm-white focus:outline-none" placeholder="minimalis, earth-tone" />
          </div>
        </div>
      </div>

      {/* --- BAGIAN 2: ITEM OUTFIT --- */}
      <div className="space-y-6 rounded-2xl border border-border-subtle bg-surface-elevated p-6">
        <div className="flex justify-between items-center border-b border-border-subtle pb-2">
          <h3 className="text-lg font-bold font-heading text-warm-white">2. Item Pakaian & Link Affiliate</h3>
          <p className="text-xs text-warm-white/40">Jika dikosongkan, item tidak akan muncul</p>
        </div>

        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 p-4 rounded-xl border border-border-subtle bg-ink-black/50 relative">
              
              {/* Tombol Hapus (Bisa untuk item apa saja) */}
              <button type="button" onClick={() => removeItem(index)} className="absolute top-3 right-3 text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>

              {/* Upload Foto Individual */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-warm-white/50 uppercase tracking-wider">{item.type}</p>
                <label className="relative block aspect-[3/4] w-full rounded-xl border-2 border-dashed border-border-subtle hover:border-warm-white/30 cursor-pointer overflow-hidden group">
                  {(item.previewUrl || item.thumbnail_url) ? (
                    <img src={item.previewUrl || item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-warm-white/30 group-hover:text-warm-white/60">
                      <ImagePlus size={20} className="mb-1" />
                      <span className="text-[10px]">Foto (Opsional)</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleItemFileChange(index, e)} />
                </label>
              </div>

              {/* Data Item */}
              <div className="space-y-4 pt-4 md:pt-0">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-warm-white/40">Nama Item</label>
                  <input type="text" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} className="w-full rounded-lg border border-border-subtle bg-ink-black px-3 py-2 text-sm focus:border-warm-white focus:outline-none" placeholder={`Contoh: ${item.type} Putih`} />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-shopee-orange">Link Shopee</label>
                  <input type="url" value={item.shopeeUrl} onChange={(e) => handleItemChange(index, "shopeeUrl", e.target.value)} className="w-full rounded-lg border border-border-subtle bg-ink-black px-3 py-2 text-sm focus:border-shopee-orange focus:outline-none" placeholder="https://shopee.co.id/..." />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-tiktok-red">Link TikTok Shop</label>
                  <input type="url" value={item.tiktokUrl} onChange={(e) => handleItemChange(index, "tiktokUrl", e.target.value)} className="w-full rounded-lg border border-border-subtle bg-ink-black px-3 py-2 text-sm focus:border-tiktok-red focus:outline-none" placeholder="https://tiktok.com/..." />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Tambah Duplikat Item */}
        <div className="pt-4 border-t border-border-subtle">
          <p className="text-xs text-warm-white/50 mb-3">Tambah Item Duplikat (Misal: 2 Lapis Baju):</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => addItem('atasan', 'Atasan')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-medium hover:bg-warm-white/10 transition-colors">
              <Plus size={14} /> Atasan
            </button>
            <button type="button" onClick={() => addItem('bawahan', 'Bawahan')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-medium hover:bg-warm-white/10 transition-colors">
              <Plus size={14} /> Bawahan
            </button>
            <button type="button" onClick={() => addItem('sepatu', 'Sepatu')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-medium hover:bg-warm-white/10 transition-colors">
              <Plus size={14} /> Sepatu
            </button>
            <button type="button" onClick={() => addItem('aksesoris', 'Aksesoris')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-xs font-medium hover:bg-warm-white/10 transition-colors">
              <Plus size={14} /> Aksesoris
            </button>
          </div>
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-warm-white py-4 font-bold text-ink-black hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isLoading ? <><Loader2 className="animate-spin" size={18} /> Menyimpan...</> : isEdit ? <><Save size={18} /> Simpan Perubahan</> : <><UploadCloud size={18} /> Upload Etalase</>}
      </button>
    </form>
  );
}
