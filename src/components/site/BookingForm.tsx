import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPES } from "./EventTypes";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00",
];

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  event_type: z.string().min(1, "Select event type"),
  event_name: z.string().trim().min(2, "Event name required").max(150),
  event_location: z.string().trim().min(2, "Location required").max(200),
  event_date: z.date({ message: "Pick a date" }),
  start_time: z.string().min(1, "Start time required"),
  end_time: z.string().min(1, "End time required"),
  guest_count: z.coerce.number().int().min(0).max(100000).optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});

type Slot = { event_date: string; start_time: string; end_time: string };

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const as = timeToMinutes(aStart);
  let ae = timeToMinutes(aEnd);
  const bs = timeToMinutes(bStart);
  let be = timeToMinutes(bEnd);
  // Handle past-midnight (end before start)
  if (ae <= as) ae += 24 * 60;
  if (be <= bs) be += 24 * 60;
  return as < be && bs < ae;
}

const fieldClass =
  "w-full bg-input border border-border px-4 py-3 text-foreground rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-all placeholder:text-muted-foreground/60";
const labelClass = "block text-[10px] uppercase tracking-[0.3em] text-foreground/70 font-medium mb-2";

export function BookingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    event_type: "",
    event_name: "",
    event_location: "",
    event_date: undefined as Date | undefined,
    start_time: "",
    end_time: "",
    guest_count: "",
    notes: "",
  });

  useEffect(() => {
    supabase.rpc("get_booked_slots").then(({ data }) => {
      if (data) setBookedSlots(data as Slot[]);
    });
  }, []);

  // Dates fully booked = any single date with 2+ overlapping booked entries spanning most of the day, but simpler: mark days that have any booking as 'partially booked' (still selectable) — fully unavailable not enforced here, time conflicts caught per slot.
  const dateBookingMap = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of bookedSlots) {
      const list = map.get(s.event_date) ?? [];
      list.push(s);
      map.set(s.event_date, list);
    }
    return map;
  }, [bookedSlots]);

  const unavailableTimes = useMemo(() => {
    if (!form.event_date) return new Set<string>();
    const dateStr = format(form.event_date, "yyyy-MM-dd");
    const daySlots = dateBookingMap.get(dateStr) ?? [];
    const blocked = new Set<string>();
    for (const t of TIME_SLOTS) {
      // Block this start time if any booking covers it (use 1-hour assumed window for visualization)
      const tEnd = TIME_SLOTS[(TIME_SLOTS.indexOf(t) + 1) % TIME_SLOTS.length] || t;
      for (const s of daySlots) {
        if (rangesOverlap(t, tEnd, s.start_time.slice(0, 5), s.end_time.slice(0, 5))) {
          blocked.add(t);
          break;
        }
      }
    }
    return blocked;
  }, [form.event_date, dateBookingMap]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const n = { ...e };
        delete n[key as string];
        return n;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0]) fe[issue.path[0] as string] = issue.message;
      }
      setErrors(fe);
      toast.error("Please fix the errors in the form");
      return;
    }

    const data = parsed.data;

    // Conflict check
    const dateStr = format(data.event_date, "yyyy-MM-dd");
    const daySlots = dateBookingMap.get(dateStr) ?? [];
    const conflict = daySlots.find((s) =>
      rangesOverlap(data.start_time, data.end_time, s.start_time.slice(0, 5), s.end_time.slice(0, 5)),
    );
    if (conflict) {
      toast.error("That time slot is already booked. Please choose another.");
      setErrors({ start_time: "Time conflict on this date" });
      return;
    }

    if (timeToMinutes(data.end_time) === timeToMinutes(data.start_time)) {
      setErrors({ end_time: "End time must differ from start time" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        event_type: data.event_type,
        event_name: data.event_name,
        event_location: data.event_location,
        event_date: dateStr,
        start_time: data.start_time,
        end_time: data.end_time,
        guest_count: data.guest_count === "" ? null : Number(data.guest_count),
        notes: data.notes || null,
      };

      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;

      // Fire emails (non-blocking on user UX)
      supabase.functions.invoke("send-booking-emails", { body: payload }).catch((err) => {
        console.error("Email send failed", err);
      });

      setSuccess(true);
      toast.success("Booking request received!");
      // Refresh booked slots
      supabase.rpc("get_booked_slots").then(({ data: d }) => d && setBookedSlots(d as Slot[]));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section id="booking" className="py-32 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/20 mb-8 glow-purple">
            <CheckCircle2 className="size-10 text-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl uppercase font-extrabold tracking-tighter mb-6">
            Booking <span className="text-gradient-brand">Received</span>
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed mb-4">
            Thank you for booking TMANT. Your booking request has been received. We'll be in touch soon.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            A confirmation has been sent to your email.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setForm({
                full_name: "", email: "", phone: "", event_type: "", event_name: "",
                event_location: "", event_date: undefined, start_time: "", end_time: "",
                guest_count: "", notes: "",
              });
            }}
            className="px-8 py-4 border border-border text-foreground font-display font-bold uppercase tracking-tight text-sm hover:bg-secondary"
          >
            Make Another Booking
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-6 md:px-12 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-medium">/ 03 — Reserve The Date</div>
          <h2 className="font-display text-5xl md:text-7xl uppercase font-extrabold tracking-tighter mb-6">
            Book <span className="text-gradient-brand">TMANT</span>
          </h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Fill in your event details below. We'll confirm availability and pricing within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card/40 border border-border rounded-lg p-6 md:p-10 backdrop-blur-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                className={fieldClass}
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="Your full name"
                required
              />
              {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name}</p>}
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                className={fieldClass}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@email.com"
                required
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Phone *</label>
              <input
                type="tel"
                className={fieldClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+27 ..."
                required
              />
              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className={labelClass}>Event Type *</label>
              <Select value={form.event_type} onValueChange={(v) => update("event_type", v)}>
                <SelectTrigger className={cn(fieldClass, "h-auto")}>
                  <SelectValue placeholder="Choose event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.event_type && <p className="text-destructive text-xs mt-1">{errors.event_type}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Event Name *</label>
              <input
                className={fieldClass}
                value={form.event_name}
                onChange={(e) => update("event_name", e.target.value)}
                placeholder="e.g. Sarah's 30th Birthday"
                required
              />
              {errors.event_name && <p className="text-destructive text-xs mt-1">{errors.event_name}</p>}
            </div>
            <div>
              <label className={labelClass}>Event Location *</label>
              <input
                className={fieldClass}
                value={form.event_location}
                onChange={(e) => update("event_location", e.target.value)}
                placeholder="Venue or address"
                required
              />
              {errors.event_location && <p className="text-destructive text-xs mt-1">{errors.event_location}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Event Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(fieldClass, "flex items-center justify-between text-left")}
                  >
                    {form.event_date ? format(form.event_date, "PPP") : <span className="text-muted-foreground/60">Pick a date</span>}
                    <CalendarIcon className="size-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.event_date}
                    onSelect={(d) => update("event_date", d)}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    modifiers={{
                      booked: Array.from(dateBookingMap.keys()).map((s) => new Date(s + "T00:00:00")),
                    }}
                    modifiersClassNames={{
                      booked: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-accent",
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.event_date && <p className="text-destructive text-xs mt-1">{errors.event_date}</p>}
            </div>
            <div>
              <label className={labelClass}>Start Time *</label>
              <Select value={form.start_time} onValueChange={(v) => update("start_time", v)}>
                <SelectTrigger className={cn(fieldClass, "h-auto")}>
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => {
                    const blocked = unavailableTimes.has(t);
                    return (
                      <SelectItem key={t} value={t} disabled={blocked}>
                        {t} {blocked && <span className="text-destructive text-xs ml-2">· booked</span>}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.start_time && <p className="text-destructive text-xs mt-1">{errors.start_time}</p>}
            </div>
            <div>
              <label className={labelClass}>End Time *</label>
              <Select value={form.end_time} onValueChange={(v) => update("end_time", v)}>
                <SelectTrigger className={cn(fieldClass, "h-auto")}>
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.end_time && <p className="text-destructive text-xs mt-1">{errors.end_time}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Expected Number of Guests</label>
            <input
              type="number"
              min={0}
              className={fieldClass}
              value={form.guest_count}
              onChange={(e) => update("guest_count", e.target.value)}
              placeholder="e.g. 200"
            />
          </div>

          <div>
            <label className={labelClass}>Additional Notes / Special Requests</label>
            <Textarea
              rows={4}
              className={fieldClass}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Anything we should know about your event, sound equipment, set length, etc."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group relative w-full md:w-auto px-12 py-5 bg-foreground text-background font-display font-bold uppercase tracking-tight text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Sending..." : "Submit Booking Request"}
            </span>
            <div className="absolute inset-0 translate-x-1 translate-y-1 bg-accent -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
          </button>

          <p className="text-xs text-muted-foreground pt-2">
            * Required. Dates with a small orange dot already have bookings — pick a free time slot.
          </p>
        </form>
      </div>
    </section>
  );
}
