import { SITE } from "@/lib/site-data";
import { SectionHeader } from "./Booking";
import { MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";

export function Contact() {
  return (
    <section id="kontakt" className="border-t border-border bg-transparent py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Kontakt ja asukoht" title="LEIA MEID ÜLES" />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <iframe
              title="Asukoht kaardil"
              src="https://www.google.com/maps?q=Tallinna+mnt+36,+65605+Võru,+Estonia&output=embed"
              className="h-[450px] w-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <InfoRow icon={MapPin} title="Asukoht" lines={[SITE.address]} />
            <InfoRow icon={Phone} title="Telefon" lines={[SITE.phone]} href={`tel:${SITE.phone.replace(/\s/g, "")}`} />
            <InfoRow icon={Mail} title="E-post" lines={[SITE.email]} href={`mailto:${SITE.email}`} />

            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Fikseeritud lahtiolekuaegu pole — broneeri vaba aeg otse veebist.
              Vali endale sobiv kuupäev ja kellaaeg <a href="#broneeri" className="text-primary underline">broneerimisvormist</a>.
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
