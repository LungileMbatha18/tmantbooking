export function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="md:col-span-5">
          <div className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-medium">/ 01 — Identity</div>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter font-extrabold mb-8">
            Smooth <span className="text-stroke italic">grooves.</span><br />
            Loud <span className="text-accent">moments.</span>
          </h2>
        </div>

        <div className="md:col-span-7 space-y-6">
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80 font-light">
            <span className="text-foreground font-medium">TMANT</span> is a South African DJ bringing high-energy Amapiano,
            Private School, and Sgidongo sounds to clubs, private parties, festivals,
            lounge events, and corporate spaces — available across all of South Africa.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/60 font-light">
            Known for creating both chilled and high-energy moments, TMANT brings a
            professional, reliable, and unforgettable music experience.
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            {["Professional.", "Reliable.", "Energy.", "Unforgettable."].map((w, i) => (
              <span
                key={w}
                className={`text-xs uppercase tracking-[0.3em] font-medium ${
                  i === 2 ? "text-accent" : "text-foreground/70"
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          <div className="border-l-2 border-primary pl-6 py-2 mt-8 italic text-foreground/70">
            "Available for clubs, private events, festivals, lounges & corporate
            functions across South Africa."
          </div>
        </div>
      </div>
    </section>
  );
}
