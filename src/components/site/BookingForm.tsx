import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { et } from "date-fns/locale";
import { CalendarIcon, Loader2, Check, User, Phone, Mail, Scissors, CalendarDays, Clock, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { SERVICES } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type BookingSummary = {
  name: string;
  phone: string;
  email: string;
  service: string;
  booking_date: Date;
  booking_time: string;
  notes?: string;
};

type AvailableSlot = { id: string; slot_date: string; slot_time: string };

const schema = z.object({
  name: z.string().trim().min(2, "Nimi on liiga lühike").max(100),
  phone: z.string().trim().min(5, "Telefoninumber on liiga lühike").max(30),
  email: z.string().trim().email("Vigane e-posti aadress").max(255),
  service: z.string().min(1, "Vali teenus"),
  slot_id: z.string().min(1, "Vali aeg"),
  notes: z.string().max(1000).optional(),
});

export function BookingForm() {
  const [allSlots, setAllSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>();
  const [service, setService] = useState("");
  const [slotId, setSlotId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingSummary | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load all available (non-booked) slots from today onwards
  useEffect(() => {
    const load = async () => {
      setSlotsLoading(true);
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("time_slots")
        .select("id, slot_date, slot_time")
        .eq("is_booked", false)
        .gte("slot_date", today)
        .order("slot_date")
        .order("slot_time");
      if (error) toast.error("Aegade laadimine ebaõnnestus");
      setAllSlots((data ?? []) as AvailableSlot[]);
      setSlotsLoading(false);
    };
    load();
  }, []);

  // Set of dates that have at least one available slot
  const availableDates = useMemo(() => {
    return new Set(allSlots.map((s) => s.slot_date));
  }, [allSlots]);

  // Times for selected date
  const timesForDate = useMemo(() => {
    if (!date) return [];
    const ds = format(date, "yyyy-MM-dd");
    return allSlots.filter((s) => s.slot_date === ds);
  }, [allSlots, date]);

  // Reset slot when date changes
  useEffect(() => { setSlotId(""); }, [date]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const form = e.currentTarget;
    const fd = new FormData(form);

    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      service,
      slot_id: slotId,
      notes: fd.get("notes") || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Palun kontrolli vormi väljad");
      return;
    }

    const slot = allSlots.find((s) => s.id === parsed.data.slot_id);
    if (!slot) {
      toast.error("Valitud aeg ei ole enam saadaval");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.rpc("book_slot", {
      _slot_id: parsed.data.slot_id,
      _name: parsed.data.name,
      _phone: parsed.data.phone,
      _email: parsed.data.email,
      _service: parsed.data.service,
      _notes: parsed.data.notes ?? null,
    });
    setSubmitting(false);

    if (error) {
      const msg = error.message?.includes("juba broneeritud")
        ? "See aeg sai just broneeritud. Palun vali uus."
        : "Broneeringu salvestamine ebaõnnestus. Proovi uuesti.";
      toast.error(msg);
      // Refresh slots
      const today = format(new Date(), "yyyy-MM-dd");
      const { data } = await supabase
        .from("time_slots").select("id, slot_date, slot_time")
        .eq("is_booked", false).gte("slot_date", today)
        .order("slot_date").order("slot_time");
      setAllSlots((data ?? []) as AvailableSlot[]);
      return;
    }

    setConfirmation({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      service: parsed.data.service,
      booking_date: parseISO(slot.slot_date),
      booking_time: slot.slot_time,
      notes: parsed.data.notes,
    });
    form.reset();
    setDate(undefined);
    setService("");
    setSlotId("");
    setAllSlots((prev) => prev.filter((s) => s.id !== slot.id));
    toast.success("Broneering edukalt esitatud!");
  };

  const noAvailability = !slotsLoading && allSlots.length === 0;

  return (
    <>
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-card md:p-10">
      {noAvailability && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-center text-sm">
          Hetkel ei ole vabu aegu. Palun proovi peagi uuesti või võta meiega ühendust.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nimi" error={errors.name}>
          <Input name="name" placeholder="Sinu nimi" required />
        </Field>
        <Field label="Telefoninumber" error={errors.phone}>
          <Input name="phone" type="tel" placeholder="+372 5xxx xxxx" required />
        </Field>
      </div>

      <Field label="E-post" error={errors.email}>
        <Input name="email" type="email" placeholder="sinu@email.ee" required />
      </Field>

      <Field label="Teenus" error={errors.service}>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger><SelectValue placeholder="Vali teenus" /></SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.name} — {s.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Kuupäev" error={errors.slot_id}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={slotsLoading || noAvailability}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {slotsLoading ? "Laen..." : date ? format(date, "d. MMMM yyyy", { locale: et }) : "Vali kuupäev"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => {
                  const ds = format(d, "yyyy-MM-dd");
                  return !availableDates.has(ds);
                }}
                locale={et}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Kellaaeg">
          <Select value={slotId} onValueChange={setSlotId} disabled={!date || timesForDate.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder={!date ? "Vali enne kuupäev" : timesForDate.length === 0 ? "Aegu pole" : "Vali kellaaeg"} />
            </SelectTrigger>
            <SelectContent>
              {timesForDate.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.slot_time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Märkused (vabatahtlik)" error={errors.notes}>
        <Textarea name="notes" placeholder="Kas on midagi, mida peaksin teadma?" rows={4} />
      </Field>

      <Button type="submit" size="lg" disabled={submitting || noAvailability} className="h-14 font-display text-lg tracking-wider">
        {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Saadan...</> : "Kinnita broneering"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Broneering kinnitatakse koheselt — sinu aeg on kindlustatud.
      </p>
    </form>

    <Dialog open={!!confirmation} onOpenChange={(open) => { if (!open) setConfirmation(null); }}>
      <DialogContent className="max-w-md border-primary/40">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">Broneering kinnitatud!</DialogTitle>
          <DialogDescription className="text-center">
            Aitäh, {confirmation?.name?.split(" ")[0]}! Sinu aeg on kindlustatud.
          </DialogDescription>
        </DialogHeader>

        {confirmation && (
          <div className="mt-2 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <SummaryRow icon={<User className="h-4 w-4" />} label="Nimi" value={confirmation.name} />
            <SummaryRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={confirmation.phone} />
            <SummaryRow icon={<Mail className="h-4 w-4" />} label="E-post" value={confirmation.email} />
            <SummaryRow icon={<Scissors className="h-4 w-4" />} label="Teenus" value={confirmation.service} />
            <SummaryRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Kuupäev"
              value={format(confirmation.booking_date, "EEEE, d. MMMM yyyy", { locale: et })}
            />
            <SummaryRow icon={<Clock className="h-4 w-4" />} label="Kellaaeg" value={confirmation.booking_time} />
            {confirmation.notes && (
              <SummaryRow icon={<StickyNote className="h-4 w-4" />} label="Märkused" value={confirmation.notes} />
            )}
          </div>
        )}

        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => setConfirmation(null)}>Sulge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
