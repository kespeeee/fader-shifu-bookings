import { Logo } from "./Logo";
import { SITE } from "@/lib/site-data";
import { Instagram, MessageCircle } from "lucide-react";

const LINKS = [
  { href: "#teenused", label: "Teenused" },
  { href: "#galerii", label: "Galerii" },
  { href: "#fadershifust", label: "Minust" },
  { href: "#kontakt", label: "Kontakt" },
  { href: "#broneeri", label: "Broneeri" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-transparent py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-white/80">
            {SITE.tagline} Barber shop Võrus.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Kiirelt</h4>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-white/85 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Sotsiaalmeedia</h4>
          <div className="flex gap-3">
            <a
              href={`https://instagram.com/${SITE.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 transition-all hover:bg-white/10"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/30 transition-all hover:bg-white/10"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-4 text-sm text-white/80">{SITE.address}</p>
          <p className="text-sm text-white/80">{SITE.phone}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 px-6 pt-6">
        <p className="text-center text-xs text-white/70">
          © {new Date().getFullYear()} FaderShifu Barber Shop. Kõik õigused kaitstud.
        </p>
      </div>
    </footer>
  );
}
