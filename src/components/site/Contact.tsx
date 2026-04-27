import { SITE } from "@/lib/site-data";
import { SectionHeader } from "./Booking";
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react";

export function Contact() {
  return (
    <section id="kontakt" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Kontakt ja asukoht" title="LEIA MEID ÜLES" />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <iframe
              title="Asukoht kaardil"
              src="https://www.google.com/maps?q=Tallinn,+Estonia&output=embed"
              className="h-[450px] w-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <InfoRow icon={MapPin} title="Aadress" lines={[SITE.address]} />
            <InfoRow icon={Phone} title="Telefon" lines={[SITE.phone]} href={`tel:${SITE.phone.replace(/\s/g, "")}`} />
            <InfoRow icon={Mail} title="E-post" lines={[SITE.email]} href={`mailto:${SITE.email}`} />

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl tracking-wide">Lahtiolekuajad</h3>
              </div>
              <ul className="space-y-2 text-sm">
                {SITE.hours.map((h) => (
                  <li key={h.day} className="flex justify-between border-b border-border/40 py-1.5 last:border-0">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <a
                href={`https://instagram.com/${SITE.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-4 transition-all hover:border-primary/60 hover:shadow-glow"
              >
                <Instagram className="h-5 w-5 text-primary" />
                <span className="font-display tracking-wider">Instagram</span>
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-4 transition-all hover:border-primary/60 hover:shadow-glow"
              >
                <MessageCircle className="h-5 w-5 text-primary" />
                <span className="font-display tracking-wider">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, title, lines, href }: { icon: typeof MapPin; title: string; lines: string[]; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
        {lines.map((l) => <div key={l} className="text-foreground">{l}</div>)}
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
