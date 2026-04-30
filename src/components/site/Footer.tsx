import { Mail, Phone, Instagram, Youtube, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-card/60 border-t border-border pt-24 pb-10 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">
              TMANT<span className="text-accent">.</span>
            </div>
            <p className="text-foreground/60 max-w-md leading-relaxed mb-6">
              Amapiano · Private School · Sgidongo. Available across all of South Africa.
            </p>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] font-medium text-foreground/70">
              <span>Professional.</span>
              <span>Reliable.</span>
              <span className="text-accent">Energy.</span>
              <span>Unforgettable.</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-5 font-medium">DJ Contact</h4>
            <div className="space-y-3">
              <a href="mailto:kunenethato09@gmail.com" className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors group">
                <Mail className="size-4 text-foreground/40 group-hover:text-primary" />
                <span className="text-sm">kunenethato09@gmail.com</span>
              </a>
              <a href="tel:+27680811747" className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors group">
                <Phone className="size-4 text-foreground/40 group-hover:text-primary" />
                <span className="text-sm">+27 68 081 1747</span>
              </a>
            </div>

            <h4 className="text-[10px] uppercase tracking-[0.4em] text-accent mt-8 mb-5 font-medium">Social</h4>
            <div className="space-y-3">
              <a href="https://tiktok.com/@_t_man_t" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors group">
                <Music2 className="size-4 text-foreground/40 group-hover:text-accent" />
                <span className="text-sm">TikTok / _t_man_t</span>
              </a>
              <a href="https://instagram.com/t_man_t_" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors group">
                <Instagram className="size-4 text-foreground/40 group-hover:text-accent" />
                <span className="text-sm">Instagram / t_man_t_</span>
              </a>
              <a href="https://youtube.com/@DJTMANT" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors group">
                <Youtube className="size-4 text-foreground/40 group-hover:text-accent" />
                <span className="text-sm">YouTube / DJTMANT</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="border border-border rounded-lg p-6 bg-background/40">
              <h4 className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4 font-medium">Management</h4>
              <p className="text-foreground/90 mb-4">
                TMANT is managed by <span className="font-display font-bold italic text-accent">Miss_M.</span>
              </p>
              <div className="space-y-2 text-sm text-foreground/70">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-16">Phone</span>
                  <a href="tel:+27614519705" className="hover:text-primary transition-colors">061 451 9705</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-16">Email</span>
                  <a href="mailto:mbatha_asl@icloud.com" className="hover:text-primary transition-colors">mbatha_asl@icloud.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground tracking-widest">
            © {new Date().getFullYear()} TMANT. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            DJ South Africa · Amapiano · Private School · Sgidongo
          </p>
        </div>
      </div>
    </footer>
  );
}
