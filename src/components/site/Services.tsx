import { SERVICES } from "@/lib/site-data";
import { Scissors } from "lucide-react";
import { SectionHeader } from "./Booking";
import { Button } from "@/components/ui/button";

export function Services() {
  return (
    <section id="teenused" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Teenused ja hinnad" title="MEISTRI MENÜÜ" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl tracking-wide">{s.name}</h3>
              <p className="mb-4 min-h-[3rem] text-sm text-muted-foreground">{s.desc}</p>
              <div className="flex items-end justify-between border-t border-border pt-4">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Alates</span>
                <span className="font-display text-2xl text-primary">{s.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="font-display tracking-wider">
            <a href="#broneeri">Broneeri teenus</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
