import { TESTIMONIALS } from "@/lib/site-data";
import { SectionHeader } from "./Booking";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section id="tagasiside" className="border-t border-border bg-transparent py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader eyebrow="Tagasiside" title="MIDA KLIENDID ÜTLEVAD" />

        <Carousel opts={{ loop: true, align: "start" }} className="px-2">
          <CarouselContent>
            {TESTIMONIALS.map((t, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/2">
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-card">
                  <Quote className="mb-4 h-8 w-8 text-primary/60" />
                  <p className="mb-6 text-lg italic text-foreground/90">"{t.text}"</p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="font-display text-lg tracking-wide">{t.name}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
