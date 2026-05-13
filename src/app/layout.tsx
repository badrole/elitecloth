import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Elitecloth — Inspirasi Outfit Cowok Kuliah",
    template: "%s | Elitecloth",
  },
  description:
    "Katalog outfit cowok kuliah low budget, dikurasi oleh AI. Temukan kombinasi pakaian terbaik langsung terhubung ke Shopee dan TikTok Shop.",
  keywords: [
    "outfit cowok",
    "fashion pria",
    "outfit kuliah",
    "outfit murah",
    "elitecloth",
    "inspirasi outfit",
    "fashion affiliate",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Elitecloth",
    title: "Elitecloth — Inspirasi Outfit Cowok Kuliah",
    description:
      "Katalog outfit cowok kuliah low budget, dikurasi oleh AI. Langsung terhubung ke Shopee dan TikTok Shop.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elitecloth — Inspirasi Outfit Cowok Kuliah",
    description:
      "Katalog outfit cowok kuliah low budget, dikurasi oleh AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
