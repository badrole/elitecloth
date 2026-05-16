# Audit Keamanan Admin Elitecloth

Tanggal audit ulang: 14 Mei 2026

Audit ini berdasarkan kode lokal terbaru setelah perbaikan admin login dan API admin.

## Jawaban Singkat

### Berapa lama admin panel bisa dibobol?

Sebelum perbaikan:

- Estimasi: **hitungan menit**.
- Alasannya: login bisa dibypass lewat `localStorage`, dan Supabase policy mengizinkan publik mengubah data.

Setelah perbaikan sekarang:

- Estimasi untuk orang awam: **kemungkinan besar tidak bisa tembus langsung**.
- Estimasi untuk attacker yang paham web security: **masih ada peluang jika konfigurasi production kurang ketat atau secret/key bocor**.
- Admin panel sekarang sudah jauh lebih sulit dibobol karena memakai cookie `HttpOnly`, route admin diproteksi server-side, dan operasi admin sudah lewat API server.

### Berapa persen keamanan website sekarang?

Estimasi keamanan saat ini: **65-75% untuk standar MVP kecil**.

Angka ini bukan ukuran absolut, tetapi estimasi berdasarkan kondisi kode yang terlihat.

Kenapa belum 90%:

- `supabase/schema.sql` masih menyimpan policy public write lama.
- `SUPABASE_SERVICE_ROLE_KEY` masih fallback ke anon key.
- `ADMIN_SESSION_SECRET` masih punya default lemah.
- Password admin masih memakai SHA-256 polos.
- Rate limit login masih in-memory.
- Validasi endpoint admin masih belum ketat.
- Belum ada audit log admin.

Jika 3 hal utama ini dibereskan:

- Bersihkan `supabase/schema.sql` dari policy public write dan public upload.
- Hapus fallback secret/key yang tidak aman.
- Ganti SHA-256 password hash dengan bcrypt, argon2, atau PBKDF2 salted.

Maka estimasi keamanan bisa naik ke sekitar **80-85%**.

Untuk mencapai **90%+**, tambahkan:

- Rate limit production-grade.
- Audit log admin.
- Validasi URL, slug, tags, dan `deleteIds`.
- MFA untuk admin.
- Monitoring login gagal, upload, edit, dan delete.

## Status Saat Ini

Status keamanan admin: **jauh lebih aman dari versi sebelumnya, tetapi belum final**.

Perbaikan besar yang sudah dilakukan:

- PIN hardcoded `elite123` sudah tidak ditemukan.
- Auth admin tidak lagi memakai `localStorage`.
- Admin login sudah memakai endpoint server `/api/admin/login`.
- Session admin sudah memakai cookie `HttpOnly`.
- Route `/admin/*` dan `/api/admin/*` sudah diproteksi lewat `src/proxy.ts`.
- Operasi admin sudah dipindahkan ke API server.
- Form admin tidak lagi langsung melakukan insert/update/delete ke Supabase dari browser.
- Upload admin sudah lewat `/api/admin/upload`.
- Upload sudah membatasi MIME type dan ukuran file.
- File `supabase/fix-rls-policies.sql` sudah tersedia untuk menghapus policy write publik.

## Celah Lama yang Sudah Ditutup

### 1. PIN admin hardcoded di frontend

Status: **selesai**

Sebelumnya PIN admin disimpan langsung di komponen frontend. Sekarang PIN tersebut tidak ditemukan lagi, dan login memakai `ADMIN_PASSWORD_HASH` di server.

### 2. Bypass login lewat localStorage

Status: **selesai**

Sebelumnya status login disimpan sebagai `localStorage.adminAuth`. Sekarang `localStorage` tidak lagi dipakai untuk autentikasi admin.

### 3. Halaman admin hanya diproteksi client-side

Status: **sebagian besar selesai**

Sekarang ada `src/proxy.ts` yang memproteksi:

```txt
/admin/:path*
/api/admin/:path*
```

Jika session tidak valid, halaman admin diarahkan ke `/admin/login`, dan API admin mengembalikan `401`.

### 4. Operasi admin langsung dari browser ke Supabase

Status: **selesai untuk flow admin utama**

Komponen admin sekarang memanggil endpoint server:

```txt
/api/admin/outfits
/api/admin/outfits/[id]
/api/admin/outfits/[id]/items
/api/admin/upload
```

Ini lebih aman dibanding versi sebelumnya karena browser tidak lagi langsung melakukan write ke tabel admin dengan Supabase anon key.

### 5. Public upload langsung dari browser

Status: **selesai di kode aplikasi, perlu pastikan policy production sudah diperbarui**

Upload admin sekarang lewat API server dan memakai validasi dasar. Namun keamanan final tetap bergantung pada policy Supabase production.

## Celah yang Masih Perlu Diperbaiki

### 1. `supabase/schema.sql` masih berisi policy write publik lama

Status: **masih perlu diperbaiki**

File `supabase/fix-rls-policies.sql` sudah benar untuk menghapus policy berbahaya, tetapi `supabase/schema.sql` masih membuat policy lama ini:

```sql
CREATE POLICY "Public can insert outfits" ON outfits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update outfits" ON outfits FOR UPDATE USING (true);
CREATE POLICY "Public can delete outfits" ON outfits FOR DELETE USING (true);

CREATE POLICY "Public can insert outfit items" ON outfit_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update outfit items" ON outfit_items FOR UPDATE USING (true);
CREATE POLICY "Public can delete outfit items" ON outfit_items FOR DELETE USING (true);
```

`supabase/schema.sql` juga masih membuat policy public upload:

```sql
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'outfits');
```

Risiko:

- Jika database dibuat ulang dari `schema.sql`, celah lama akan aktif lagi.
- Developer bisa keliru menjalankan `schema.sql` tanpa menjalankan `fix-rls-policies.sql`.

Yang perlu diubah:

- Hapus policy public insert/update/delete dari `supabase/schema.sql`.
- Hapus policy `Public Upload` dari `supabase/schema.sql`.
- Jadikan `fix-rls-policies.sql` sebagai migrasi tambahan atau gabungkan ke schema utama.

### 2. Server Supabase client fallback ke anon key

Status: **masih perlu diperbaiki**

File:

- `src/lib/supabase-server.ts`

Masalah:

```ts
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
```

Risiko:

- Jika `SUPABASE_SERVICE_ROLE_KEY` tidak ada di production, API admin diam-diam memakai anon key.
- Ini bisa membuat behavior production tidak jelas dan bergantung pada RLS.
- Untuk admin API, gagal cepat lebih aman daripada fallback ke anon key.

Yang perlu diubah:

```ts
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
}
```

### 3. Session secret masih punya default lemah

Status: **masih perlu diperbaiki**

File:

- `src/proxy.ts`
- `src/lib/supabase-server.ts`

Masalah:

```ts
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "elitecloth-admin-secret-change-me";
```

Risiko:

- Jika env `ADMIN_SESSION_SECRET` lupa di-set, production memakai secret default yang bisa ditebak.
- Session admin bisa dipalsukan jika secret diketahui.

Yang perlu diubah:

- Jangan punya fallback default untuk secret.
- Production harus error jika `ADMIN_SESSION_SECRET` kosong.
- Gunakan secret random minimal 32 byte.

### 4. Password admin memakai SHA-256 polos

Status: **masih perlu diperbaiki**

File:

- `src/app/api/admin/login/route.ts`

Masalah:

Password di-hash memakai SHA-256 biasa:

```ts
crypto.subtle.digest("SHA-256", data)
```

Risiko:

- SHA-256 terlalu cepat untuk password hashing.
- Jika hash bocor, brute force lebih mudah.

Yang perlu diubah:

- Pakai password hashing yang memang didesain untuk password, misalnya `bcrypt`, `argon2`, atau minimal PBKDF2 dengan salt dan iterasi tinggi.
- Simpan hash salted, bukan SHA-256 polos.

### 5. Perbandingan hash belum constant-time

Status: **masih perlu diperbaiki**

File:

- `src/app/api/admin/login/route.ts`
- `src/proxy.ts`
- `src/lib/supabase-server.ts`

Masalah:

Hash dibandingkan dengan `===`.

Risiko:

- Secara teori rentan timing attack.
- Dampaknya lebih kecil dibanding poin lain, tetapi mudah diperbaiki.

Yang perlu diubah:

- Gunakan `crypto.timingSafeEqual` di runtime Node.js.
- Atau implementasi constant-time compare untuk Edge/proxy jika tetap berjalan di Edge runtime.

### 6. Rate limit login masih in-memory

Status: **masih perlu diperbaiki untuk production**

File:

- `src/app/api/admin/login/route.ts`

Masalah:

Rate limit disimpan di `Map` memory lokal.

Risiko:

- Tidak stabil di serverless.
- Reset saat instance restart.
- Tidak efektif jika ada banyak instance.

Yang perlu diubah:

- Pakai storage eksternal seperti Redis, Upstash, database, atau rate limit platform.
- Rate limit sebaiknya berdasarkan IP dan fingerprint tambahan.

### 7. Validasi input admin masih belum cukup ketat

Status: **masih perlu diperbaiki**

File:

- `src/app/api/admin/outfits/route.ts`
- `src/app/api/admin/outfits/[id]/route.ts`
- `src/app/api/admin/outfits/[id]/items/route.ts`

Yang sudah ada:

- Validasi field wajib.
- Batas panjang `name` dan `category`.
- Upload membatasi MIME dan ukuran.

Yang masih kurang:

- Validasi slug.
- Validasi panjang tags.
- Validasi jumlah gallery image.
- Validasi URL gambar harus berasal dari storage yang diizinkan.
- Validasi domain affiliate Shopee/TikTok.
- Validasi `deleteIds` harus milik outfit yang sedang diedit.

Risiko:

- Admin endpoint bisa menerima data tidak sesuai format jika session bocor.
- Data affiliate bisa diarahkan ke domain yang tidak diinginkan.
- Item milik outfit lain bisa ikut terhapus jika request dibuat manual dengan `deleteIds` yang salah.

### 8. Dependency `sharp` belum tercatat di `package.json`

Status: **masih perlu diperbaiki**

File:

- `src/app/api/admin/upload/route.ts`
- `package.json`

Masalah:

Route upload mengimpor:

```ts
import sharp from "sharp";
```

Namun `sharp` belum ada di `dependencies` `package.json`.

Risiko:

- Build/deploy bisa gagal di environment bersih.
- Upload admin bisa error di production.

Yang perlu diubah:

- Tambahkan `sharp` ke dependencies.

### 9. Belum ada audit log admin

Status: **masih perlu ditambahkan**

Risiko:

- Jika ada perubahan data, belum ada catatan siapa melakukan apa.
- Sulit investigasi jika terjadi penyalahgunaan akun admin.

Yang perlu ditambahkan:

- Tabel `admin_audit_logs`.
- Log event:
  - `admin.login`
  - `admin.logout`
  - `outfit.create`
  - `outfit.update`
  - `outfit.delete`
  - `storage.upload`
  - `storage.cleanup`

## Prioritas Perbaikan Berikutnya

### Prioritas 1

Ubah `supabase/schema.sql` agar tidak lagi membuat policy write publik dan public upload.

### Prioritas 2

Hapus fallback env berbahaya:

- `SUPABASE_SERVICE_ROLE_KEY || NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_SESSION_SECRET || "elitecloth-admin-secret-change-me"`

### Prioritas 3

Ganti SHA-256 password hash dengan bcrypt/argon2/PBKDF2 salted.

### Prioritas 4

Perketat validasi endpoint admin, terutama slug, URL affiliate, URL storage, dan `deleteIds`.

### Prioritas 5

Tambahkan audit log dan rate limit production-grade.

## Kesimpulan

Perbaikan yang sudah dilakukan membuat admin jauh lebih aman dibanding versi awal. Celah paling parah, yaitu PIN frontend, `localStorage`, dan write admin langsung dari browser, sudah ditutup di flow aplikasi.

Namun dokumen ini belum boleh dikosongkan karena masih ada risiko residual yang perlu ditangani, terutama `schema.sql` yang masih menyimpan policy lama, fallback secret/key yang tidak aman, password hash SHA-256 polos, dan validasi API admin yang masih minimal.
