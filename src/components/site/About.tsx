import { SectionHeader } from "./Booking";
import { Award, Scissors, Users } from "lucide-react";

const STATS = [
  { icon: Users, value: "500+", label: "Püsiklienti" },
  { icon: Scissors, value: "8", label: "Aastat kogemust" },
  { icon: Award, value: "100%", label: "Pühendumus" },
];

export function About() {
  return (
    <section id="fadershifust" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Tutvu meistriga" title="FADERSHIFUST" />

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-card">
              <div className="flex h-full w-full items-center justify-center">
                <div className="font-display text-7xl text-primary/30">FS</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 hidden rounded-xl border border-primary/40 bg-card px-6 py-4 shadow-glow md:block">
              <div className="font-display text-3xl text-primary">8 a</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Kogemus</div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-3xl">Tere, mina olen <span className="text-primary">FaderShifu</span></h3>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Olen tegutsenud habemeajajana üle 8 aasta ning minu kirg on teha igast kliendist
                veidi parem versioon iseendast. Iga lõikus on minu jaoks kunst — täpsus,
                detail ja stiil ei ole valikulised.
              </p>
              <p>
                Spetsialiseerun moodsatele feididele, terava kontuuriga lõikustele ja
                klassikalistele habemekujundustele. Õppinud parimate juures, treenitud ja
                sertifitseeritud rahvusvahelistes barbershop'i akadeemiates.
              </p>
              <p className="border-l-2 border-primary pl-4 italic text-foreground">
                "Hea lõikus algab kuulamisest. Sinu stiil, sinu vibe — minu tera."
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <div className="font-display text-2xl">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
