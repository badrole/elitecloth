# Rencana Update Elitecloth

> **⚠️ ATURAN DESAIN**: Semua implementasi WAJIB mengikuti tema yang sudah ada (dark theme, warna `ink-black`, `warm-white`, `shopee-orange`, border `border-subtle`, glassmorphism `backdrop-blur`, font heading, `btn-pill`, `card-glow`, dll). JANGAN membuat desain baru atau style yang tidak konsisten dengan codebase existing.

## 1. Link collshp.com, TikTok, Instagram — FAB (Floating Action Button)

**Solusi**: Tombol lingkaran mengambang di kanan bawah layar. Saat ditekan, berkembang menjadi 3 icon: TikTok, Instagram, Shopee (collshp.com). icon nya logo elitecloth di D:\download\elitecloth\public\logo\logo.png

**Implementasi**:
1. Buat `src/components/social-fab.tsx`
2. FAB bulat fixed di `bottom-6 right-6` dengan icon utama logo elitecloth di D:\download\elitecloth\public\logo\logo.png
3. Saat diklik → expand animasi 3 icon ke atas (fan-out)
4. Masing-masing icon link ke: TikTok (`tiktok.com/@elcloth.storee`), IG (`instagram.com/elcloth.store`), collshp.com/elcloth
5. Klik di luar atau klik lagi → collapse
6. Pakai `framer-motion` untuk animasi expand/collapse
7. Tampil di semua halaman (pasang di `layout.tsx`)

---

## 2. Tombol Share dengan Caption (di dalam halaman detail outfit)

**Solusi**: Tombol share di halaman detail outfit (`/outfit/[slug]`) dengan caption otomatis.

**Implementasi**:
1. Ubah `share-button.tsx` — caption default: `Cek outfit "[NAMA OUTFIT]" di Elitecloth!`
2. Link share gunakan `www.elcloth.store/outfit/[slug]` (hardcode base URL, bukan `window.location.href`)
3. Support: Web Share API, WhatsApp, Copy Link
4. Pastikan domain `www.elcloth.store` sudah aktif dan redirect ke deployment

---

## 3. Saran untuk Kotak Katalog (OutfitCard)

**Implementasi**:
1. Tambah **badge "Baru"** — tampilkan jika outfit dibuat < 7 hari lalu
2. Tambah **jumlah views** — data real dari `outfit.view_count`, tampilkan kecil di card (misal: "123 views")

---

## 4. Sticky Bottom Dock di Mobile

**Solusi**: Dock bar fixed di bottom layar (mobile only) dengan 4 menu: Home, Katalog, Search, wishlst. pakai icon ya jangan tulisan misal home gambar home, wishlist gambar heart.

**Implementasi**:
1. Install `framer-motion`
2. Buat `src/components/ui/mobile-dock.tsx` — flat dock dengan scale animation saat tap
3. 3 item: Home (`/`), Katalog (`/outfit`), Search (trigger search overlay)
4. Highlight item aktif berdasarkan current path
5. Hidden di desktop (`md:hidden`)
6. Pasang di `layout.tsx`
7. Tambah `pb-20` di body/main agar konten tidak tertutup dock

---

## 5. Rekomendasi Kategori & Tags di Form Upload

**Implementasi**:
1. Kategori: fetch dari DB via `getAllCategories()`, tampilkan sebagai select dropdown
2. Tags: fetch existing tags via `getAllTags()`, tampilkan sebagai chip yang bisa diklik
3. Tambah input text "Tambah tag baru..." untuk tag yang belum ada
4. Tag yang dipilih muncul sebagai chip aktif, bisa di-remove

---

## 6. Wishlist/Bookmark (localStorage)

**Implementasi**:
1. Tombol bookmark (heart/star) di OutfitCard dan halaman detail
2. Simpan outfit ID di localStorage
3. Halaman `/wishlist` atau section di homepage untuk lihat outfit yang disimpan
4. Tidak perlu login

---

## 7. Related Outfits

**Implementasi**:
1. Di halaman detail outfit (`/outfit/[slug]`), tambah section "Outfit Serupa"
2. Query outfit dengan kategori atau tags yang sama (exclude current)
3. Tampilkan 4 outfit dalam grid

---

## 8. PWA Support

**Implementasi**:
1. Install `next-pwa`
2. Buat `public/manifest.json` (nama: Elitecloth, icon, theme color)
3. Konfigurasi service worker di `next.config.ts`
4. User bisa "Add to Home Screen" di HP
5. icon pakai gambar siluet baju hitam latarnya putih


---

## 9. Infinite Scroll di Katalog Mobile

**Implementasi**:
1. Di halaman `/outfit`, ganti pagination dengan infinite scroll di mobile
2. Pakai Intersection Observer — saat user scroll ke bawah, fetch page berikutnya
3. Desktop tetap bisa pakai pagination (opsional)
4. Loading indicator di bawah grid saat fetching

---

## 10. Dynamic OG Image per Outfit

**Implementasi**:
1. Buat API route `/api/og/[slug]` yang generate gambar OG
2. Pakai `@vercel/og` atau Next.js `ImageResponse`
3. Gambar berisi: cover image outfit + nama outfit + branding Elitecloth
4. Set meta tag `og:image` di halaman detail outfit ke URL API ini
5. Setiap share link, preview otomatis tampil gambar spesifik outfit tersebut
