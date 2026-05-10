import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";

const NAV = [
  { href: "/#teenused", label: "Teenused" },
  { href: "/#galerii", label: "Galerii" },
  { href: "/pood", label: "Pood" },
  { href: "/#fadershifust", label: "Minust" },
  { href: "/#kontakt", label: "Kontakt" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border bg-white/70 backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" hash="top"><Logo /></Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={cn(
                "text-sm font-medium uppercase tracking-wider transition-colors",
                scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/85 hover:text-white"
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CartButton scrolled={scrolled} />
          <Button asChild variant="default" size="lg" className="font-display tracking-wider">
            <a href="/#broneeri">Broneeri kohe</a>
          </Button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <CartButton scrolled={scrolled} />
          <button onClick={() => setOpen(!open)} aria-label="Menüü" className={scrolled ? "" : "text-white"}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white/95 backdrop-blur md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function CartButton({ scrolled }: { scrolled: boolean }) {
  const { count } = useCart();
  return (
    <Link
      to="/pood"
      aria-label="Ostukorv"
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition",
        scrolled ? "border-border text-foreground hover:bg-muted" : "border-white/40 text-white hover:bg-white/10"
      )}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
