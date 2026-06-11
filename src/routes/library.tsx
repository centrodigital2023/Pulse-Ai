import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download, Play, Copy, FileCode, FileText, Video, Music, Image } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { libraryItems, fileKindLabel, type FileKind } from "@/lib/mock-data";
import productBox from "@/assets/product-box.jpg";
import videoStill from "@/assets/video-still.jpg";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "My Library — PULSE AI" }] }),
  component: LibraryPage,
});

const kindIcon: Record<FileKind, typeof FileCode> = { code: FileCode, doc: FileText, video: Video, audio: Music, image: Image };

function LibraryPage() {
  const [active, setActive] = useState(libraryItems[0].id);
  const item = libraryItems.find((i) => i.id === active)!;

  const copyKey = (k: string) => {
    navigator.clipboard?.writeText(k);
    toast.success("License key copied");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <Logo />
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/dashboard">Creator dashboard</Link></Button>
          <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono">JD</div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Library list */}
        <aside className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">My library</div>
          {libraryItems.map((i) => (
            <button
              key={i.id}
              onClick={() => setActive(i.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                i.id === active ? "bg-primary/10 border-primary/30" : "bg-surface border-border hover:border-primary/20"
              }`}
            >
              <img src={productBox} alt="" loading="lazy" width={48} height={48} className="size-12 rounded object-cover shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{i.product}</div>
                <div className="text-[10px] text-muted-foreground">{i.order} • {i.date}</div>
              </div>
            </button>
          ))}
        </aside>

        {/* Detail */}
        <main className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{item.product}</h1>
            <p className="text-sm text-muted-foreground">Order {item.order} • {item.date}</p>
          </div>

          {/* Video player */}
          {item.hasVideo && (
            <div className="aspect-video bg-black rounded-xl relative overflow-hidden group border border-border">
              <img src={videoStill} alt="Course preview" loading="lazy" width={896} height={512} className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={() => toast("Streaming player (demo)")} className="size-16 rounded-full bg-primary/90 flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="size-7 text-primary-foreground fill-current" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-secondary"><div className="w-1/3 h-full bg-primary" /></div>
            </div>
          )}

          {/* License key */}
          {item.licenseKey && (
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Your license key</div>
              <div className="flex gap-4">
                <code className="flex-1 bg-black/50 border border-border px-4 py-3 rounded text-primary font-mono text-sm">{item.licenseKey}</code>
                <Button variant="secondary" onClick={() => copyKey(item.licenseKey!)}><Copy className="size-3.5" /> Copy</Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">Valid for 3 device activations. Validated via PULSE API v2.</p>
            </div>
          )}

          {/* Files */}
          <div className="bg-surface border border-border rounded-xl divide-y divide-border">
            {item.files.map((f) => {
              const Icon = kindIcon[f.kind];
              return (
                <div key={f.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded bg-secondary flex items-center justify-center font-mono text-[10px] shrink-0">{fileKindLabel(f.kind)}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{f.name}</div>
                      <div className="text-[10px] text-muted-foreground">{f.size} • {f.meta}</div>
                    </div>
                  </div>
                  <Button variant={f.kind === "video" ? "outline" : "contrast"} size="sm" onClick={() => toast.success(`Downloading ${f.name}`)}>
                    <Icon className="size-3.5" />
                    {f.kind === "doc" ? "Open" : f.kind === "video" ? "Stream" : "Download"}
                  </Button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
