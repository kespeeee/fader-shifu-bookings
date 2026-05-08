import { SectionHeader } from "./Booking";

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
          </div>

          <div>
            <h3 className="font-display text-3xl">
              Tere, mina olen <span className="text-primary">Stefan Taaber</span>
            </h3>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                Alustasin oma teekonda isa garaažis ja koolis — tegin sõpradele tasuta lõikusi,
                et üldse proovida, kas see on minu asi. Selgus, et on.
              </p>
              <p>
                Kui käsi muutus kindlamaks ja tulemused paremaks, kolisin uutesse pindadesse
                ning hakkasin tegelema sellega täiega. Praeguseks on kogemust umbes 2 aastat
                ning iga lõikus viib mind sammu võrra paremaks.
              </p>
              <p className="border-l-2 border-primary pl-4 italic text-foreground">
                "I make you win — sinu stiil, minu tera."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
