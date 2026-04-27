import { useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { et } from "date-fns/locale";
import { CalendarIcon, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICES } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const schema = z.object({
  name: z.string().trim().min(2, "Nimi on liiga lühike").max(100),
  phone: z.string().trim().min(5, "Telefoninumber on liiga lühike").max(30),
  email: z.string().trim().email("Vigane e-posti aadress").max(255),
  service: z.string().min(1, "Vali teenus"),
  booking_date: z.date({ required_error: "Vali kuupäev" }),
  booking_time: z.string().min(1, "Vali kellaaeg"),
  notes: z.string().max(1000).optional(),
});

export function BookingForm() {
  const [date, setDate] = useState<Date | undefined>();
  const [service, setService] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);

    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      service,
      booking_date: date,
      booking_time: time,
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

    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      service: parsed.data.service,
      booking_date: format(parsed.data.booking_date, "yyyy-MM-dd"),
      booking_time: parsed.data.booking_time,
      notes: parsed.data.notes ?? null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Broneeringu salvestamine ebaõnnestus. Proovi uuesti.");
      return;
    }
    setSubmitted(true);
    toast.success("Broneering edukalt esitatud!");
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-display text-3xl">Aitäh!</h3>
        <p className="mt-3 text-muted-foreground">
          Broneering on vastu võetud. Võtame sinuga peagi ühendust kinnituse saamiseks.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => { setSubmitted(false); setDate(undefined); setService(""); setTime(""); }}>
          Uus broneering
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-card md:p-10">
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
        <Field label="Kuupäev" error={errors.booking_date}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "d. MMMM yyyy", { locale: et }) : "Vali kuupäev"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d.getDay() === 0}
                locale={et}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Kellaaeg" error={errors.booking_time}>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger><SelectValue placeholder="Vali kellaaeg" /></SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Märkused (vabatahtlik)" error={errors.notes}>
        <Textarea name="notes" placeholder="Kas on midagi, mida peaksin teadma?" rows={4} />
      </Field>

      <Button type="submit" size="lg" disabled={submitting} className="h-14 font-display text-lg tracking-wider">
        {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Saadan...</> : "Kinnita broneering"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Saadame sulle e-posti teel kinnituse niipea kui broneeringu üle vaatame.
      </p>
    </form>
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
