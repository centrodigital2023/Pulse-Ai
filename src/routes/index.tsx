import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Zap, Globe, Video, KeyRound, BarChart3, Bot, Users, Package,
  ShoppingCart, Mail, Shield, Code, BookOpen, Award, TrendingUp,
  Check, ArrowRight, Star, Layers, Cpu, Database, Webhook,
  GraduationCap, Briefcase, DollarSign, BarChart2, Lock,
  ChevronRight, Play,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/lib/mock-data";
import productBox from "@/assets/product-box.jpg";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/marketplace" });
  },
  component: Landing,
});

const productTypes = [
  { icon: Code, label: "Software & SaaS", desc: "Desktop apps, plugins, SaaS, scripts" },
  { icon: GraduationCap, label: "Courses & Academies", desc: "Video courses, certifications, memberships" },
  { icon: BookOpen, label: "Digital Publications", desc: "eBooks, whitepapers, magazines, guides" },
  { icon: Layers, label: "Templates & Resources", desc: "Design systems, frameworks, databases" },
  { icon: Briefcase, label: "Services", desc: "Consulting, mentoring, coaching, implementations" },
  { icon: Award, label: "Licenses & IP", desc: "Software licenses, white-label, APIs" },
];

const platformModules = [
  { icon: Package, label: "Product Builder", desc: "Hybrid products: code + docs + videos + licenses in one package." },
  { icon: ShoppingCart, label: "Smart Checkout", desc: "One-click checkout, order bumps, upsells, 12+ payment methods." },
  { icon: KeyRound, label: "License Engine", desc: "Activation limits, device control, API validation, white-label keys." },
  { icon: Video, label: "Video Streaming", desc: "4K adaptive HLS/DASH, DRM protection, dynamic watermarking." },
  { icon: Mail, label: "Marketing Automation", desc: "Visual flow builder, drip sequences, behavioral triggers." },
  { icon: Users, label: "CRM Enterprise", desc: "360° customer view, LTV scoring, segments, and pipelines." },
  { icon: BarChart3, label: "Executive Analytics", desc: "MRR, ARR, LTV, churn, cohorts, and funnel analysis." },
  { icon: Bot, label: "AI Suite", desc: "AI sales assistant, support bot, and predictive analytics." },
  { icon: Globe, label: "Multi-Vendor Marketplace", desc: "Launch your own marketplace with branded vendor storefronts." },
  { icon: TrendingUp, label: "Affiliate Network", desc: "Global affiliate program with automatic commissions and payouts." },
  { icon: Webhook, label: "Developer API", desc: "REST API, webhooks, SDKs, and 200+ integrations." },
  { icon: Shield, label: "Enterprise Security", desc: "JWT, OAuth 2.0, MFA, SSO, RBAC, GDPR, PCI DSS compliance." },
];

const competitors = [
  { name: "Gumroad", cat: "Digital products" },
  { name: "Lemon Squeezy", cat: "Licensing" },
  { name: "Kajabi", cat: "Courses" },
  { name: "Teachable", cat: "Education" },
  { name: "Shopify", cat: "E-commerce" },
  { name: "HubSpot", cat: "CRM" },
  { name: "Mailchimp", cat: "Email" },
  { name: "Stripe", cat: "Payments" },
];

const testimonials = [
  { name: "Daniel Kim", role: "ML Engineer & Creator", initials: "DK", stars: 5, text: "I replaced Gumroad, Kajabi, and three Zapier workflows on the same afternoon. PULSE AI handles everything from license validation to my post-purchase email sequences." },
  { name: "Lucia Torres", role: "Founder, TechCast FM", initials: "LT", stars: 5, text: "The affiliate program alone paid for the subscription 10x over in the first month. The real-time analytics are genuinely impressive — I see exactly where every dollar comes from." },
  { name: "Marcus Jensen", role: "CTO, BuildLab.io", initials: "MJ", stars: 5, text: "We migrated our entire software licensing infrastructure to PULSE AI in one weekend. The API validation is rock solid and the enterprise dashboard gives investors exactly what they want to see." },
];

const statsBar = [
  { value: "1M+", label: "Users served" },
  { value: "$2.4B", label: "GMV processed" },
  { value: "148k", label: "Products listed" },
  { value: "99.99%", label: "Uptime SLA" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.7_0.146_162.5/0.12),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-mono tracking-wider uppercase mb-8 animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            AI-Powered Digital Commerce OS · Now in Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance mb-6 animate-fade-up [animation-delay:100ms]">
            El Sistema Operativo<br />de la{" "}
            <span className="text-primary">Economía Digital</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-10 animate-fade-up [animation-delay:200ms]">
            Vende software, cursos, ebooks, licencias y servicios desde una sola plataforma empresarial impulsada por IA.
            PULSE AI reemplaza Gumroad, Kajabi, HubSpot, Stripe y más — todo en uno.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4 animate-fade-up [animation-delay:250ms]">
            <Button asChild size="lg" variant="contrast" className="gap-2">
              <Link to="/dashboard">
                Abrir el Dashboard <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/marketplace">
                Ver Marketplace <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground animate-fade-up [animation-delay:300ms]">
            14 días gratis · Sin tarjeta de crédito · Cancela cuando quieras
          </p>
        </div>

        {/* Dashboard preview mockup */}
        <div className="max-w-6xl mx-auto mt-16 animate-fade-up [animation-delay:350ms]">
          <div className="relative bg-surface rounded-xl border border-border shadow-2xl overflow-hidden ring-1 ring-white/5">
            <div className="h-10 bg-black/40 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
                <div className="size-2.5 rounded-full bg-border" />
              </div>
              <div className="mx-auto text-[11px] font-mono text-muted-foreground/50">dash.pulseai.io/analytics</div>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-48 shrink-0 hidden md:block space-y-1">
                {["Overview", "Products", "Customers", "Analytics", "Affiliates", "Automation", "AI Assistant"].map((s, i) => (
                  <div key={s} className={`h-8 rounded-md flex items-center px-3 text-xs font-medium ${i === 0 ? "bg-primary/10 border border-primary/20 text-primary" : "text-muted-foreground"}`}>{s}</div>
                ))}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: "NET REVENUE", v: "$412,840", d: "+18.4%", p: true },
                    { l: "MRR", v: "$38,400", d: "+12.1%", p: true },
                    { l: "CONVERSION", v: "5.62%", d: "+0.8%", p: true },
                    { l: "CHURN", v: "1.4%", d: "-0.5%", p: true },
                  ].map((m) => (
                    <div key={m.l} className="p-3 rounded-lg bg-black/20 border border-border">
                      <div className="text-[9px] font-mono text-muted-foreground mb-1">{m.l}</div>
                      <div className="text-lg font-bold tracking-tight">{m.v}</div>
                      <div className="text-[10px] text-primary mt-1">{m.d}</div>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-black/20 border border-border p-4">
                    <div className="text-xs font-semibold mb-3">Revenue by month</div>
                    <div className="flex items-end gap-1 h-16">
                      {[40, 55, 48, 70, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-primary/20 rounded-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-primary rounded-sm" style={{ height: `${100 - h * 0.3}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-black/20 border border-border p-4">
                    <div className="text-xs font-semibold mb-3">AI Insight</div>
                    <div className="flex items-start gap-2">
                      <Bot className="size-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">142 customers purchased Neural-Kit but not the Masterclass — 78% match converters. Launch a targeted campaign to unlock ~$42k revenue.</p>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-mono cursor-pointer">
                      Launch campaign <ArrowRight className="size-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface/50 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsBar.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you can sell ────────────────────────────────────────── */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Catálogo Completo</div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Vende Cualquier Producto Digital</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Desde un ebook hasta una plataforma SaaS global — todo gestionado desde la misma infraestructura empresarial.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productTypes.map((t) => (
            <div key={t.label} className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <t.icon className="size-5" />
              </div>
              <h3 className="font-semibold mb-1">{t.label}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Modules ─────────────────────────────────────────── */}
      <section id="platform" className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Plataforma Todo-en-Uno</div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">12 Módulos Enterprise. Una Plataforma.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">PULSE AI reemplaza toda tu pila de herramientas. Sin integraciones rotas, sin datos fragmentados, sin costos multiplicados.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformModules.map((m) => (
              <div key={m.label} className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <m.icon className="size-5 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">{m.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Replace the stack ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Consolida Tu Stack</div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Para de pagar por 8 herramientas.<br />
              <span className="text-primary">Usa una sola.</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Las empresas gastan un promedio de $2,400/mes entre herramientas desconectadas que no se comunican entre sí. PULSE AI une todo desde $29/mes.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {competitors.map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                  <div className="size-2 rounded-full bg-destructive/70 shrink-0" />
                  <div>
                    <div className="text-sm font-medium line-through text-muted-foreground">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground/60">{c.cat}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <Zap className="size-5 text-primary shrink-0" />
              <div>
                <div className="font-semibold text-primary text-sm">Todo reemplazado por PULSE AI</div>
                <div className="text-xs text-muted-foreground">Una factura, un login, un dashboard</div>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-8">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">Buyer Experience — Mi Biblioteca</div>
            <div className="space-y-4">
              {[
                { title: "Complete AI Engineering Masterclass", sub: "Orden #51440 · Jun 09, 2024", progress: 42 },
                { title: "Neural-Kit SDK v2.1", sub: "Orden #50117 · Jun 01, 2024", progress: 78 },
                { title: "Enterprise Design System", sub: "Suscripción activa · $199/mo", progress: 100 },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-border">
                  <img src={productBox} alt="" className="size-12 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.title}</div>
                    <div className="text-[10px] text-muted-foreground mb-2">{item.sub}</div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0"><Play className="size-3" /></Button>
                </div>
              ))}
              <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-primary/30 text-center justify-center">
                <Database className="size-4 text-primary" />
                <span className="text-xs text-muted-foreground">Licencias · Certificados · Historial de compras</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Features ──────────────────────────────────────────────── */}
      <section id="ai" className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Inteligencia Artificial</div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">IA que Trabaja Mientras Duermes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Tres capas de IA que analizan, venden y soportan tu negocio en tiempo real.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "AI Sales Assistant", desc: "Entrenado sobre tus productos, documentación y FAQs. Convierte visitantes en compradores 24/7 sin intervención humana.", stat: "+34% conversión" },
              { icon: Cpu, title: "AI Support Agent", desc: "Resuelve tickets de primer nivel automáticamente: acceso, descargas, instalación, activación de licencias y pagos.", stat: "82% resolución automática" },
              { icon: BarChart2, title: "AI Analytics Engine", desc: "Detecta riesgo de churn, identifica oportunidades de upsell, predice LTV y descubre segmentos de alto valor.", stat: "3.2x ROI promedio" },
            ].map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                <f.icon className="size-8 text-primary mb-6 relative" />
                <h3 className="font-bold text-lg mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{f.desc}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                  <TrendingUp className="size-3" /> {f.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Lock, label: "JWT + OAuth 2.0" },
                { icon: Shield, label: "MFA & SSO" },
                { icon: Users, label: "RBAC Granular" },
                { icon: Database, label: "Auditoría completa" },
                { icon: Globe, label: "GDPR · PCI DSS" },
                { icon: Cpu, label: "Detección de fraude" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                  <s.icon className="size-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Seguridad Enterprise</div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Infraestructura que Cumple Estándares Corporativos</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Arquitectura diseñada bajo las más exigentes normativas globales. Protege tu negocio, cumple con regulaciones y mantén la confianza de tus clientes enterprise.
            </p>
            <ul className="space-y-3">
              {["Cifrado en tránsito y en reposo (AES-256)", "DDoS protection + rate limiting automático", "Monitoreo 24/7 con alertas en tiempo real", "Backup automático con retención de 90 días"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 text-primary shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Testimonios</div>
            <h2 className="text-4xl font-bold tracking-tight">Creadores y Empresas que Confían en PULSE AI</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-surface border border-border rounded-2xl p-8">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-mono text-primary">{t.initials}</div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Planes y Precios</div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Escala a Tu Ritmo</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">14 días gratis en cualquier plan. Sin contratos. Cancela cuando quieras.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`rounded-2xl border p-6 flex flex-col relative ${plan.highlight ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "bg-surface border-border"}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  Más Popular
                </div>
              )}
              <div className="mb-4">
                <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">{plan.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="text-muted-foreground text-sm mb-1">/mes</span>
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="size-3.5 text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={plan.highlight ? "contrast" : "outline"} size="sm" className="w-full">
                <Link to="/dashboard">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">
          ¿Necesitas facturación anual o implementación personalizada?{" "}
          <span className="text-primary cursor-pointer hover:underline">Contacta a ventas →</span>
        </p>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24 border-t border-border pt-24">
        <div className="bg-surface border border-border rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,oklch(0.7_0.146_162.5/0.08),transparent)] pointer-events-none" />
          <div className="relative">
            <Zap className="size-10 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold tracking-tight mb-4">Lanza Tu Primer Producto Hoy</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
              Únete a miles de creadores y empresas que ya escalan sus negocios digitales con PULSE AI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="contrast" className="gap-2">
                <Link to="/dashboard">
                  Empezar gratis — 14 días <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/marketplace">
                  Explorar Marketplace <Globe className="size-4" />
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Sin tarjeta de crédito · Setup en 5 minutos · Soporte en español</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
