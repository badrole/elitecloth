import Link from "next/link";
import { InstallAppButton } from "./install-app-button";

const footerLinks = [
  { label: "Katalog Outfit", href: "/outfit" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-ink-black">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3
              className="mb-3 text-lg font-bold tracking-tight text-warm-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ELITECLOTH
            </h3>
            <p className="text-sm leading-relaxed text-warm-white/50">
              Katalog outfit Indonesia. Temukan inspirasi gaya yang terkurasi, 
              langsung terhubung ke Shopee dan TikTok Shop.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-warm-white/40">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-white/50 transition-colors hover:text-warm-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-warm-white/40">
              Ikuti Kami
            </h4>
            <div className="flex flex-col gap-3 items-start">
              <a
                href="https://tiktok.com/@elcloth.storee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-full border border-border-subtle px-4 text-warm-white/50 transition-all hover:border-border-hover hover:text-warm-white"
                aria-label="TikTok"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.61a8.24 8.24 0 0 0 4.76 1.52V6.69h-1z"/>
                </svg>
                <span className="text-xs font-medium">@elcloth.storee</span>
              </a>
              <a
                href="https://instagram.com/elcloth.store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-full border border-border-subtle px-4 text-warm-white/50 transition-all hover:border-border-hover hover:text-warm-white"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <span className="text-xs font-medium">@elcloth.store</span>
              </a>
            </div>
          </div>
        </div>

        {/* Install App + Copyright */}
        <div className="mt-10 border-t border-border-subtle pt-6">
          <InstallAppButton />
          <p className="mt-4 text-xs text-warm-white/20">
            © {new Date().getFullYear()} Elitecloth. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
