import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Download,
  Play,
  FileCode,
  FileText,
  Video,
  Copy,
  Zap,
  Globe,
  KeyRound,
  BarChart3,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import productBox from "@/assets/product-box.jpg";
import videoStill from "@/assets/video-still.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Punse AI — The engine for technical creators" },
      {
        name: "description",
        content:
          "Sell software, documentation, and HD video courses in a single cohesive package. Developer-grade delivery, licensing, analytics, and a buyer library.",
      },
      { property: "og:title", content: "Punse AI — The engine for technical creators" },
      {
        property: "og:description",
        content: "Sell software, docs, and video courses with developer-grade delivery and licensing.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Globe, title: "Edge CDN delivery", desc: "2 GB bundles served from the node nearest your buyer via S3 + Cloudflare/Fastly." },
  { icon: Video, title: "Adaptive streaming", desc: "Native player auto-detects .mp4 / .mkv and streams at the right quality, Netflix-style." },
  { icon: KeyRound, title: "Cryptographic licensing", desc: "Generate unique keys, cap activations, expire licenses, and verify via API." },
  { icon: BarChart3, title: "Real-time analytics", desc: "Funnel conversion, per-file downloads, MRR, LTV, and churn in one dashboard." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <SiteNav />

      {/* Hero */}
      <section id="platform" className="relative pt-24 pb-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-mono tracking-wider uppercase mb-8 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now in Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-8 animate-fade-up [animation-delay:100ms]">
            The engine for <span className="text-primary">technical</span> creators.
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto mb-10 animate-fade-up [animation-delay:200ms]">
            Sell software, documentation, and video courses in a single cohesive package.
            Developer-grade infrastructure for your digital empire.
          </p>
          <div className="flex items-center justify-center gap-3 animate-fade-up [animation-delay:250ms]">
            <Button asChild size="lg" variant="contrast">
              <Link to="/dashboard">Open the dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/library">See buyer library</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-6xl mx-auto mt-16 animate-fade-up [animation-delay:300ms]">
          <div className="relative bg-surface rounded-xl border border-border shadow-2xl overflow-hidden ring-1 ring-white/5">
            <div className="h-10 bg-black/40 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
              </div>
              <div className="mx-auto text-[11px] font-mono text-muted-foreground/50">dash.punse.ai/analytics</div>
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="w-48 shrink-0 hidden md:block space-y-1">
                <div className="h-8 bg-primary/10 border border-primary/20 rounded-md flex items-center px-3 text-xs font-medium text-primary">Overview</div>
                {["Products", "Customers", "License Keys", "Webhooks"].map((s) => (
                  <div key={s} className="h-8 hover:bg-white/5 rounded-md flex items-center px-3 text-xs font-medium text-muted-foreground">{s}</div>
                ))}
              </div>
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { l: "NET REVENUE", v: "$142,840.50", d: "+12.4% from last month", p: true },
                    { l: "CURRENT MRR", v: "$12,400.00", d: "8 new subscribers today", p: true },
                    { l: "CONVERSION", v: "4.82%", d: "Viewed: 42.1k", p: false },
                  ].map((m) => (
                    <div key={m.l} className="p-4 rounded-lg bg-black/20 border border-border">
                      <div className="text-xs font-mono text-muted-foreground mb-1">{m.l}</div>
                      <div className="text-2xl font-bold tracking-tight">{m.v}</div>
                      <div className={`text-[10px] mt-2 ${m.p ? "text-primary" : "text-muted-foreground"}`}>{m.d}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-black/40 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold">Product: Neural-Kit SDK v2.1</h3>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 rounded bg-secondary text-[10px] font-mono">DRAFT</div>
                      <div className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-mono">LIVE</div>
                    </div>
                  </div>
                  <div className="flex gap-4 border-b border-border mb-6">
                    <button className="pb-2 border-b-2 border-primary text-xs font-medium">Source Code</button>
                    <button className="pb-2 border-b-2 border-transparent text-xs font-medium text-muted-foreground">Documentation</button>
                    <button className="pb-2 border-b-2 border-transparent text-xs font-medium text-muted-foreground">Video Modules</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="size-8 bg-secondary rounded flex items-center justify-center font-mono text-xs">ZIP</div>
                        <div>
                          <div className="text-xs font-medium">neural-kit-main-latest.zip</div>
                          <div className="text-[10px] text-muted-foreground">2.4 GB • Last updated 2h ago</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-primary">REPLACE</span>
                    </div>
                    <div className="p-8 border border-dashed border-border rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Drag additional files or <span className="text-primary">browse</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-border">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-surface border border-border rounded-xl p-6">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buyer experience */}
      <section id="buyer" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Buyer Experience</h2>
            <p className="text-muted-foreground mb-8">
              When your customers buy, they get instant access to a high-performance library.
              No redirection loops, no broken links.
            </p>
            <div className="bg-surface border border-border rounded-xl p-6 mb-8">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Generated License Key</div>
              <div className="flex gap-4">
                <code className="flex-1 bg-black/50 border border-border px-4 py-3 rounded text-primary font-mono text-sm">PNS-7392-LMN-9201-SDK</code>
                <Button variant="secondary" size="sm" className="h-auto">
                  <Copy className="size-3.5" /> Copy
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">Valid for 3 device activations. Validated via Punse API v2.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FileCode, label: "Code" },
                { icon: FileText, label: "Docs" },
                { icon: Video, label: "Video" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-surface">
                  <t.icon className="size-5 text-primary" />
                  <span className="text-xs text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-border bg-black/20 flex items-center justify-between">
              <span className="text-xs font-bold">MY LIBRARY</span>
              <div className="size-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary">JD</div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <img src={productBox} alt="Advanced Shader Pack Pro" loading="lazy" width={120} height={120} className="size-20 shrink-0 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold">Advanced Shader Pack Pro</h4>
                  <p className="text-xs text-muted-foreground mb-3">Order #49201 • May 12, 2024</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="contrast" size="sm" className="text-[10px] uppercase tracking-tight">
                      <Download className="size-3.5" /> Download .ZIP
                    </Button>
                    <Button variant="outline" size="sm" className="text-[10px] uppercase tracking-tight">
                      <Play className="size-3.5" /> Watch Stream
                    </Button>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden group">
                <img src={videoStill} alt="Course video preview" loading="lazy" width={896} height={512} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-12 rounded-full bg-primary/90 flex items-center justify-center pl-1 shadow-lg cursor-pointer group-hover:scale-110 transition-transform">
                    <Play className="size-5 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1 bg-secondary">
                  <div className="w-1/3 h-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center gap-2 relative overflow-hidden">
          <Zap className="size-8 text-primary mb-2" />
          <h2 className="text-3xl font-bold tracking-tight">Ship your first product today</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            One platform for mixed digital products — software, docs, and video — with checkout, licensing, and analytics built in.
          </p>
          <Button asChild size="lg" variant="contrast">
            <Link to="/dashboard">Get started — it's free in beta</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
