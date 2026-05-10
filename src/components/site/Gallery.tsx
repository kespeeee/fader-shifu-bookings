import { useState } from "react";
import { GALLERY, GALLERY_FILTERS } from "@/lib/site-data";
import { SectionHeader } from "./Booking";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export function Gallery() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const items = filter === "all" ? GALLERY : GALLERY.filter((g) => g.category === filter);

  return (
    <section id="galerii" className="border-t border-border bg-transparent py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Minu tööd" title="GALERII" />

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium uppercase tracking-wider transition-all",
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setOpen(item.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-border bg-secondary transition-all hover:border-primary/60",
                i % 5 === 0 ? "aspect-[3/4] sm:row-span-2 sm:aspect-auto" : "aspect-square"
              )}
            >
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-card">
                <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background via-background/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-display text-sm uppercase tracking-wider">{item.title}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Pildid laaditakse peagi üles. Vahepeal vaata Instagrami!
        </p>

        <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
          <DialogContent className="max-w-3xl border-border bg-card">
            <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-secondary">
              <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
            </div>
            <p className="text-center text-sm text-muted-foreground">Pildi platseholder</p>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
