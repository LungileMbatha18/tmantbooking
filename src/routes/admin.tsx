import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Mixtape = {
  id: string;
  title: string;
  description: string | null;
  audio_path: string;
  cover_path: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [items, setItems] = useState<Mixtape[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserId(data.user.id);
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleData);
      await refresh();
    })();
  }, [navigate]);

  const refresh = async () => {
    const { data } = await supabase
      .from("mixtapes")
      .select("id,title,description,audio_path,cover_path,created_at")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  };

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audio || !title.trim() || !userId) return;
    setUploading(true);
    try {
      const stamp = Date.now();
      const audioKey = `${userId}/${stamp}-${audio.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const audioUp = await supabase.storage.from("mixtapes").upload(audioKey, audio, {
        contentType: audio.type || "audio/mpeg",
      });
      if (audioUp.error) throw audioUp.error;

      let coverKey: string | null = null;
      if (cover) {
        coverKey = `${userId}/${stamp}-${cover.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const coverUp = await supabase.storage
          .from("mixtape-covers")
          .upload(coverKey, cover, { contentType: cover.type || "image/jpeg" });
        if (coverUp.error) throw coverUp.error;
      }

      const { error } = await supabase.from("mixtapes").insert({
        title: title.trim(),
        description: description.trim() || null,
        audio_path: audioKey,
        cover_path: coverKey,
        uploaded_by: userId,
      });
      if (error) throw error;

      toast.success("Mixtape uploaded");
      setTitle("");
      setDescription("");
      setAudio(null);
      setCover(null);
      (document.getElementById("audio-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("audio-input") as HTMLInputElement).value = "");
      (document.getElementById("cover-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("cover-input") as HTMLInputElement).value = "");
      await refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (m: Mixtape) => {
    if (!confirm(`Delete "${m.title}"?`)) return;
    await supabase.storage.from("mixtapes").remove([m.audio_path]);
    if (m.cover_path) await supabase.storage.from("mixtape-covers").remove([m.cover_path]);
    const { error } = await supabase.from("mixtapes").delete().eq("id", m.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      await refresh();
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (isAdmin === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/60">Loading…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center border border-border rounded-lg p-8">
          <h1 className="font-display text-2xl font-bold mb-2">Not authorised</h1>
          <p className="text-foreground/60 text-sm mb-6">
            Your account doesn't have admin access. Ask the site owner to grant the
            <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-xs">admin</code>
            role to your user.
          </p>
          <button onClick={signOut} className="text-accent text-xs uppercase tracking-widest">
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 md:px-10 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tighter">
            TMANT<span className="text-accent">.</span>
          </Link>
          <button
            onClick={signOut}
            className="text-[11px] uppercase tracking-[0.25em] text-foreground/60 hover:text-accent"
          >
            Sign out
          </button>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold mb-8">
          Mixtape admin
        </h1>

        <form
          onSubmit={onUpload}
          className="border border-border rounded-lg p-6 bg-card flex flex-col gap-4 mb-12"
        >
          <h2 className="font-display text-xl font-bold">Upload new mixtape</h2>
          <input
            type="text"
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            className="bg-background border border-border rounded-md px-4 py-3 text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="bg-background border border-border rounded-md px-4 py-3 text-sm"
          />
          <label className="text-xs uppercase tracking-widest text-foreground/60">
            Audio file (mp3, wav)
            <input
              id="audio-input"
              type="file"
              accept="audio/*"
              required
              onChange={(e) => setAudio(e.target.files?.[0] ?? null)}
              className="block mt-2 text-sm text-foreground"
            />
          </label>
          <label className="text-xs uppercase tracking-widest text-foreground/60">
            Cover image
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files?.[0] ?? null)}
              className="block mt-2 text-sm text-foreground"
            />
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md py-3 text-[11px] uppercase tracking-[0.25em] font-bold disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>

        <h2 className="font-display text-xl font-bold mb-4">Existing mixtapes</h2>
        {items.length === 0 ? (
          <p className="text-foreground/60 text-sm">No mixtapes yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((m) => (
              <li
                key={m.id}
                className="border border-border rounded-md p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate">{m.title}</p>
                  <p className="text-xs text-foreground/50 truncate">{m.audio_path}</p>
                </div>
                <button
                  onClick={() => onDelete(m)}
                  className="text-foreground/60 hover:text-destructive shrink-0"
                  aria-label="Delete mixtape"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
