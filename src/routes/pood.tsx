import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { cart, useCart, formatEUR, type CartItem } from "@/lib/cart-store";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Package } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  stock: number;
};

export const Route = createFileRoute("/pood")({
  head: () => ({
    meta: [
      { title: "FaderShifu Pood — Tooted ja kingikaardid" },
      { name: "description", content: "FaderShifu pood: pomaadid, habemehooldus, riided ja kingikaardid." },
      { property: "og:title", content: "FaderShifu Pood" },
      { property: "og:description", content: "Osta FaderShifu tooteid ja kingikaarte." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, total, count } = useCart();

  useEffect(() => {
    supabase
      .from("products")
      .select("id,name,description,price_cents,image_url,stock")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) toast.error("Toodete laadimine ebaõnnestus");
        setProducts((data ?? []) as Product[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Tagasi avalehele
          </Link>

          <h1 className="font-display text-5xl font-bold tracking-wide text-foreground sm:text-6xl md:text-7xl">
            <span className="text-gradient-purple">POOD</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            FaderShifu tooted, hooldusvahendid ja kingikaardid — saadaval ka stuudios.
          </p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 lg:grid-cols-[1fr_360px]">
          <div>
            {loading ? (
              <div className="text-foreground/70">Laen tooteid…</div>
            ) : products.length === 0 ? (
              <div className="rounded-xl border border-border bg-card/80 p-8 text-center">
                Tooteid ei leitud.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>

          <CartPanel items={items} total={total} count={count} />
        </section>
      </main>
      <Footer />
      <Toaster theme="light" position="top-center" richColors />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-card backdrop-blur transition hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/15 to-accent/10">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/50">
            <Package className="h-20 w-20" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl tracking-wide">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-2xl text-primary">{formatEUR(product.price_cents)}</span>
          <Button
            size="sm"
            onClick={() => {
              cart.add({
                id: product.id,
                name: product.name,
                price_cents: product.price_cents,
                image_url: product.image_url,
              });
              toast.success(`${product.name} lisatud korvi`);
            }}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? "Otsas" : "Lisa korvi"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CartPanel({ items, total, count }: { items: CartItem[]; total: number; count: number }) {
  const [checkingOut, setCheckingOut] = useState(false);

  const checkout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { items: items.map((i) => ({ id: i.id, qty: i.qty })) },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error("Maksesessiooni loomine ebaõnnestus");
    } catch (e: any) {
      toast.error(e?.message ?? "Maksed pole veel seadistatud. Palun seadista Stripe.");
      setCheckingOut(false);
    }
  };

  return (
    <aside className="sticky top-28 h-fit rounded-2xl border border-border bg-card/95 p-6 shadow-card backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl tracking-wide">Ostukorv ({count})</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Korv on tühi.</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 py-3">
              <div className="flex-1">
                <div className="text-sm font-medium">{i.name}</div>
                <div className="text-xs text-muted-foreground">{formatEUR(i.price_cents)}</div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md border border-border">
                  <button className="p-1" onClick={() => cart.setQty(i.id, i.qty - 1)} aria-label="Vähenda">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-6 text-center text-sm">{i.qty}</span>
                  <button className="p-1" onClick={() => cart.setQty(i.id, i.qty + 1)} aria-label="Suurenda">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{formatEUR(i.price_cents * i.qty)}</div>
                <button
                  onClick={() => cart.remove(i.id)}
                  className="mt-2 text-muted-foreground hover:text-destructive"
                  aria-label="Eemalda"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm uppercase tracking-wider text-muted-foreground">Kokku</span>
        <span className="font-display text-2xl text-primary">{formatEUR(total)}</span>
      </div>

      <Button className="mt-4 w-full" size="lg" disabled={items.length === 0 || checkingOut} onClick={checkout}>
        {checkingOut ? "Suunan maksele…" : "Mine maksma"}
      </Button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Maksed turvaliselt Stripe'i kaudu
      </p>
    </aside>
  );
}
