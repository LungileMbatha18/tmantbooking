import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { EventTypes } from "@/components/site/EventTypes";
import { Mixtapes } from "@/components/site/Mixtapes";
import { BookingForm } from "@/components/site/BookingForm";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <EventTypes />
      <Mixtapes />
      <BookingForm />
      <div className="border-t border-border bg-background py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-center md:justify-end">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-medium text-foreground/50 hover:text-accent transition-colors"
          >
            <Lock className="w-3 h-3" />
            DJ Login
          </Link>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
