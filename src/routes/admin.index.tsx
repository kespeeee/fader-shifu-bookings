import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, Plus, Trash2, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { et } from "date-fns/locale";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin paneel — FaderShifu" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPanel,
});

const ALL_TIMES = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30",
];

type Slot = {
  id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
  booking_id: string | null;
};

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  booking_date: string;
  booking_time: string;
  notes: string | null;
  status: string;
  created_at: string;
};

function AdminPanel() {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }
      checkAdmin(session.user.id);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/admin/login" });
      } else {
        checkAdmin(data.session.user.id);
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!data) {
      toast.error("Sul puudub administraatori õigus.");
      await supabase.auth.signOut();
      navigate({ to: "/admin/login" });
      return;
    }
    setIsAdmin(true);
    setAuthChecking(false);
  };

  const loadDay = useCallback(async (d: Date) => {
    setLoading(true);
    const dateStr = format(d, "yyyy-MM-dd");
    const [slotsRes, bookingsRes] = await Promise.all([
      supabase.from("time_slots").select("*").eq("slot_date", dateStr).order("slot_time"),
      supabase.from("bookings").select("*").eq("booking_date", dateStr).order("booking_time"),
    ]);
    if (slotsRes.error) toast.error("Aegade laadimine ebaõnnestus");
    setSlots((slotsRes.data ?? []) as Slot[]);
    setBookings((bookingsRes.data ?? []) as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin && date) loadDay(date);
  }, [isAdmin, date, loadDay]);

  const toggleSlot = async (time: string) => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = slots.find((s) => s.slot_time === time);
    if (existing) {
      if (existing.is_booked) {
        toast.error("See aeg on broneeritud — ei saa eemaldada.");
        return;
      }
      const { error } = await supabase.from("time_slots").delete().eq("id", existing.id);
      if (error) return toast.error("Eemaldamine ebaõnnestus");
      toast.success("Aeg eemaldatud");
    } else {
      const { error } = await supabase.from("time_slots").insert({ slot_date: dateStr, slot_time: time });
      if (error) return toast.error("Lisamine ebaõnnestus");
      toast.success("Aeg lisatud");
    }
    loadDay(date);
  };

  const addAllDay = async () => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const existingTimes = new Set(slots.map((s) => s.slot_time));
    const toAdd = ALL_TIMES.filter((t) => !existingTimes.has(t)).map((t) => ({ slot_date: dateStr, slot_time: t }));
    if (toAdd.length === 0) return toast.info("Kõik ajad on juba lisatud");
    const { error } = await supabase.from("time_slots").insert(toAdd);
    if (error) return toast.error("Lisamine ebaõnnestus");
    toast.success(`Lisatud ${toAdd.length} aega`);
    loadDay(date);
  };

  const clearDay = async () => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const { error } = await supabase.from("time_slots").delete().eq("slot_date", dateStr).eq("is_booked", false);
    if (error) return toast.error("Kustutamine ebaõnnestus");
    toast.success("Vabad ajad kustutatud");
    loadDay(date);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl tracking-wider">ADMIN PANEEL</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary">Avaleht</Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />Logi välja
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
          <div className="rounded-2xl border border-border bg-card p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={et}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              className="pointer-events-auto"
            />
          </div>

          <div className="grid gap-8">
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl">Saadavad ajad</h2>
                  <p className="text-sm text-muted-foreground">
                    {date && format(date, "EEEE, d. MMMM yyyy", { locale: et })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addAllDay}>
                    <Plus className="mr-1 h-4 w-4" />Lisa kõik ajad
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearDay}>
                    <Trash2 className="mr-1 h-4 w-4" />Tühjenda vabad
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
                  {ALL_TIMES.map((t) => {
                    const slot = slots.find((s) => s.slot_time === t);
                    const active = !!slot;
                    const booked = slot?.is_booked;
                    return (
                      <button
                        key={t}
                        onClick={() => toggleSlot(t)}
                        disabled={booked}
                        className={cn(
                          "rounded-lg border p-3 text-sm font-medium transition-all",
                          booked && "cursor-not-allowed border-destructive/50 bg-destructive/10 text-destructive",
                          !booked && active && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
                          !booked && !active && "border-border bg-muted/30 text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        <div>{t}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-wider">
                          {booked ? "broneeritud" : active ? "vaba" : "—"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 font-display text-2xl">Päeva broneeringud</h2>
              {bookings.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Selle päeva kohta broneeringuid pole.
                </p>
              ) : (
                <div className="grid gap-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-lg">{b.booking_time}</span>
                            <Badge variant="outline" className="text-xs">{b.service}</Badge>
                            {b.status === "confirmed" ? (
                              <Badge className="bg-primary/20 text-primary"><CheckCircle2 className="mr-1 h-3 w-3" />Kinnitatud</Badge>
                            ) : (
                              <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" />{b.status}</Badge>
                            )}
                          </div>
                          <div className="mt-2 grid gap-1 text-sm">
                            <div><span className="text-muted-foreground">Nimi:</span> {b.name}</div>
                            <div><span className="text-muted-foreground">Tel:</span> {b.phone}</div>
                            <div><span className="text-muted-foreground">E-post:</span> {b.email}</div>
                            {b.notes && <div className="text-muted-foreground">„{b.notes}"</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}
