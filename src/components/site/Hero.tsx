import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 md:pt-32"
    >
      {/* ambient glow accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-primary/25 blur-[160px]" />
        <div className="absolute -bottom-32 right-10 h-[40vh] w-[40vh] rounded-full bg-accent/30 blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-start">
          {/* eyebrow */}
          <div className="fade-in-up inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.32em] text-foreground/70 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Võru · Established Barber
          </div>

          {/* headline */}
          <h1
            className="fade-in-up mt-8 font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-tight text-foreground"
            style={{ animationDelay: "80ms" }}
          >
            Sharp fades.
            <br />
            <span className="text-gradient-purple">Clean confidence.</span>
          </h1>

          {/* subtext */}
          <p
            className="fade-in-up mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            Premium barber Võrus. Kiired bookingud, puhtad fade'id ja
            professionaalne kogemus.
          </p>

          {/* CTAs */}
          <div
            className="fade-in-up mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            style={{ animationDelay: "260ms" }}
          >
            <Button
              asChild
              size="lg"
              className="group h-14 rounded-full px-8 font-display text-base tracking-[0.18em] shadow-[0_18px_40px_-16px_var(--primary)] transition-transform hover:-translate-y-0.5"
            >
              <a href="#broneeri">
                Broneeri aeg
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-foreground/15 bg-white/40 px-8 font-display text-base tracking-[0.18em] text-foreground backdrop-blur-md hover:bg-white/70"
            >
              <a href="#galerii">Vaata töid</a>
            </Button>
          </div>

          {/* social proof */}
          <div
            className="fade-in-up mt-8 flex items-center gap-4"
            style={{ animationDelay: "340ms" }}
          >
            <div className="flex -space-x-2">
              {[
                "from-primary to-accent",
                "from-accent to-primary",
                "from-primary/80 to-foreground/60",
              ].map((g, i) => (
                <div
                  key={i}
                  className={`h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br ${g}`}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
                <span className="ml-2 text-sm font-semibold text-foreground">5.0</span>
              </div>
              <span className="text-xs text-muted-foreground">
                500+ rahulolevat klienti Võrumaal
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
