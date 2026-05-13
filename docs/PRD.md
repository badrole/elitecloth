# Product Requirements Document (PRD)
## Elitecloth — Fashion Affiliate Discovery Platform

**Versi:** 1.0 (MVP)
**Tanggal:** 12 Mei 2026
**Status:** Draft for Implementation
**Owner:** Product / Founder
**Bahasa Produk:** Bahasa Indonesia

---

## 1. Overview & Vision

### 1.1 Ringkasan Produk
**Elitecloth** adalah platform katalog outfit berbasis AI yang mengkurasi kombinasi pakaian dari produk yang tersedia di **Shopee** dan **TikTok Shop**. Elitecloth **bukan** toko online — tidak menjual produk sendiri, tidak memegang stok, dan tidak memproses transaksi.

Yang "dijual" Elitecloth adalah **inspirasi outfit** dan **kemudahan menemukan item** tersebut langsung di marketplace yang sudah dipercaya user Indonesia.

### 1.2 Vision Statement
> Menjadi referensi utama inspirasi outfit di Indonesia, dimulai dari niche cowok kuliah low budget, dengan pengalaman discovery yang lebih cepat, lebih rapi, dan lebih estetis dibanding scroll keranjang kuning.

### 1.3 Mission
- Mengubah fashion discovery dari aktivitas yang melelahkan (scroll marketplace berjam-jam) menjadi pengalaman yang **curated, visual, dan actionable**.
- Membangun jembatan antara konten fashion di TikTok/Instagram dengan konversi nyata di marketplace.
- Monetisasi berkelanjutan melalui komisi affiliate Shopee Affiliate dan TikTok Shop Affiliate tanpa beban operasional toko.

### 1.4 Value Proposition
| Untuk User | Untuk Bisnis |
|---|---|
| Outfit sudah di-mix-and-match-kan oleh AI + kurator | Zero inventory, zero shipping, zero CS produk |
| Satu halaman = satu look lengkap + semua link beli | Margin murni komisi affiliate |
| Estimasi harga total sebelum klik | Scalable ke niche lain (hijab, old money, streetwear) |
| Mobile-first, cepat, ringan | Traffic organik dari konten sosial (TikTok/IG) |

---

## 2. Problem Statement

### 2.1 Problem untuk User
1. **Discovery overload di marketplace.** User yang butuh outfit harus scroll ratusan produk di Shopee/TikTok Shop tanpa tahu item mana yang nyambung satu sama lain.
2. **Tidak ada konteks styling.** Marketplace menampilkan produk secara individual — user tidak tahu celana ini cocok dipadukan dengan atasan apa.
3. **Foto produk asli tidak inspiratif.** Foto flat-lay atau katalog penjual sering tidak menunjukkan bagaimana item terlihat saat dipakai sebagai outfit utuh.
4. **Budget anak kuliah terbatas.** Butuh inspirasi yang sudah dipertimbangkan dari sisi harga total, bukan sekadar "outfit aesthetic" yang ternyata total Rp 2 juta.

### 2.2 Problem untuk Affiliate Content Creator (kompetitor tidak langsung)
- Konten TikTok/IG tentang outfit hanya bertahan beberapa detik — link di bio cepat tenggelam, user sering lupa item yang ditampilkan.
- Affiliate link tunggal di bio tidak mengarahkan user ke "look" lengkap.

### 2.3 Peluang
Belum ada platform lokal Indonesia yang fokus murni pada **outfit curation** (bukan produk individual) dengan monetisasi affiliate dan konten AI lookbook. Kompetitor mirip (Pinterest, Lookbook.nu) tidak terhubung langsung ke marketplace Indonesia.

---

## 3. Target User & Persona

### 3.1 Niche Awal (MVP)
**Cowok kuliah low budget** 

### 3.2 Niche Ekspansi (Post-MVP)
- Old money lokal 
- Streetwear 

### 3.3 Persona Utama: "Rafi, Anak Kuliah Semester 3"

| Atribut | Detail |
|---|---|
| **Usia** | 19 tahun |
| **Status** | Mahasiswa semester 3, tinggal di kost |
| **Budget outfit/bulan** | Rp 200rb – Rp 500rb |
| **Device utama** | Android mid-range, koneksi 4G |
| **Platform favorit** | TikTok, Instagram, Shopee, TikTok Shop |
| **Behavior** | Scroll TikTok 2–4 jam/hari, sering screenshot outfit tapi bingung cari barangnya |
| **Pain** | Bingung mix-and-match, takut salah beli, budget terbatas, tidak mau repot |
| **Goal** | Tampil rapi/keren dengan budget minim, tanpa pusing styling |
| **Trigger masuk website** | Lihat foto slide outfit di TikTok/IG → klik link bio |

### 3.4 Secondary Persona: "Bima, Freshgrad Hemat"
Usia 22, baru lulus, cari outfit semi-formal untuk interview & nongkrong. Budget sedikit lebih tinggi (Rp 150rb–Rp 500rb/item). Mencari look "old money lokal" versi murah.

---

## 4. Goals & Success Metrics

### 4.1 Tujuan MVP (Hypothesis to Validate)
MVP Elitecloth bertujuan membuktikan **4 hipotesis inti**:

| # | Hipotesis | Cara Validasi |
|---|---|---|
| H1 | Konten outfit (foto AI lookbook) bisa menghasilkan traffic ke website | Unique visitor dari TikTok/IG |
| H2 | User mau klik tombol affiliate setelah melihat outfit di website | CTR tombol Shopee & TikTok Shop |
| H3 | Ada style/kategori tertentu yang significantly lebih diminati | Distribusi view per kategori/tag |
| H4 | Website membantu konversi lebih tinggi dibanding link keranjang kuning langsung di bio | Klik → konversi komisi affiliate |

### 4.2 Success Metrics (North Star & Supporting)

**North Star Metric:**
- **Jumlah klik tombol affiliate (Shopee + TikTok Shop) per minggu**

**Primary Metrics:**
| Metric | Target Bulan 1 | Target Bulan 3 |
|---|---|---|
| Unique visitors / bulan | 3.000 | 15.000 |
| Total klik affiliate / bulan | 500 | 3.000 |
| CTR per outfit page (klik affiliate / page view) | ≥ 8% | ≥ 12% |
| Rata-rata outfit dilihat per sesi | ≥ 2 | ≥ 3 |
| Komisi affiliate / bulan | Rp 200rb | Rp 2 juta |

**Secondary Metrics:**
- Outfit paling populer (top 10 by view & by CTR)
- Kategori paling populer (campus, casual, semi-formal, dll.)
- Bounce rate per halaman (target < 65%)
- Load time mobile (target LCP < 2.5s)
- Source traffic breakdown (TikTok / IG / organic search / direct)

**Guardrail Metrics:**
- Broken affiliate link rate < 2% (produk marketplace sering habis / dihapus)
- Error rate website < 1%

### 4.3 Non-Goals untuk MVP
- Bukan target: profit besar
- Bukan target: jumlah SKU outfit raksasa (cukup 30–60 outfit saat launch)
- Bukan target: fitur sosial/komunitas

---

## 5. Features (MVP & Future)

### 5.1 MVP Features (Must Have)

#### 5.1.1 Homepage
- Hero section dengan 1 outfit highlight / slider
- Section "Outfit Terbaru" (8–12 outfit)
- Section "Paling Populer" (trending berdasarkan view)
- Section kategori cepat (chip/button: Kampus, Casual, Semi-formal, Nongkrong, dll.)
- Footer: social links, disclaimer affiliate

#### 5.1.2 Katalog Outfit (List/Grid Page)
- Layout grid responsive (2 kolom mobile, 3–4 kolom desktop)
- Infinite scroll atau pagination (pilih salah satu, rekomendasi: pagination untuk SEO)
- Setiap card menampilkan: foto lookbook, nama outfit, estimasi harga total, tag kategori
- URL SEO-friendly: `/outfit` dan `/kategori/{slug}`

#### 5.1.3 Search Outfit
- Search bar di header (sticky di mobile)
- Search berdasarkan: nama outfit, tag, kategori, occasion
- Hasil instan (client-side filter untuk katalog kecil, atau server-side jika > 200 outfit)

#### 5.1.4 Filter
- **Filter kategori:** Kampus, Casual, Semi-formal, Nongkrong, Olahraga, Acara Khusus
- **Filter style/tag:** Minimalis, Streetwear, Old Money, Smart Casual, dll.
- **Filter gender/niche:** Cowok, Cewek, Hijab (siap diaktifkan saat niche expand)
- **Filter harga total:** Range slider (< Rp 200rb, Rp 200rb–500rb, Rp 500rb–1jt, > Rp 1jt)
- Filter dapat dikombinasikan, state tersimpan di URL query params (untuk shareable link & SEO)

#### 5.1.5 Halaman Detail Outfit (Core Page)
Komponen wajib:
- Nama outfit (H1)
- Foto AI lookbook (1 foto utama, opsional 2–3 foto angle tambahan)
- Deskripsi style (2–4 kalimat)
- Badge: Kategori + Occasion
- Estimasi harga total (auto-calculated dari sum item)
- Daftar item (table/list card):
  - Thumbnail item
  - Nama item
  - Estimasi harga item
  - **Tombol "Beli di Shopee"** (CTA utama, warna Shopee orange)
  - **Tombol "Beli di TikTok Shop"** (CTA sekunder, warna TikTok Shop merah/hitam)
- Tag style (clickable → filter results)
- Section "Outfit Serupa" (4 outfit dari kategori/tag yang sama)
- Share button (WhatsApp, TikTok, IG Story, copy link)

#### 5.1.6 Tombol Beli (Affiliate CTA)
- Wajib menggunakan `rel="sponsored nofollow noopener"` (SEO & compliance)
- Membuka link marketplace di **new tab**
- Setiap klik tercatat di analytics **sebelum** redirect (event tracking)
- Fallback: jika link mati/404, tombol disabled + label "Stok Habis"

#### 5.1.7 Responsive Mobile (Prioritas Utama)
- Mobile-first design (breakpoint: 360px sebagai baseline)
- Touch-friendly (min tap target 44×44px)
- Image lazy-loading + format modern (WebP/AVIF)
- Target Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 90

#### 5.1.8 SEO Dasar
- Meta title & description per outfit page (dinamis dari database)
- Open Graph + Twitter Card (untuk share di sosmed)
- Structured data JSON-LD (`Product` / `ItemList` schema)
- `sitemap.xml` dinamis
- `robots.txt` proper
- Canonical URLs
- Clean URL slug per outfit (contoh: `/outfit/outfit-kampus-minimalis-putih`)
- Server-side rendering / static generation (Next.js ISR)

#### 5.1.9 Analytics Klik Affiliate
- **Google Analytics 4:**
  - Event `affiliate_click` dengan params: `outfit_id`, `outfit_name`, `item_id`, `marketplace` (shopee/tiktok), `estimated_price`
  - Conversion goal: klik affiliate
- **Microsoft Clarity:** session recording + heatmap (opsional tapi direkomendasikan)
- **Internal log (Supabase table `affiliate_clicks`):**
  - `id`, `outfit_id`, `item_id`, `marketplace`, `user_agent`, `referrer`, `clicked_at`
  - Untuk backup jika GA blocked oleh ad-blocker
- Dashboard sederhana untuk admin (Supabase view / Metabase opsional post-MVP)

#### 5.1.10 Admin Content Management (Pre-requisite, bukan user-facing)
Karena Elitecloth adalah content-heavy, admin butuh cara input outfit:
- **MVP approach:** Supabase Studio direct (manual insert ke table `outfits` dan `outfit_items`)
- Upload foto lookbook via Supabase Storage
- Tidak perlu custom admin UI di MVP

### 5.2 Future Features (Post-MVP, Prioritized Backlog)

| Prioritas | Fitur | Justifikasi |
|---|---|---|
| P1 | Admin dashboard custom | Skalabilitas input outfit |
| P1 | Niche expansion: hijab casual | Market terbesar kedua |
| P2 | Wishlist (tanpa login, localStorage) | Retention tanpa friction |
| P2 | Login + profil user | Prerequisite untuk personalisasi |
| P2 | AI recommendation ("outfit serupa untukmu") | Meningkatkan session depth |
| P3 | Quiz "Style apa kamu?" | Lead generation & fun content |
| P3 | Newsletter outfit mingguan | Retention channel |
| P3 | User-generated outfit (submit combo) | Konten scaling |
| P4 | Review/rating outfit | Social proof |
| P4 | Mobile app (PWA dulu sebelum native) | Kalau traffic > 100K/bulan |
| P5 | Affiliate expansion (Lazada, Tokopedia) | Diversifikasi revenue |

---

## 6. User Stories

### 6.1 Discovery & Browse
- **US-01** Sebagai pengunjung baru, saya ingin melihat outfit highlight di homepage agar saya langsung paham apa itu Elitecloth dalam < 5 detik.
- **US-02** Sebagai user mobile, saya ingin scroll katalog outfit dengan lancar tanpa lag agar saya betah browsing.
- **US-03** Sebagai anak kuliah, saya ingin filter outfit berdasarkan kategori "Kampus" agar saya hanya melihat outfit yang relevan.
- **US-04** Sebagai user low budget, saya ingin filter outfit di bawah Rp 300rb total agar tidak kecewa karena kemahalan.
- **US-05** Sebagai user dengan style tertentu (misal minimalis), saya ingin filter berdasarkan tag "minimalis" agar hasil pencarian spesifik.

### 6.2 Search
- **US-06** Sebagai user yang tahu spesifik occasion, saya ingin mengetik "ngampus" di search bar agar outfit-outfit relevan muncul.
- **US-07** Sebagai user, saya ingin mengetik nama item (misal "celana cargo") dan menemukan outfit yang berisi item tersebut.

### 6.3 Outfit Detail
- **US-08** Sebagai user yang tertarik dengan satu outfit, saya ingin melihat foto lookbook jelas + breakdown setiap item agar saya tahu total harga dan komposisinya.
- **US-09** Sebagai user, saya ingin melihat estimasi harga total outfit agar saya bisa langsung memutuskan apakah masuk budget.
- **US-10** Sebagai user, saya ingin klik tombol "Beli di Shopee" pada item tertentu dan langsung masuk ke produk itu di aplikasi Shopee saya.
- **US-11** Sebagai user, saya ingin klik tombol "Beli di TikTok Shop" sebagai alternatif jika Shopee kehabisan stok.
- **US-12** Sebagai user yang tertarik dengan satu outfit, saya ingin melihat outfit serupa agar saya bisa membandingkan sebelum memutuskan.
- **US-13** Sebagai user, saya ingin share outfit ke teman via WhatsApp/IG Story agar minta pendapat sebelum beli.

### 6.4 Navigasi & UX
- **US-14** Sebagai user yang datang dari TikTok bio link, saya ingin halaman outfit langsung ter-load dalam < 3 detik agar saya tidak bounce.
- **US-15** Sebagai user, saya ingin back button browser bekerja logis (kembali ke katalog, tidak ke homepage) agar browsing flow tidak terputus.
- **US-16** Sebagai user, saya ingin melihat link share outfit yang saya klik punya preview thumbnail + judul yang bagus di WhatsApp/IG.

### 6.5 Admin (Internal)
- **US-17** Sebagai admin, saya ingin menambahkan outfit baru lewat Supabase Studio dengan mudah agar bisa publish minimal 1 outfit/hari.
- **US-18** Sebagai admin, saya ingin melihat data klik affiliate harian agar bisa evaluasi konten yang berhasil.
- **US-19** Sebagai admin, saya ingin tahu outfit mana yang linknya rusak (404 di marketplace) agar bisa segera di-update.

---

## 7. Out of Scope (MVP)

Fitur-fitur berikut **secara eksplisit tidak dibuat** di MVP. Ini penting agar scope tidak bocor.

| Kategori | Fitur yang TIDAK ADA di MVP | Alasan |
|---|---|---|
| Autentikasi | Login / register / social login | Tidak diperlukan untuk validasi hipotesis MVP |
| User data | Wishlist / favorit (versi login) | Cukup copy link sebagai substitusi |
| Transaksi | Checkout, cart, payment gateway | Konversi terjadi di marketplace, bukan di Elitecloth |
| AI | Rekomendasi otomatis berbasis behavior user | Butuh data base dulu, belum ada |
| Komunikasi | Chatbot / live chat | Tidak ada support produk |
| Sosial | Review, rating, komentar | Tidak ada trust signal yang perlu dibangun untuk produk pihak ketiga |
| Konten user | User submit outfit sendiri | Risiko moderasi & kualitas di awal |
| Platform | Aplikasi mobile native (iOS/Android) | Website responsive sudah cukup |
| Notifikasi | Push notification / email newsletter | Belum ada audience base |
| Lokalisasi | Multi-bahasa (English) | Fokus pasar Indonesia dulu |
| Marketplace | Integrasi Lazada, Tokopedia, Zalora | Fokus 2 affiliate utama dulu |
| Konten | Video AI lookbook | Fokus foto dulu, lebih murah & cepat |

---

## 8. Tech Stack

### 8.1 Arsitektur Tinggi
```
[User (Mobile/Desktop Browser)]
            │
            ▼
[Cloudflare DNS + CDN]
            │
            ▼
[Netlify Hosting (Next.js App)]
            │
            ├──► [Supabase Postgres DB]
            ├──► [Supabase Storage (Images)]
            ├──► [Google Analytics 4]
            └──► [Microsoft Clarity]
                        │
[Affiliate Click Event] ┘
            │
            ▼
[Shopee / TikTok Shop via new tab]
```

### 8.2 Detail Tech Stack

| Layer | Tech | Catatan |
|---|---|---|
| **Frontend Framework** | Next.js (App Router, React 18+) | Static generation + ISR untuk SEO |
| **Styling** | Tailwind CSS | Utility-first, mobile-first |
| **UI Components** | Custom + headless (shadcn/ui optional) | Hindari heavy library |
| **Database** | Supabase (PostgreSQL) | Free tier cukup untuk MVP |
| **File Storage** | Supabase Storage | Foto AI lookbook + thumbnail |
| **Image Optimization** | `next/image` + Supabase transform | WebP auto, lazy load |
| **Hosting** | **Netlify** | **BUKAN Vercel** karena lisensi commercial use pada free tier |
| **DNS & CDN** | Cloudflare | DNS gratis, proteksi bot, caching layer |
| **Domain** | Custom domain (e.g., elitecloth.id) | Registered via Niagahoster / Cloudflare Registrar |
| **Analytics** | Google Analytics 4 + Microsoft Clarity | GA4 untuk metric, Clarity untuk heatmap & session |
| **Event Tracking** | GA4 custom events + Supabase logging | Dual tracking untuk ad-blocker resilience |
| **Version Control** | Git + GitHub | Private repo |
| **CI/CD** | Netlify auto-deploy from GitHub main | No extra config needed |
| **Environment Config** | Netlify env vars + `.env.local` | Supabase keys, GA4 ID |

### 8.3 Data Model (Awal)

**Table: `outfits`**
| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| slug | text unique | URL slug |
| name | text | Nama outfit |
| description | text | Deskripsi style |
| category | text | Kampus, Casual, dll. |
| occasion | text | Nongkrong, Kuliah, dll. |
| niche | text | cowok / cewek / hijab / streetwear |
| gender | text | male / female / unisex |
| cover_image_url | text | Foto lookbook utama |
| gallery_image_urls | text[] | Foto tambahan |
| tags | text[] | Array tag style |
| estimated_total_price | integer | IDR, auto-calc dari items |
| published | boolean | Draft/publish flag |
| view_count | integer | Cache counter |
| created_at | timestamp | |
| updated_at | timestamp | |

**Table: `outfit_items`**
| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| outfit_id | uuid FK | → outfits.id |
| name | text | Nama item (ex: "Kaos Polos Putih") |
| item_type | text | atasan/bawahan/sepatu/aksesoris |
| thumbnail_url | text | |
| estimated_price | integer | IDR |
| shopee_affiliate_url | text | Nullable |
| tiktok_shop_affiliate_url | text | Nullable |
| position | integer | Urutan tampil |

**Table: `affiliate_clicks`**
| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| outfit_id | uuid FK | |
| item_id | uuid FK | |
| marketplace | text | 'shopee' / 'tiktok_shop' |
| user_agent | text | |
| referrer | text | |
| session_id | text | Anonymous session |
| clicked_at | timestamp | |

**Table: `categories`** dan **`tags`** (opsional, bisa jadi array di outfits dulu).

### 8.4 Non-Functional Requirements
| Aspek | Target |
|---|---|
| Performance (LCP mobile) | < 2.5s |
| Time to Interactive | < 3.5s |
| Uptime | ≥ 99% |
| Max image size served | 300 KB (optimized) |
| Lighthouse mobile score | Performance ≥ 85, SEO ≥ 95, Accessibility ≥ 90 |
| Core Web Vitals | Semua "Good" di PageSpeed Insights |

---

## 9. Constraints & Risks

### 9.1 Constraints

**Bisnis:**
- Budget development terbatas (solo founder / tim kecil)
- Revenue baru masuk setelah ada klik → konversi → komisi (lag 30–60 hari)
- Konten outfit harus dibuat manual dengan AI tool (Midjourney / Leonardo / Flux) → throughput terbatas

**Teknis:**
- Netlify free tier: 100 GB bandwidth / bulan (cukup untuk ~50K pageview/bulan dengan optimasi)
- Supabase free tier: 500 MB database, 1 GB storage, 50K monthly active users
- Tidak boleh pakai Vercel karena lisensi commercial use
- Foto AI lookbook harus konsisten style-nya (agar brand identity kuat)

**Legal & Compliance:**
- Wajib cantumkan **disclaimer affiliate** di footer & setiap halaman outfit: "Elitecloth adalah platform affiliate. Kami menerima komisi jika kamu membeli produk melalui link kami."
- Patuhi **Terms & Conditions Shopee Affiliate** (tidak boleh fake CTA, tidak boleh cloaking, tidak boleh iframe marketplace).
- Patuhi **Terms & Conditions TikTok Shop Affiliate** (syarat similar).
- Foto AI lookbook tidak boleh meniru model/artis tertentu → bisa melanggar hak cipta/likeness.
- Foto produk (thumbnail item) sebaiknya **tidak di-scrape otomatis** — gunakan foto dari seller atau generate sendiri untuk amannya.
- Kebijakan privasi & cookie notice (terutama karena pakai GA4 + Clarity).

### 9.2 Risks

| Risiko | Likelihood | Impact | Mitigasi |
|---|---|---|---|
| Affiliate link mati (produk habis/dihapus seller) | **Tinggi** | Sedang | Script cek berkala (manual mingguan di MVP), tombol disabled jika 404 |
| Komisi affiliate tidak cukup cover biaya | Sedang | Tinggi | Start ultra-lean (gratis-an stack), rotate niche jika tidak perform |
| Traffic TikTok/IG tidak konversi ke website (user males klik link bio) | **Tinggi** | Tinggi | A/B test hook konten, fokus CTA yang strong di slide terakhir |
| Foto AI lookbook dianggap "fake" / kurang kredibel | Sedang | Sedang | Disclaimer "ilustrasi AI", tunjukkan foto item asli di detail |
| Shopee / TikTok Shop ubah policy affiliate | Rendah | Tinggi | Diversifikasi ke 2 platform sejak MVP, siap pivot ke Lazada |
| Konten di-copy kompetitor | Sedang | Rendah | Fokus branding & komunitas, bukan konten itself |
| Load time lambat di 4G Indonesia | Sedang | Tinggi | Image CDN, lazy load, WebP, monitor real-user metrics |
| SEO tidak rank (niche baru, domain baru) | Tinggi | Sedang | Fokus traffic sosmed dulu, SEO bonus jangka panjang |
| Gambar AI lookbook melanggar hak cipta/likeness | Rendah | Tinggi | Review setiap output AI, hindari wajah yang mirip publik figur |
| Regulasi iklan / affiliate di Indonesia berubah | Rendah | Sedang | Monitor OJK / Kemenkominfo, selalu disclose affiliate |

### 9.3 Assumptions (Perlu Divalidasi)
- A1: User Indonesia mau klik link bio TikTok dan menuju website eksternal.
- A2: Konten slide foto (carousel) menghasilkan traffic lebih baik dari video untuk niche ini.
- A3: Foto AI lookbook cukup menarik meskipun bukan foto asli.
- A4: Margin komisi Shopee/TikTok Shop cukup untuk cover biaya operasional + margin.
- A5: Niche "cowok kuliah low budget" cukup besar untuk generate awareness awal.

---

## 10. Timeline / Phases

### Phase 0 — Setup & Foundation (Minggu 1)
- Registrasi domain + Cloudflare DNS
- Setup Netlify project + GitHub repo
- Setup Supabase project (DB + Storage)
- Setup GA4 + Microsoft Clarity
- Daftar Shopee Affiliate + TikTok Shop Affiliate
- Definisikan brand guideline foto AI lookbook (style, aspect ratio, tone warna)

**Deliverable:** Infra siap, domain live dengan placeholder.

---

### Phase 1 — MVP Build (Minggu 2–4)
**Minggu 2: Core Pages**
- Setup Next.js + Tailwind + Supabase client
- Data model + seed data (minimal 10 outfit dummy)
- Homepage statis
- Katalog outfit (grid + pagination)
- Halaman detail outfit

**Minggu 3: Interactivity & Affiliate**
- Search + filter (kategori, style, harga, gender)
- Tombol affiliate dengan event tracking (GA4 + Supabase log)
- Share button
- Outfit serupa section

**Minggu 4: Polish & SEO**
- Meta tags dinamis, sitemap, robots.txt, JSON-LD
- Open Graph + thumbnail preview
- Responsive QA (device testing: Android low-end, iPhone, desktop)
- Lighthouse optimization
- Disclaimer footer, privacy policy, cookie notice

**Deliverable:** Website live dengan 10 outfit pertama.

---

### Phase 2 — Content Loading & Pre-Launch (Minggu 5)
- Generate & input 30–50 outfit siap launch
- Setup akun TikTok + Instagram brand
- Siapkan 10 konten foto slide TikTok + IG carousel pertama
- Uji alur end-to-end (klik dari TikTok bio → website → tombol affiliate → marketplace)
- Internal QA + teman test

**Deliverable:** Katalog siap, konten sosmed siap launch.

---

### Phase 3 — Launch & Iterate (Minggu 6–9)
**Minggu 6: Soft Launch**
- Post pertama TikTok + IG (3–5 konten/minggu)
- Monitor analytics harian
- Fix bug kritis

**Minggu 7–8: Scaling Konten**
- Target: 2 outfit baru / hari
- Target: 1 konten sosmed / hari
- A/B test hook caption & slide pertama TikTok

**Minggu 9: First Review & Decision**
- Review 4 hipotesis MVP (H1–H4)
- Analisis outfit & kategori top performer
- Keputusan: lanjut scale, pivot niche, atau expand fitur

**Deliverable:** Data yang cukup untuk go/no-go decision.

---

### Phase 4 — Post-MVP (Bulan 3+)
Berdasarkan hasil MVP:
- Jika positif → expand niche (hijab casual / streetwear), tambah fitur prioritas P1–P2
- Jika netral → iterate konten, tidak tambah fitur dulu
- Jika negatif → pivot niche atau pivot channel

---

## Lampiran

### A. Glossary
- **Outfit Page:** satu unit konten berisi kombinasi item yang membentuk satu look
- **Lookbook:** foto visual yang menampilkan outfit secara utuh
- **Affiliate CTR:** (Jumlah klik tombol affiliate) / (Jumlah view outfit page)
- **Niche:** segmen pasar spesifik (contoh: cowok kuliah, hijab casual)
- **AI Lookbook:** foto dihasilkan dari AI image generator (Midjourney/Flux/Leonardo) menampilkan outfit yang dikurasi

### B. Referensi Kompetitor
- Pinterest (global, tidak terhubung marketplace lokal)
- Lookbook.nu (global, tidak aktif lagi)
- Konten individu affiliate creator di TikTok (fragmented, tanpa website)
- **Gap yang Elitecloth isi:** platform terpusat, curated, lokal, connected ke Shopee + TikTok Shop

### C. Approval
| Role | Nama | Tanggal |
|---|---|---|
| Product Owner | _TBD_ | _TBD_ |
| Tech Lead | _TBD_ | _TBD_ |
| Content Lead | _TBD_ | _TBD_ |

---

**End of Document**
