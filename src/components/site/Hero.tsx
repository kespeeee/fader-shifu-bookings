import { Button } from "@/components/ui/button";
import { Scissors, Star } from "lucide-react";
import { SITE } from "@/lib/site-data";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-gradient-hero pt-24">
      {/* graffiti background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div className="absolute -left-20 top-32 h-96 w-96 rounded-full bg-primary blur-[120px]" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent blur-[120px]" />
      </div>

      {/* barber pole stripe */}
      <div className="absolute left-0 top-0 hidden h-full w-3 md:block">
        <div className="barber-pole h-full w-full" />
      </div>
      <div className="absolute right-0 top-0 hidden h-full w-3 md:block">
        <div className="barber-pole h-full w-full" />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-6rem)] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="fade-in-up inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
          <Scissors className="h-3 w-3 text-primary" />
          Tallinna parim barber shop
        </div>

        <h1 className="fade-in-up mt-8 font-display text-5xl font-bold leading-[0.9] sm:text-7xl md:text-8xl lg:text-9xl">
          FADER<span className="text-gradient-purple">SHIFU</span>
        </h1>

        <p className="fade-in-up mt-6 max-w-xl text-xl font-medium text-foreground/90 sm:text-2xl">
          {SITE.tagline}
        </p>

        <p className="fade-in-up mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          Feidid, terav kontuur ja habemekunst — Võrus.
        </p>

        <div className="fade-in-up mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-14 px-10 font-display text-lg tracking-wider shadow-[0_0_40px_-8px_var(--primary)]">
            <a href="#broneeri">Broneeri kohe</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-10 font-display text-lg tracking-wider">
            <a href="#teenused">Vaata teenuseid</a>
          </Button>
        </div>

        <div className="fade-in-up mt-12 flex items-center gap-2 text-sm text-muted-foreground">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
      </div>
    </section>
  );
}
