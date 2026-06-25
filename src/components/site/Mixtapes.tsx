import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Music } from "lucide-react";

type Mixtape = {
  id: string;
  title: string;
  description: string | null;
  audio_path: string;
  cover_path: string | null;
  created_at: string;
};

type Resolved = Mixtape & { audioUrl: string; coverUrl: string | null };

export function Mixtapes() {
  const [items, setItems] = useState<Resolved[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("mixtapes")
        .select("id,title,description,audio_path,cover_path,created_at")
        .order("created_at", { ascending: false });
      if (error || !data) {
        setLoading(false);
        return;
      }
      const resolved = await Promise.all(
        data.map(async (m) => {
          const audio = await supabase.storage
            .from("mixtapes")
            .createSignedUrl(m.audio_path, 60 * 60 * 24 * 7);
          let coverUrl: string | null = null;
          if (m.cover_path) {
            const c = await supabase.storage
              .from("mixtape-covers")
              .createSignedUrl(m.cover_path, 60 * 60 * 24 * 7);
            coverUrl = c.data?.signedUrl ?? null;
          }
          return { ...m, audioUrl: audio.data?.signedUrl ?? "", coverUrl };
        })
      );
      if (!cancelled) {
        setItems(resolved);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="mixtapes" className="py-24 md:py-32 px-6 md:px-10 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent font-medium mb-4">
            The Sound
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tighter">
            Mixtapes
          </h2>
          <p className="mt-4 text-foreground/60 max-w-xl mx-auto">
            Stream the latest sets or download to take the vibe with you.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-foreground/50">Loading mixtapes…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg">
            <Music className="w-10 h-10 mx-auto text-foreground/30 mb-4" />
            <p className="text-foreground/60">No mixtapes uploaded yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((m) => (
              <article
                key={m.id}
                className="group border border-border rounded-lg overflow-hidden bg-card hover:border-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 aspect-square sm:aspect-auto bg-muted shrink-0 overflow-hidden">
                    {m.coverUrl ? (
                      <img
                        src={m.coverUrl}
                        alt={`${m.title} cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-10 h-10 text-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-sm text-foreground/60 mt-1 line-clamp-2">
                          {m.description}
                        </p>
                      )}
                    </div>
                    <audio controls preload="none" src={m.audioUrl} className="w-full mt-auto">
                      Your browser doesn't support audio playback.
                    </audio>
                    <a
                      href={m.audioUrl}
                      download
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-bold text-accent hover:text-accent/80 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
