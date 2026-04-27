import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-md border border-primary/40 bg-background">
        <span className="font-display text-xl font-bold text-primary">FS</span>
        <div className="absolute -right-1 top-0 h-full w-1 overflow-hidden rounded-r-md">
          <div className="barber-pole h-full w-full" />
        </div>
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-wider">FADERSHIFU</div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Barber Shop</div>
      </div>
    </div>
  );
}
