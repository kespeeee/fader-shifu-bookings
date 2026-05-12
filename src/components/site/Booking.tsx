import { BookingForm } from "./BookingForm";

export function Booking() {
  return (
    <section id="broneeri" className="relative bg-transparent py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader eyebrow="Broneeri aeg" title="BRONEERI KOHE" />
        <p className="mb-10 text-center text-muted-foreground">
          Vali endale sobiv aeg ja teenus. Kinnitame broneeringu e-posti teel.
        </p>
        <BookingForm />
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-primary">
        <span className="h-px w-8 bg-primary" />
        {eyebrow}
        <span className="h-px w-8 bg-primary" />
      </div>
      <h2 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl">{title}</h2>
    </div>
  );
}
