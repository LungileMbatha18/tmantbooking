import { createFileRoute } from "@tanstack/react-router";
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
      <Footer />
      <WhatsAppButton />
    </main>
  );
}

