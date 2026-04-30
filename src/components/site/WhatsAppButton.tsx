import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/27680811747?text=Hi%20TMANT%2C%20I%27d%20like%20to%20enquire%20about%20a%20booking."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 size-14 md:size-16 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/40 transition-all hover:scale-110"
    >
      <MessageCircle className="size-7 md:size-8" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
