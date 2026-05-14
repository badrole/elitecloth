# Audit Keamanan Admin Login Elitecloth

Tanggal audit: 14 Mei 2026

Audit ini berdasarkan kode lokal di repository. Fokus utama: proteksi halaman admin, autentikasi, akses database Supabase, dan upload storage.

## Ringkasan Risiko

Status keamanan admin saat ini: **kritis**.

Masalah utamanya bukan hanya PIN admin yang lemah, tetapi karena proteksi admin hanya berjalan di browser dan database Supabase mengizinkan publik melakukan perubahan data.

Jika konfigurasi production sama seperti `supabase/schema.sql`, orang luar berpotensi:

- Membuka admin panel tanpa tahu PIN asli.
- Menambah outfit palsu.
- Mengubah atau menghapus outfit.
- Mengubah link affiliate.
- Upload file ke bucket Supabase.
- Mengakses operasi admin langsung lewat Supabase API memakai anon key publik.

## Kelemahan yang Ditemukan

### 1. PIN admin hardcoded di frontend

File:

- `src/components/admin/auth-wrapper.tsx`

Kode saat ini menyimpan PIN langsung di frontend:

```ts
if (pin === "elite123") {
```

Masalah:

- PIN bisa dilihat dari source JavaScript browser.
- PIN pendek dan mudah ditebak.
- Tidak ada rate limit.
- Tidak ada lockout setelah gagal berkali-kali.
- Tidak ada MFA.

Cara mengatasi:

- Hapus PIN hardcoded dari frontend.
- Pakai Supabase Auth atau sistem login server-side.
- Gunakan password kuat, bukan PIN pendek.
- Tambahkan rate limit login.
- Aktifkan MFA jika memungkinkan.

## 2. Login admin bisa dibypass lewat localStorage

File:

- `src/components/admin/auth-wrapper.tsx`

Kode saat ini:

```ts
localStorage.setItem("adminAuth", "true");
```

Masalah:

- `localStorage` bisa diubah manual dari DevTools.
- Siapa pun bisa menjalankan:

```js
localStorage.setItem("adminAuth", "true");
```

- Setelah itu UI admin bisa terbuka.
- Ini hanya proteksi tampilan, bukan proteksi keamanan.

Cara mengatasi:

- Jangan pakai `localStorage` sebagai bukti login admin.
- Pakai cookie session yang dibuat server.
- Cookie harus memakai:
  - `httpOnly`
  - `Secure`
  - `SameSite=Lax` atau `SameSite=Strict`
- Validasi session harus dilakukan di server, bukan hanya di client.

## 3. Halaman `/admin` tidak diproteksi server-side

File:

- `src/app/admin/layout.tsx`

Masalah:

- Layout admin hanya memakai komponen client `AdminAuthWrapper`.
- Tidak ada middleware yang memblokir request ke `/admin`.
- Tidak ada validasi session di server.

Cara mengatasi:

- Tambahkan middleware untuk route `/admin/:path*`.
- Middleware harus mengecek session admin yang valid.
- Jika belum login, redirect ke halaman login.
- Jangan render admin page hanya berdasarkan state client.

Contoh target desain:

```txt
/admin/login       -> halaman login
/admin/*           -> wajib session admin valid
/api/admin/*       -> wajib session admin valid
```

## 4. Supabase anon key dipakai langsung untuk operasi admin

File:

- `src/lib/supabase.ts`
- `src/components/admin/outfit-form.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/edit/[id]/page.tsx`

Masalah:

- Client memakai `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Key dengan prefix `NEXT_PUBLIC_` memang bisa dilihat publik.
- Operasi insert, update, delete, dan upload dilakukan dari browser.
- Jika RLS terlalu terbuka, attacker bisa langsung memanggil Supabase API tanpa lewat UI admin.

Cara mengatasi:

- Frontend publik hanya boleh read data published dan insert analytics yang aman.
- Operasi admin harus dipindah ke server:
  - Next.js Route Handler
  - Server Action
  - atau backend terpisah
- Server memverifikasi session admin terlebih dahulu.
- Setelah valid, server boleh memakai Supabase service role key.
- Service role key tidak boleh pernah dikirim ke browser.

## 5. RLS Supabase mengizinkan publik mengubah data

File:

- `supabase/schema.sql`

Policy berbahaya:

```sql
CREATE POLICY "Public can insert outfits" ON outfits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update outfits" ON outfits FOR UPDATE USING (true);
CREATE POLICY "Public can delete outfits" ON outfits FOR DELETE USING (true);

CREATE POLICY "Public can insert outfit items" ON outfit_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update outfit items" ON outfit_items FOR UPDATE USING (true);
CREATE POLICY "Public can delete outfit items" ON outfit_items FOR DELETE USING (true);
```

Masalah:

- Semua orang bisa menambah outfit.
- Semua orang bisa mengubah outfit.
- Semua orang bisa menghapus outfit.
- Semua orang bisa mengubah link affiliate.

Cara mengatasi:

- Hapus policy public untuk insert/update/delete.
- Public hanya boleh membaca outfit yang `published = true`.
- Public hanya boleh membaca item outfit.
- Write admin harus dibatasi ke user admin atau dilakukan lewat server service role.

Contoh arah policy yang lebih aman:

```sql
DROP POLICY IF EXISTS "Public can insert outfits" ON outfits;
DROP POLICY IF EXISTS "Public can update outfits" ON outfits;
DROP POLICY IF EXISTS "Public can delete outfits" ON outfits;

DROP POLICY IF EXISTS "Public can insert outfit items" ON outfit_items;
DROP POLICY IF EXISTS "Public can update outfit items" ON outfit_items;
DROP POLICY IF EXISTS "Public can delete outfit items" ON outfit_items;
```

Jika memakai Supabase Auth, buat policy khusus admin berdasarkan `auth.uid()` atau custom claim role.

## 6. Storage upload terbuka untuk publik

File:

- `supabase/schema.sql`

Policy saat ini:

```sql
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'outfits');
```

Masalah:

- Publik bisa upload file ke bucket `outfits`.
- Bisa menyebabkan spam file, penyalahgunaan storage, dan biaya tambahan.
- Bisa dipakai untuk menghosting konten yang tidak diinginkan.

Cara mengatasi:

- Hapus policy public upload.
- Upload hanya boleh admin.
- Validasi file di server:
  - hanya `image/jpeg`, `image/png`, `image/webp`
  - ukuran maksimal, misalnya 2 MB atau 5 MB
  - nama file random
  - jangan percaya ekstensi file saja

Contoh minimal:

```sql
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
```

## 7. Tidak ada validasi server untuk input admin

File:

- `src/components/admin/outfit-form.tsx`

Masalah:

- Nama outfit, kategori, tags, dan link affiliate dikirim langsung dari client ke Supabase.
- Validasi hanya bergantung pada input browser.
- Attacker bisa bypass validasi HTML dengan request manual.

Cara mengatasi:

- Validasi ulang semua input di server.
- Batasi panjang field.
- Validasi format URL.
- Hanya izinkan domain affiliate yang valid, misalnya:
  - `shopee.co.id`
  - domain tracking resmi Shopee
  - `tiktok.com`
  - domain tracking resmi TikTok Shop
- Normalisasi kategori dan tags.

## 8. Tidak ada audit log aktivitas admin

Masalah:

- Jika ada data berubah, sulit tahu siapa yang mengubah.
- Tidak ada catatan login, upload, edit, atau delete.

Cara mengatasi:

- Buat tabel `admin_audit_logs`.
- Catat:
  - admin user id
  - aksi
  - target tabel
  - target id
  - waktu
  - IP address jika tersedia
  - user agent

Contoh event:

```txt
admin.login
outfit.create
outfit.update
outfit.delete
storage.upload
```

## Prioritas Perbaikan

### Prioritas 1: Tutup akses write publik Supabase

Ini harus dilakukan paling dulu.

Yang perlu diubah:

- Hapus policy public insert/update/delete untuk `outfits`.
- Hapus policy public insert/update/delete untuk `outfit_items`.
- Hapus policy public upload storage.

Alasan:

- Selama policy ini terbuka, keamanan admin UI tidak banyak berarti.
- Attacker bisa langsung menyerang Supabase API.

## Prioritas 2: Ganti login localStorage dengan auth server-side

Yang perlu diubah:

- Hapus `AdminAuthWrapper` sebagai mekanisme keamanan utama.
- Buat halaman `/admin/login`.
- Buat session cookie server-side.
- Tambahkan middleware untuk `/admin/*`.
- Proteksi juga endpoint `/api/admin/*`.

Alasan:

- Keputusan apakah user admin atau bukan harus terjadi di server.
- Client boleh menampilkan UI, tetapi tidak boleh menjadi sumber kebenaran auth.

## Prioritas 3: Pindahkan operasi admin ke server

Yang perlu diubah:

- Jangan insert/update/delete Supabase langsung dari komponen client.
- Buat endpoint server untuk:
  - create outfit
  - update outfit
  - delete outfit
  - upload image
  - delete image jika diperlukan
- Endpoint wajib validasi session admin.

Alasan:

- Service role key hanya aman jika dipakai di server.
- Validasi input bisa dipusatkan.
- RLS bisa dibuat jauh lebih ketat.

## Prioritas 4: Tambahkan hardening login

Yang perlu ditambahkan:

- Password kuat.
- Rate limit percobaan login.
- Lockout sementara setelah gagal berulang.
- MFA untuk admin.
- Logout yang menghapus session server.

## Prioritas 5: Tambahkan monitoring dan audit log

Yang perlu ditambahkan:

- Log aktivitas admin.
- Alert jika ada banyak login gagal.
- Alert jika ada banyak upload atau delete.
- Backup database rutin.

## Rekomendasi Arsitektur Aman

Desain yang disarankan:

```txt
Browser
  -> login ke /admin/login
  -> server membuat session cookie httpOnly
  -> admin page hanya terbuka jika middleware valid
  -> form admin submit ke /api/admin/outfits
  -> API cek session admin
  -> API validasi input
  -> API menulis ke Supabase memakai service role key
```

Supabase policy:

```txt
public anon:
  - boleh SELECT outfits published
  - boleh SELECT outfit_items
  - boleh INSERT affiliate_clicks dengan validasi terbatas
  - tidak boleh INSERT/UPDATE/DELETE outfits
  - tidak boleh INSERT/UPDATE/DELETE outfit_items
  - tidak boleh upload storage

server service role:
  - boleh melakukan operasi admin setelah session admin valid
```

## Checklist Perubahan Kode

- [ ] Hapus PIN hardcoded `elite123`.
- [ ] Hapus pemakaian `localStorage` untuk auth admin.
- [ ] Buat login admin server-side.
- [ ] Buat middleware proteksi `/admin/*`.
- [ ] Buat API/server action khusus admin.
- [ ] Pindahkan insert/update/delete outfit ke server.
- [ ] Pindahkan upload image ke server.
- [ ] Tambahkan validasi input server-side.
- [ ] Hapus policy public write di Supabase.
- [ ] Hapus policy public upload di Supabase Storage.
- [ ] Tambahkan audit log admin.
- [ ] Tambahkan rate limit login.
- [ ] Tambahkan backup dan monitoring.

## Kesimpulan

Admin login saat ini lemah karena hanya berupa proteksi frontend. PIN bisa dilihat atau dilewati, session bisa dipalsukan lewat `localStorage`, dan policy Supabase memberi akses tulis ke publik.

Perbaikan paling penting adalah menutup RLS public write dan memindahkan semua operasi admin ke server yang memverifikasi session admin. Setelah itu, baru hardening login seperti password kuat, rate limit, MFA, dan audit log.
