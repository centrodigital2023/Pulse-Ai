import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileCode, FileText, Video, UploadCloud, KeyRound, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard/products/new")({
  head: () => ({ meta: [{ title: "New product — Punse AI" }] }),
  component: NewProduct,
});

interface Asset {
  id: string;
  name: string;
  size: string;
}

const tabs = [
  { key: "code", label: "Source Code", icon: FileCode, hint: "ZIP, binaries, plugins up to 10 GB" },
  { key: "docs", label: "Documentation", icon: FileText, hint: "PDF guides, opened in-browser by buyers" },
  { key: "video", label: "Video Modules", icon: Video, hint: ".mp4 / .mkv — adaptive HLS streaming" },
] as const;

function DropZone({
  hint,
  assets,
  onAdd,
  onRemove,
}: {
  hint: string;
  assets: Asset[];
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {assets.map((a) => (
        <div key={a.id} className="flex items-center justify-between p-3 bg-black/20 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-secondary rounded flex items-center justify-center font-mono text-xs">
              {a.name.split(".").pop()?.toUpperCase().slice(0, 3)}
            </div>
            <div>
              <div className="text-xs font-medium">{a.name}</div>
              <div className="text-[10px] text-muted-foreground">{a.size} • CDN ready (Cloudflare/Fastly)</div>
            </div>
          </div>
          <button onClick={() => onRemove(a.id)} className="text-muted-foreground hover:text-destructive transition-colors">
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="w-full p-8 border border-dashed border-border rounded-lg text-center hover:border-primary/50 transition-colors flex flex-col items-center gap-2"
      >
        <UploadCloud className="size-6 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Drag files or <span className="text-primary">browse</span>
        </p>
        <p className="text-[10px] text-muted-foreground/60">{hint}</p>
      </button>
    </div>
  );
}

function NewProduct() {
  const [streaming, setStreaming] = useState(true);
  const [licensing, setLicensing] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [assets, setAssets] = useState<Record<string, Asset[]>>({
    code: [{ id: "a1", name: "neural-kit-main-latest.zip", size: "2.4 GB" }],
    docs: [],
    video: [],
  });

  const addAsset = (tab: string) => {
    const sample: Record<string, Asset> = {
      code: { id: crypto.randomUUID(), name: "module-source.zip", size: "640 MB" },
      docs: { id: crypto.randomUUID(), name: "integration-guide.pdf", size: "8.2 MB" },
      video: { id: crypto.randomUUID(), name: "01-getting-started.mp4", size: "1.1 GB" },
    };
    setAssets((s) => ({ ...s, [tab]: [...s[tab], sample[tab]] }));
    toast.success("Asset queued for CDN upload");
  };

  const removeAsset = (tab: string, id: string) =>
    setAssets((s) => ({ ...s, [tab]: s[tab].filter((a) => a.id !== id) }));

  return (
    <DashboardLayout
      title="New product"
      breadcrumb={["Dashboard", "Products", "New"]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast("Draft saved")}>Save draft</Button>
          <Button variant="contrast" size="sm" onClick={() => toast.success("Product published 🚀")}>Publish</Button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basics */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Product details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Neural-Kit SDK" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea id="tagline" rows={2} placeholder="Production-grade ML toolkit with full source and a 6-hour course." />
            </div>
          </div>

          {/* Mixed content composer */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Content payload</h3>
            <Tabs defaultValue="code">
              <TabsList className="bg-black/20">
                {tabs.map((t) => (
                  <TabsTrigger key={t.key} value={t.key} className="text-xs gap-1.5">
                    <t.icon className="size-3.5" />
                    {t.label}
                    {assets[t.key === "docs" ? "docs" : t.key].length > 0 && (
                      <span className="ml-1 text-[10px] font-mono text-primary">
                        {assets[t.key === "docs" ? "docs" : t.key].length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((t) => (
                <TabsContent key={t.key} value={t.key} className="mt-6">
                  <DropZone
                    hint={t.hint}
                    assets={assets[t.key === "docs" ? "docs" : t.key]}
                    onAdd={() => addAsset(t.key === "docs" ? "docs" : t.key)}
                    onRemove={(id) => removeAsset(t.key === "docs" ? "docs" : t.key, id)}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Sidebar config */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Pricing</h3>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" type="number" defaultValue={149} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Subscription</div>
                <div className="text-[10px] text-muted-foreground">Charge monthly (MRR)</div>
              </div>
              <Switch checked={recurring} onCheckedChange={setRecurring} />
            </div>
          </div>

          {/* Video delivery */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Video delivery</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Adaptive streaming</div>
                <div className="text-[10px] text-muted-foreground">HLS player, quality auto-adjusts</div>
              </div>
              <Switch checked={streaming} onCheckedChange={setStreaming} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Allow download</div>
                <div className="text-[10px] text-muted-foreground">Let buyers save the raw file</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Licensing */}
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Licensing engine</h3>
              </div>
              <Switch checked={licensing} onCheckedChange={setLicensing} />
            </div>
            {licensing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="limit">Activation limit</Label>
                  <Input id="limit" type="number" defaultValue={3} />
                </div>
                <div className="space-y-2">
                  <Label>Key format</Label>
                  <div className="w-full bg-black/30 border border-border rounded-md px-3 py-2 text-sm font-mono text-muted-foreground">
                    PNS-XXXX-XXXX-XXXX
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-primary font-mono">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Verification API active
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/dashboard/products" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to products
        </Link>
      </div>
    </DashboardLayout>
  );
}
