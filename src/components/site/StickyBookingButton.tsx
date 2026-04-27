import { Calendar } from "lucide-react";

export function StickyBookingButton() {
  return (
    <a
      href="#broneeri"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-105 md:hidden"
    >
      <Calendar className="h-4 w-4" />
      Broneeri kohe
    </a>
  );
}
