import { cn } from "@/lib/utils";
import logoImg from "@/assets/fs-logo.jpeg";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logoImg}
        alt="FS Barber Shop logo"
        className="h-10 w-10 rounded-full border border-primary/40 object-cover"
      />
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-wider">FADERSHIFU</div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Barber Shop</div>
      </div>
    </div>
  );
}
