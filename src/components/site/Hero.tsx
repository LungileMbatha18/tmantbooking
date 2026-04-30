import heroImg from "@/assets/tmant-hero.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      {/* Floating glow orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/30 blur-[120px] rounded-full animate-float-glow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent/25 blur-[120px] rounded-full animate-float-glow pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* DJ image — angled, vibrant club bg */}
      <div className="absolute top-0 right-0 w-full md:w-3/5 h-full opacity-90 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/40 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent z-10" />
        <img
          src={heroImg}
          alt="TMANT performing under purple and orange stage lights"
          width={1080}
          height={1620}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-20 grid grid-cols-12 gap-6 items-end max-w-7xl mx-auto w-full">
        {/* Vertical social rail */}
        <div className="hidden md:flex col-span-1 flex-col gap-8 mb-8">
          <a href="https://tiktok.com/@_t_man_t" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.3em] -rotate-90 origin-left whitespace-nowrap text-foreground/50 hover:text-primary transition-colors">
            TikTok / _t_man_t
          </a>
          <a href="https://instagram.com/t_man_t_" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.3em] -rotate-90 origin-left whitespace-nowrap text-foreground/50 hover:text-accent transition-colors">
            Instagram / t_man_t_
          </a>
          <a href="https://youtube.com/@DJTMANT" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.3em] -rotate-90 origin-left whitespace-nowrap text-foreground/50 hover:text-foreground transition-colors">
            YouTube / DJTMANT
          </a>
        </div>

        <div className="col-span-12 md:col-span-11 lg:col-span-9">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-border mb-8 bg-background/50 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/70 font-medium">
              Available For Bookings · Bloemfontein
            </span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] font-extrabold tracking-tighter uppercase mb-8">
            Book{" "}
            <span className="text-gradient-brand italic">TMANT</span>
            <br />
            For Your Next <span className="text-accent">Event</span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-6 mb-12">
            <p className="text-lg md:text-xl font-light tracking-wide text-foreground/70">
              <span className="font-medium text-foreground">House</span>
              <span className="text-primary mx-3">/</span>
              <span className="font-medium text-foreground">Private Piano</span>
              <span className="text-accent mx-3">/</span>
              <span className="font-medium text-foreground">Amapiano</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#booking"
              className="group relative px-10 py-5 bg-foreground text-background font-display font-bold uppercase tracking-tight text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <span className="relative z-10">Book Now</span>
              <div className="absolute inset-0 translate-x-1 translate-y-1 bg-accent -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            </a>
            <a
              href="https://wa.me/27680811747"
              target="_blank"
              rel="noreferrer"
              className="px-10 py-5 border border-border text-foreground font-display font-bold uppercase tracking-tight text-base hover:bg-secondary transition-colors"
            >
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>

      {/* Frequency visualizer + stats */}
      <div className="relative z-20 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-7xl mx-auto w-full">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Genres</div>
          <div className="font-display text-xl">3 Worlds</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Based In</div>
          <div className="font-display text-xl">Bloemfontein, ZA</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Booking Line</div>
          <div className="font-display text-xl tabular-nums">+27 68 081 1747</div>
        </div>
        <div className="flex items-end justify-end">
          <div className="flex gap-1.5 h-10 items-end">
            {[0.6, 0.9, 0.5, 0.8, 0.4, 1, 0.7].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 origin-bottom animate-pulse-bar ${i % 2 === 0 ? "bg-primary" : "bg-accent"}`}
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
