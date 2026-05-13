import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Elitecloth — informasi yang kami kumpulkan dan bagaimana kami menggunakannya.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1
        className="mb-8 text-3xl font-bold tracking-tight text-warm-white md:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Kebijakan Privasi
      </h1>

      <div className="prose-invert space-y-6 text-sm leading-relaxed text-warm-white/60">
        <p>
          Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            1. Tentang Elitecloth
          </h2>
          <p>
            Elitecloth adalah platform katalog outfit yang mengkurasi kombinasi
            pakaian dari produk marketplace seperti Shopee dan TikTok Shop.
            Elitecloth bukan toko online dan tidak memproses transaksi pembelian.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            2. Informasi yang Kami Kumpulkan
          </h2>
          <p>Kami mengumpulkan informasi berikut secara otomatis:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Alamat IP dan data perangkat (user agent)</li>
            <li>Halaman yang dikunjungi dan durasi kunjungan</li>
            <li>Sumber traffic (referrer)</li>
            <li>Klik pada tombol affiliate (marketplace, waktu, dan outfit terkait)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            3. Bagaimana Kami Menggunakan Informasi
          </h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Menganalisis performa konten dan outfit</li>
            <li>Memperbaiki pengalaman pengguna</li>
            <li>Menghitung komisi affiliate</li>
            <li>Mendeteksi dan mencegah penyalahgunaan</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            4. Layanan Pihak Ketiga
          </h2>
          <p>Kami menggunakan layanan berikut:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>Google Analytics 4</strong> — analisis traffic website
            </li>
            <li>
              <strong>Microsoft Clarity</strong> — heatmap dan session recording
            </li>
            <li>
              <strong>Supabase</strong> — penyimpanan data dan gambar
            </li>
            <li>
              <strong>Shopee Affiliate & TikTok Shop Affiliate</strong> — program
              affiliate marketplace
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            5. Cookies
          </h2>
          <p>
            Website ini menggunakan cookies dari Google Analytics dan Microsoft
            Clarity untuk menganalisis penggunaan website. Anda dapat menonaktifkan
            cookies melalui pengaturan browser Anda.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            6. Disclaimer Affiliate
          </h2>
          <p>
            Elitecloth adalah platform affiliate. Kami menerima komisi jika Anda
            membeli produk melalui link yang kami sediakan. Hal ini tidak
            mempengaruhi harga produk yang Anda beli. Harga yang ditampilkan
            di website ini adalah estimasi dan dapat berubah sewaktu-waktu.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-warm-white">
            7. Kontak
          </h2>
          <p>
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan
            hubungi kami melalui email di{" "}
            <a
              href="mailto:hello@elitecloth.id"
              className="text-warm-white underline"
            >
              hello@elitecloth.id
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
