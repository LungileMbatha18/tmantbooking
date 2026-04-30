import { Music, PartyPopper, Sparkles, Wine, Building2, GraduationCap, MoreHorizontal } from "lucide-react";

const events = [
  { icon: Music, name: "Clubs & Nightclubs", desc: "Late-night sets that take over the dancefloor." },
  { icon: PartyPopper, name: "Private Parties", desc: "Birthdays, weddings & celebrations." },
  { icon: Sparkles, name: "Festivals & Events", desc: "Main-stage energy for outdoor crowds." },
  { icon: Wine, name: "Lounge & Bar", desc: "Smooth Private Piano vibes for upscale venues." },
  { icon: Building2, name: "Corporate Events", desc: "Polished, professional sound for brands." },
  { icon: GraduationCap, name: "Campus / Student Events", desc: "Bring the noise to varsity & student gigs." },
  { icon: MoreHorizontal, name: "Other", desc: "Got something different? Let's talk." },
];

export function EventTypes() {
  return (
    <section id="events" className="py-24 px-6 md:px-12 relative bg-card/40 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-medium">/ 02 — Available For</div>
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter font-extrabold">
              Every kind of <span className="text-gradient-brand">event.</span>
            </h2>
          </div>
          <p className="text-foreground/60 max-w-md">
            From intimate lounges to packed festival floors — TMANT adapts the set to match the moment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {events.map(({ icon: Icon, name, desc }, i) => (
            <a
              key={name}
              href="#booking"
              className="group relative bg-background p-8 hover:bg-card transition-all duration-300 cursor-pointer block"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] tabular-nums text-muted-foreground tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon className="size-6 text-foreground/40 group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-display text-2xl uppercase font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{desc}</p>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export const EVENT_TYPES = events.map((e) => e.name);
