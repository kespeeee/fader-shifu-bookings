import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  qty: number;
};

const KEY = "fs-cart-v1";
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export const cart = {
  add(item: Omit<CartItem, "qty">) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.qty += 1;
    else items.push({ ...item, qty: 1 });
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  setQty(id: string, qty: number) {
    const items = read().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
    write(items);
  },
  clear() {
    write([]);
  },
  items: read,
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => read());
  useEffect(() => {
    const update = () => setItems(read());
    listeners.add(update);
    update();
    return () => {
      listeners.delete(update);
    };
  }, []);
  const total = items.reduce((s, i) => s + i.price_cents * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, total, count };
}

export const formatEUR = (cents: number) =>
  (cents / 100).toLocaleString("et-EE", { style: "currency", currency: "EUR" });
