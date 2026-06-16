import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  Zap, Globe, Video, KeyRound, BarChart3, Bot, Users, Package,
  ShoppingCart, Mail, Shield, Code, BookOpen, Award, TrendingUp,
  Check, ArrowRight, Star, Layers, Cpu, Database, Webhook,
  GraduationCap, Briefcase, Lock,
  ChevronRight, Sparkles, Flame, Rocket, Heart,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/lib/mock-data";
import { useAnimatedCounter, useInView } from "@/hooks/useAnimatedCounter";
import { usePublicStats } from "@/lib/db";

// The home page is always the high-conversion marketplace for buyers.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PULSE AI — El Marketplace de Productos Digitales #1 de Latinoamérica" },
      { name: "description", content: "PULSE AI: vende y compra software, cursos, templates y eBooks. El sistema operativo de la economía digital latina. Empieza gratis hoy." },
    ],
    links: [{ rel: "canonical", href: "https://pulseai.co/" }],
  }),
  component: Landing,
});

// ─── Animated stat box ───────────────────────────────────────────────────────

function AnimatedStat({ value, suffix = "", label, prefix = "" }: {
  value: number; suffix?: string; label: string; prefix?: string;
}) {
  const { ref, inView } = useInView();
  const count = useAnimatedCounter(value, 2000, inView);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary tabular-nums">
        {prefix}{count.toLocaleString("es-CO")}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

const productTypes = [
  { icon: Code, label: "Software & SaaS", desc: "Apps, plugins, scripts y automatizaciones" },
  { icon: GraduationCap, label: "Cursos & Academias", desc: "Video cursos, certificaciones, membresías" },
  { icon: BookOpen, label: "E-Books & Guías", desc: "PDFs, whitepapers, newsletters premium" },
  { icon: Layers, label: "Templates & Recursos", desc: "Diseño, código, bases de datos y Notion" },
  { icon: Briefcase, label: "Servicios & Consultoría", desc: "Mentorías, coaching, implementaciones" },
  { icon: Award, label: "Licencias & IP", desc: "Licencias software, white-label, APIs" },
];

const platformModules = [
  { icon: Package, label: "Product Builder", desc: "Código + docs + videos + licencias en un solo paquete híbrido." },
  { icon: ShoppingCart, label: "Smart Checkout", desc: "1-click checkout, order bumps, upsells, 12+ métodos de pago." },
  { icon: KeyRound, label: "License Engine", desc: "Límites de activación, control por dispositivo, validación vía API." },
  { icon: Video, label: "Video Streaming", desc: "HLS/DASH 4K con DRM, watermark dinámico, cursos con progreso." },
  { icon: Mail, label: "Email Automation", desc: "Flujos visuales, drip sequences, triggers de comportamiento." },
  { icon: Users, label: "CRM Enterprise", desc: "Vista 360° del cliente, LTV scoring, segmentos y pipelines." },
  { icon: BarChart3, label: "Executive Analytics", desc: "MRR, ARR, LTV, churn, cohortes y análisis de embudo." },
  { icon: Bot, label: "AI Suite", desc: "Asistente de ventas IA, bot de soporte y analytics predictivos." },
  { icon: Globe, label: "Multi-Vendor Market", desc: "Lanza tu propio marketplace con storefronts de marca." },
  { icon: TrendingUp, label: "Affiliate Network", desc: "Programa global con comisiones automáticas y pagos." },
  { icon: Webhook, label: "Developer API", desc: "REST API, webhooks, SDKs e integraciones con 200+ apps." },
  { icon: Shield, label: "Enterprise Security", desc: "JWT, OAuth 2.0, MFA, SSO, RBAC, GDPR, PCI DSS." },
];

const competitors = [
  { name: "Gumroad", savings: "$49/mes" },
  { name: "Kajabi", savings: "$119/mes" },
  { name: "Teachable", savings: "$59/mes" },
  { name: "Shopify", savings: "$79/mes" },
  { name: "HubSpot", savings: "$800/mes" },
  { name: "Mailchimp", savings: "$20/mes" },
  { name: "Stripe Connect", savings: "3.5% fees" },
  { name: "Lemon Squeezy", savings: "5% fees" },
];

const whyCards = [
  {
    icon: Zap,
    title: "Setup en 5 minutos",
    desc: "Registro, producto publicado y link de pago listo — sin código, sin servidores, sin fricción.",
    badge: "Listo para vender hoy",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Pagos seguros con Mercado Pago",
    desc: "Integración nativa con el procesador #1 de Latinoamérica. PSE, tarjetas, efecty, QR y más.",
    badge: "PCI DSS Nivel 1",
    color: "text-emerald-400",
  },
  {
    icon: Bot,
    title: "IA que vende por ti",
    desc: "El asistente de IA responde preguntas, maneja soporte post-compra y sugiere upsells automáticamente.",
    badge: "24/7 sin intervención",
    color: "text-blue-400",
  },
  {
    icon: TrendingUp,
    title: "Afiliados que te traen clientes",
    desc: "Activa tu programa de afiliados con un clic. Ellos venden, tú pagas comisión automáticamente.",
    badge: "Hasta 40% comisión",
    color: "text-yellow-400",
  },
  {
    icon: KeyRound,
    title: "Licencias digitales robustas",
    desc: "Genera, valida y revoca licencias con límites de activación. API lista para integrar en tu software.",
    badge: "Enterprise grade",
    color: "text-purple-400",
  },
  {
    icon: BarChart3,
    title: "Analytics que generan decisiones",
    desc: "MRR, LTV, churn, cohortes y análisis de embudo en tiempo real — sin Excel, sin esperas.",
    badge: "Datos en tiempo real",
    color: "text-rose-400",
  },
];

const timeline = [
  { step: "01", icon: Rocket, title: "Crea tu cuenta gratis", desc: "Registro en 90 segundos. Sin tarjeta de crédito. Acceso inmediato al dashboard completo." },
  { step: "02", icon: Package, title: "Publica tu producto", desc: "Sube archivos, configura precio, licencias y afiliados. Tu página de ventas lista en minutos." },
  { step: "03", icon: Zap, title: "Vende en autopiloto", desc: "La IA maneja el soporte, los afiliados traen clientes y los pagos llegan automáticamente." },
];

const aiFeatures = [
  { icon: Bot, title: "AI Sales Assistant", desc: "Entrenado sobre tus productos. Convierte visitantes en compradores 24/7 sin intervención.", metric: "+34% conversión", color: "text-primary" },
  { icon: Cpu, title: "AI Support Agent", desc: "Resuelve tickets automáticamente: acceso, descargas, instalación, activación de licencias.", metric: "82% resolución auto", color: "text-blue-400" },
  { icon: BarChart3, title: "AI Analytics Engine", desc: "Detecta churn, identifica upsells, predice LTV y descubre segmentos de alto valor.", metric: "3.2x ROI proyectado", color: "text-emerald-400" },
];

const trustBadges = [
  "SSL 256-bit", "PCI DSS Level 1", "GDPR Compliant", "SOC 2 Type II", "ISO 27001",
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const { data: stats } = usePublicStats();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-24 pb-28 px-6 overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/6 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/4 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.7_0.146_162.5/0.15),transparent)]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }}
        />

        <div className="max-w-6xl mx-auto text-center relative">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-mono tracking-wider uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            El OS de la Economía Digital Latina · En vivo ahora
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-balance mb-8">
            Vende lo que{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">sabes</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 blur-sm rounded-full" />
            </span>
            .<br />Gana lo que{" "}
            <span className="text-primary">mereces</span>.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-12 leading-relaxed">
            PULSE AI es el <strong className="text-foreground">marketplace de productos digitales premium</strong> de Latinoamérica.<br />
            Software · Cursos · Templates · eBooks — en una sola plataforma con IA.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button asChild size="lg" variant="contrast" className="gap-2 text-base px-8 h-14 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              <Link to="/marketplace">
                <Sparkles className="size-5" /> Explorar Marketplace
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 text-base px-8 h-14">
              <Link to="/vender">
                <Rocket className="size-5" /> Empezar a vender gratis
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mb-16">
            Sin tarjeta de crédito · Setup en 5 min · Soporte en español 24/7
          </p>

          {/* Dashboard mockup — Linear style */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative bg-[#0d0d0d] rounded-2xl border border-white/8 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5">
              {/* Window chrome */}
              <div className="h-11 bg-black/60 border-b border-white/5 flex items-center px-5 gap-3">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-4 py-1.5 text-[11px] font-mono text-white/40">
                    <div className="size-3 rounded-full bg-primary/60 animate-pulse" />
                    dash.pulseai.co/analytics
                  </div>
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-5 flex gap-5">
                {/* Sidebar */}
                <div className="w-44 shrink-0 hidden lg:flex flex-col gap-1">
                  {["Overview", "Products", "Customers", "Analytics", "Affiliates", "Automation", "AI Suite"].map((s, i) => (
                    <div key={s} className={`h-8 rounded-lg flex items-center px-3 text-xs font-medium ${
                      i === 0 ? "bg-primary/15 border border-primary/20 text-primary" : "text-white/30 hover:text-white/60"
                    }`}>{s}</div>
                  ))}
                </div>
                {/* Main */}
                <div className="flex-1 space-y-4 min-w-0">
                  {/* KPIs */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { l: "INGRESOS NETOS", v: "Tus datos", d: "tiempo real", c: "text-emerald-400" },
                      { l: "MRR", v: "Tus datos", d: "tiempo real", c: "text-primary" },
                      { l: "CONVERSIÓN", v: "Tus datos", d: "tiempo real", c: "text-blue-400" },
                      { l: "PRODUCTOS", v: `${stats?.totalProducts ?? 0}`, d: "publicados", c: "text-rose-400" },
                    ].map(m => (
                      <div key={m.l} className="p-3 rounded-xl bg-white/3 border border-white/6">
                        <div className="text-[9px] font-mono text-white/30 mb-1">{m.l}</div>
                        <div className="text-xl font-bold text-white tracking-tight">{m.v}</div>
                        <div className={`text-[10px] mt-1 font-mono ${m.c}`}>{m.d}</div>
                      </div>
                    ))}
                  </div>
                  {/* Chart placeholder */}
                  <div className="rounded-xl bg-white/3 border border-white/6 p-4">
                    <div className="text-xs font-semibold text-white/60 mb-3">Curva de ingresos — se alimenta con tus ventas reales</div>
                    <div className="flex items-end gap-2 h-20">
                      {[20, 35, 30, 50, 65, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full rounded-t-sm bg-primary/30 relative overflow-hidden" style={{ height: `${h * 0.8}%` }}>
                            <div className="absolute inset-x-0 bottom-0 bg-primary rounded-t-sm" style={{ height: "40%" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* AI insight */}
                  <div className="rounded-xl bg-primary/8 border border-primary/15 p-3 flex items-start gap-2.5">
                    <Bot className="size-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-primary mb-0.5">AI Insight detectado</div>
                      <p className="text-[11px] text-white/50 leading-relaxed">El motor de IA analiza tus ventas y sugiere campañas, upsells y oportunidades automáticamente.</p>
                    </div>
                    <button className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors">
                      Aplicar <ArrowRight className="size-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR — real counters from Supabase ──────────────────────── */}
      <section className="border-y border-border bg-surface/60 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <AnimatedStat value={stats?.totalProducts ?? 0} label="Productos publicados" />
          <AnimatedStat value={stats?.totalCreators ?? 0} label="Creadores registrados" />
          <AnimatedStat value={stats?.totalOrders ?? 0} label="Ventas procesadas" />
          <AnimatedStat value={99.9} suffix="%" label="Uptime garantizado" prefix="" />
        </div>
      </section>

      {/* ── TRUST LOGOS ──────────────────────────────────────────────────── */}
      <section className="py-10 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">Certificaciones y cumplimiento</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map(b => (
              <span key={b} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-surface text-xs font-mono text-muted-foreground">
                <Shield className="size-3 text-primary" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU CAN SELL ────────────────────────────────────────────── */}
      <section id="productos" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Catálogo Completo</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Vende cualquier producto digital</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Desde un ebook hasta una plataforma SaaS completa — todo desde la misma infraestructura enterprise.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productTypes.map(t => (
            <div key={t.label} className="group bg-surface border border-border rounded-2xl p-7 hover:border-primary/40 hover:bg-primary/2 transition-all duration-300 cursor-default">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <t.icon className="size-6" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{t.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Tres pasos</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">De cero a ventas en 5 minutos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {timeline.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="relative inline-flex">
                  <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto transition-colors">
                    <step.icon className="size-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 size-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="contrast" className="gap-2 font-bold px-10">
              <Link to="/vender"><Rocket className="size-5" /> Crear mi cuenta gratis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── PLATFORM MODULES ─────────────────────────────────────────────── */}
      <section id="plataforma" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Plataforma Todo-en-Uno</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">12 módulos enterprise. Una sola factura.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">PULSE AI reemplaza toda tu pila de herramientas. Sin integraciones rotas, sin datos fragmentados.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformModules.map(m => (
            <div key={m.label} className="group bg-surface border border-border rounded-xl p-5 hover:border-primary/30 hover:bg-primary/2 transition-all duration-200">
              <m.icon className="size-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-sm mb-1.5">{m.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REPLACE THE STACK ────────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Consolida tu Stack</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Para de pagar por 8 herramientas.<br />
              <span className="text-primary">Usa una sola.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">Las empresas gastan en promedio $2.400/mes en herramientas desconectadas. PULSE AI lo reemplaza desde $29/mes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {competitors.map(c => (
              <div key={c.name} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border hover:border-destructive/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-destructive/60 shrink-0 group-hover:bg-destructive transition-colors" />
                  <span className="text-sm font-medium text-muted-foreground line-through">{c.name}</span>
                </div>
                <span className="text-[10px] font-mono text-destructive/70 font-bold">{c.savings}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/20 max-w-xl mx-auto">
            <Zap className="size-6 text-primary shrink-0" />
            <div>
              <div className="font-bold text-primary">Todo reemplazado por PULSE AI</div>
              <div className="text-sm text-muted-foreground">Una factura · Un login · Un dashboard</div>
            </div>
            <Button asChild variant="contrast" size="sm" className="shrink-0">
              <Link to="/vender">Ver planes <ArrowRight className="size-3.5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ──────────────────────────────────────────────────── */}
      <section id="ia" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Inteligencia Artificial</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">IA que trabaja mientras duermes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Tres capas de IA que analizan, venden y soportan tu negocio en tiempo real, sin intervención humana.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {aiFeatures.map(f => (
            <div key={f.title} className="group relative bg-surface border border-border rounded-2xl p-8 overflow-hidden hover:border-primary/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/4 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/8 transition-colors duration-300 pointer-events-none" />
              <div className="relative">
                <f.icon className={`size-9 mb-6 ${f.color}`} />
                <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{f.desc}</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono ${f.color}`}>
                  <TrendingUp className="size-3" /> {f.metric}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECURITY ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Seguridad Enterprise</div>
            <h2 className="text-4xl font-bold tracking-tight mb-5">Infraestructura que cumple estándares corporativos</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">Protege tu negocio, cumple regulaciones colombianas e internacionales y mantén la confianza de tus clientes enterprise.</p>
            <ul className="space-y-3">
              {[
                "Cifrado en tránsito y en reposo (AES-256)",
                "DDoS protection + rate limiting automático",
                "Monitoreo 24/7 con alertas en tiempo real",
                "Backup automático con retención de 90 días",
                "Cumplimiento Ley 1581/2012 (Habeas Data Colombia)",
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="size-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Check className="size-3 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Lock, label: "JWT + OAuth 2.0" },
              { icon: Shield, label: "MFA & SSO" },
              { icon: Users, label: "RBAC Granular" },
              { icon: Database, label: "Auditoría completa" },
              { icon: Globe, label: "GDPR · PCI DSS" },
              { icon: Cpu, label: "Detección de fraude" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border hover:border-primary/30 transition-colors">
                <s.icon className="size-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PULSE AI — value cards (replaces fake testimonials) ──────── */}
      <section id="por-que" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Por qué PULSE AI</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">La plataforma que los creadores merecen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Diseñada por emprendedores, para emprendedores. Cada módulo resuelve un problema real del negocio digital.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyCards.map(c => (
            <div key={c.title} className="group bg-surface border border-border rounded-2xl p-7 hover:border-primary/40 transition-all duration-300">
              <div className={`size-12 rounded-xl bg-black/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <c.icon className={`size-6 ${c.color}`} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-base">{c.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/20 border border-white/5 ${c.color}`}>
                <Star className="size-3" /> {c.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Be the first CTA */}
        <div className="mt-12 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center max-w-2xl mx-auto">
          <div className="text-2xl font-bold mb-2">Sé uno de los primeros creadores</div>
          <p className="text-muted-foreground mb-6 text-sm">PULSE AI está en lanzamiento. Los primeros en registrarse obtienen acceso prioritario, soporte directo y precios especiales.</p>
          <Button asChild size="lg" variant="contrast" className="gap-2 font-bold px-10">
            <Link to="/vender"><Rocket className="size-5" /> Unirme ahora — es gratis</Link>
          </Button>
        </div>
      </section>

      {/* ── AFFILIATE CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Programa de afiliados</div>
              <h2 className="text-4xl font-bold tracking-tight mb-5">Recomienda y gana hasta 40% de comisión</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">Sin inventario. Sin inversión. Solo comparte tu enlace y cobra automáticamente cada 15 días.</p>
              <Button asChild size="lg" variant="contrast" className="gap-2 font-bold">
                <Link to="/afiliados"><TrendingUp className="size-5" /> Ser afiliado gratis</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Comisión por venta de Software", pct: 30, color: "bg-blue-500" },
                { label: "Comisión por venta de Cursos", pct: 35, color: "bg-primary" },
                { label: "Comisión por venta de Templates", pct: 40, color: "bg-emerald-500" },
                { label: "Bono top 3 del mes", pct: 5, color: "bg-yellow-500", extra: "+5% extra" },
              ].map(item => (
                <div key={item.label} className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-primary">{item.extra ?? `${item.pct}%`}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${item.pct * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="precios" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Planes y Precios</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Escala a tu ritmo</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">14 días gratis en cualquier plan. Sin contratos. Cancela cuando quieras.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pricingPlans.map(plan => (
            <div key={plan.id} className={`relative rounded-2xl border p-7 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
              plan.highlight
                ? "bg-primary/5 border-primary/40 ring-2 ring-primary/20 shadow-lg shadow-primary/10"
                : "bg-surface border-border hover:border-primary/20"
            }`}>
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  <Flame className="size-3" /> Más Popular
                </div>
              )}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{plan.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="text-muted-foreground text-sm mb-2">/mes</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild variant={plan.highlight ? "contrast" : "outline"} className="w-full font-bold">
                <Link to="/vender">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-10">
          ¿Necesitas facturación anual o implementación personalizada?{" "}
          <a href="https://wa.me/573147444715" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Habla con ventas →</a>
        </p>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-28 border-t border-border pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-blue-500/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,oklch(0.7_0.146_162.5/0.25),transparent)]" />
            <div className="absolute inset-0 border border-primary/20 rounded-3xl" />
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-8">
                <Heart className="size-3.5 fill-primary" /> La nueva generación del negocio digital latinoamericano
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance">
                El mejor momento<br />para empezar fue ayer.<br />
                <span className="text-primary">El segundo mejor es hoy.</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-10 max-w-lg mx-auto">
                Únete a creadores y empresas que escalan sus negocios digitales con PULSE AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" variant="contrast" className="gap-2 text-base px-10 h-14 font-bold shadow-xl shadow-primary/30">
                  <Link to="/marketplace">
                    <Sparkles className="size-5" /> Explorar el Marketplace
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-base px-10 h-14">
                  <Link to="/vender">
                    <ChevronRight className="size-5" /> Empezar gratis hoy
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-6">Sin tarjeta · Setup en 5 min · Soporte en español 24/7 · Garantía 30 días</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
