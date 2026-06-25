import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about", label: "About" },
    { href: "#events", label: "Events" },
    { href: "#mixtapes", label: "Mixtapes" },
    { href: "#booking", label: "Book" },
    { href: "#contact", label: "Contact" },
  ];


  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tighter">
          TMANT<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.3em] font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-foreground/60 hover:text-accent transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#booking"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.25em] font-bold rounded-sm hover:bg-primary/90 transition-all glow-purple"
        >
          Book Now
        </a>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-widest text-foreground/70 hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="px-5 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-widest font-bold rounded-sm text-center"
          >
            Book Now
          </a>
        </div>
      )}
    </header>
  );
}
