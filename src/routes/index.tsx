import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  Zap, Shield, Star, ShoppingCart, Download, Check,
  ArrowRight, Flame, Sparkles, Clock, Users, Package,
  ChevronRight, Lock, BadgeCheck, TrendingUp, Eye,
  Play, Headphones, BookOpen, Code, Layers, Bot,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAnimatedCounter, useInView } from "@/hooks/useAnimatedCounter";
import { usePublicStats } from "@/lib/db";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PULSE AI — Productos Digitales Premium | Software, Cursos, eBooks con Descarga Instantánea" },
      { name: "description", content: "Accede a software, cursos, templates y eBooks de élite. Descarga instantánea. Pago seguro con Mercado Pago, PSE y Nequi. Garantía de 30 días. El marketplace digital #1 de Colombia." },
    ],
    links: [{ rel: "canonical", href: "https://pulseai.co/" }],
  }),
  component: Landing,
});

// ─── Pexels image bank ────────────────────────────────────────────────────────

const PX = {
  hero:        "https://images.pexels.com/photos/10352379/pexels-photo-10352379.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  success:     "https://images.pexels.com/photos/36764806/pexels-photo-36764806.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  money:       "https://images.pexels.com/photos/5899215/pexels-photo-5899215.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  code:        "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  coding2:     "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  education:   "https://images.pexels.com/photos/5934556/pexels-photo-5934556.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  education2:  "https://images.pexels.com/photos/5905716/pexels-photo-5905716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  ebook:       "https://images.pexels.com/photos/8546475/pexels-photo-8546475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  ebook2:      "https://images.pexels.com/photos/1329571/pexels-photo-1329571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  design:      "https://images.pexels.com/photos/1714202/pexels-photo-1714202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  workspace:   "https://images.pexels.com/photos/15977087/pexels-photo-15977087.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  workspace2:  "https://images.pexels.com/photos/19059657/pexels-photo-19059657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  laptop:      "https://images.pexels.com/photos/840185/pexels-photo-840185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  dev:         "https://images.pexels.com/photos/36706459/pexels-photo-36706459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  finance:     "https://images.pexels.com/photos/5717755/pexels-photo-5717755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  celebrate:   "https://images.pexels.com/photos/20955070/pexels-photo-20955070.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  codescreen:  "https://images.pexels.com/photos/4955393/pexels-photo-4955393.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  designer:    "https://images.pexels.com/photos/7598019/pexels-photo-7598019.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

// ─── Featured products (buyer showcase) ──────────────────────────────────────

const FEATURED = [
  {
    id: "f1", name: "Masterclass IA Engineering 2025",
    tagline: "De cero a sistemas IA en producción · 40 videos HD",
    price: 297000, originalPrice: 590000,
    badge: "bestseller", image: PX.education, category: "🎓 Curso",
    rating: 4.9, reviews: 1847, sales: 3200, viewers: 43,
  },
  {
    id: "f2", name: "Pack Automatización con Python",
    tagline: "50+ scripts listos · Bots, scrapers, APIs en 1 click",
    price: 149000, originalPrice: 299000,
    badge: "oferta", image: PX.code, category: "💻 Software",
    rating: 4.8, reviews: 924, sales: 1800, viewers: 28,
  },
  {
    id: "f3", name: "Guía Finanzas Personales Digitales",
    tagline: "200 páginas PDF · Libertad financiera paso a paso",
    price: 49000, originalPrice: 99000,
    badge: "new", image: PX.finance, category: "📚 eBook",
    rating: 4.9, reviews: 2341, sales: 5400, viewers: 67,
  },
  {
    id: "f4", name: "Kit Diseño para Emprendedores",
    tagline: "300+ templates Canva · Logos, post, pitch deck",
    price: 79000, originalPrice: 159000,
    badge: "featured", image: PX.design, category: "🎨 Templates",
    rating: 4.7, reviews: 678, sales: 1200, viewers: 19,
  },
  {
    id: "f5", name: "Curso SaaS con Next.js & Supabase",
    tagline: "Construye y vende tu propio SaaS desde 0",
    price: 399000, originalPrice: 799000,
    badge: "bestseller", image: PX.dev, category: "💻 Curso técnico",
    rating: 5.0, reviews: 412, sales: 890, viewers: 31,
  },
  {
    id: "f6", name: "Sistema de Ventas Online Completo",
    tagline: "Scripts de cierre, embudos y email marketing listos",
    price: 189000, originalPrice: 380000,
    badge: "oferta", image: PX.money, category: "⚡ Marketing",
    rating: 4.8, reviews: 1103, sales: 2700, viewers: 55,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCOP(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

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

// Live viewer counter cycling through fake numbers
function LiveViewers() {
  const [count, setCount] = useState(847);
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + Math.floor(Math.random() * 5) - 2), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="tabular-nums font-bold text-primary">{count.toLocaleString("es-CO")}</span>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function FeaturedCard({ p }: { p: typeof FEATURED[0] }) {
  const discount = Math.round((1 - p.price / p.originalPrice) * 100);
  const badgeCfg: Record<string, { label: string; cls: string }> = {
    bestseller: { label: "🔥 Más Vendido", cls: "bg-orange-500 text-white" },
    featured:   { label: "⭐ Destacado",  cls: "bg-yellow-500 text-black" },
    new:        { label: "✨ Nuevo",       cls: "bg-blue-500 text-white" },
    oferta:     { label: "🏷️ Oferta",     cls: "bg-red-500 text-white" },
  };
  const bc = badgeCfg[p.badge];

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {bc && <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${bc.cls}`}>{bc.label}</span>}
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-destructive text-white">-{discount}% OFF</span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <Eye className="size-3 text-primary" />
          <span className="text-[10px] text-white font-mono">{p.viewers} viendo ahora</span>
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-primary/80">{p.category}</div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">{p.name}</h3>
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{p.tagline}</p>
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`size-3 ${i < Math.floor(p.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
          ))}
          <span className="text-[11px] font-bold">{p.rating}</span>
          <span className="text-[10px] text-muted-foreground">({p.reviews.toLocaleString()})</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{p.sales.toLocaleString()} ventas</span>
        </div>
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-primary">{fmtCOP(p.price)}</span>
                <span className="text-xs text-muted-foreground line-through">{fmtCOP(p.originalPrice)}</span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <Download className="size-2.5" /> Descarga instantánea
              </div>
            </div>
            <Button asChild variant="contrast" size="sm" className="gap-1.5 font-bold text-xs shrink-0">
              <Link to="/marketplace"><ShoppingCart className="size-3.5" /> Comprar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────────────────

export default function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const { data: stats } = usePublicStats();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SiteNav />

      {/* ── URGENCY TOP BAR ──────────────────────────────────────────────── */}
      <div className="bg-primary text-primary-foreground text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-3 flex-wrap">
        <Flame className="size-3.5 shrink-0" />
        <span><LiveViewers /> personas explorando productos ahora mismo</span>
        <span className="hidden sm:inline opacity-60">·</span>
        <span className="text-primary-foreground/80">Descarga instantánea · Garantía 30 días · Soporte 24/7</span>
        <Link to="/marketplace" className="underline font-bold hover:no-underline ml-1">Ver todo →</Link>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-20 pb-0 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={PX.hero} alt="" className="w-full h-full object-cover opacity-[0.07]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "5s" }} />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "7s", animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-0 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh] pb-24 pt-8">
            {/* Left: Copy */}
            <div>
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 text-primary text-[11px] font-mono tracking-wider uppercase mb-8">
                <BadgeCheck className="size-3.5" />
                Marketplace #1 de Productos Digitales en Colombia
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance mb-8">
                El conocimiento que{" "}
                <span className="relative">
                  <span className="text-primary">transforma</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full" />
                </span>{" "}
                tu vida,<br />
                <span className="text-muted-foreground/60">ahora en tu pantalla.</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed mb-6 max-w-xl">
                Miles de compradores ya acceden a <strong className="text-foreground">software, cursos, eBooks y templates de élite</strong> con descarga instantánea y pago seguro.
                <br /><br />
                <span className="text-foreground font-medium">¿Por qué seguir sin el conocimiento que te está faltando?</span>
              </p>

              {/* Pain → desire triggers */}
              <div className="space-y-3 mb-8">
                {[
                  "Aprende lo que las universidades no enseñan",
                  "Automatiza tu trabajo y gana horas cada semana",
                  "Invierte en conocimiento que genera retorno real",
                  "Acceso de por vida · Descarga en segundos",
                ].map(t => (
                  <div key={t} className="flex items-center gap-3 text-sm">
                    <div className="size-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-primary" />
                    </div>
                    <span className="text-foreground/80">{t}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button asChild size="lg" variant="contrast" className="gap-2 text-base px-8 h-14 font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow">
                  <Link to="/marketplace">
                    <Sparkles className="size-5" /> Explorar Marketplace
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-base px-8 h-14">
                  <Link to="/marketplace">
                    <Flame className="size-5" /> Ver ofertas del día
                  </Link>
                </Button>
              </div>

              {/* Micro-trust */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Lock className="size-3 text-emerald-400" /> Pago 100% seguro</span>
                <span className="flex items-center gap-1.5"><Shield className="size-3 text-primary" /> Garantía 30 días</span>
                <span className="flex items-center gap-1.5"><Download className="size-3 text-blue-400" /> Descarga al instante</span>
                <span className="flex items-center gap-1.5"><Headphones className="size-3 text-yellow-400" /> Soporte 24/7</span>
              </div>
            </div>

            {/* Right: Hero image collage */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main image */}
                <div className="rounded-3xl overflow-hidden border border-primary/10 shadow-2xl shadow-primary/10">
                  <img src={PX.workspace2} alt="Productos digitales premium" className="w-full object-cover" style={{ aspectRatio: "4/3" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                {/* Floating card — social proof */}
                <div className="absolute -bottom-6 -left-6 bg-surface border border-border rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="size-10 rounded-xl overflow-hidden border border-border">
                      <img src={PX.education} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold">Masterclass IA 2025</div>
                      <div className="text-[10px] text-muted-foreground">Comprado hace 2 min</div>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                {/* Floating card — discount */}
                <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl p-4 shadow-2xl">
                  <div className="text-2xl font-extrabold">-70%</div>
                  <div className="text-[11px] font-medium opacity-90">Ofertas hoy</div>
                </div>
                {/* Floating card — downloads */}
                <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-surface border border-border rounded-2xl p-3 shadow-2xl">
                  <div className="text-[10px] text-muted-foreground mb-1">Descargado hoy</div>
                  <div className="text-xl font-extrabold text-primary">+2.4k</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-emerald-400">En tiempo real</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAYMENT METHODS ──────────────────────────────────────────────── */}
      <div className="border-y border-border bg-surface/50 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/60">Paga con seguridad:</span>
          {["Mercado Pago", "PSE", "Nequi", "Daviplata", "Efecty", "Tarjeta Débito/Crédito"].map(m => (
            <span key={m} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-[11px] font-medium">
              <Lock className="size-3 text-primary" /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-surface/30 to-transparent">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <AnimatedStat value={stats?.totalProducts ?? 148} suffix="+" label="Productos disponibles" />
          <AnimatedStat value={stats?.totalCreators ?? 62} suffix="+" label="Creadores verificados" />
          <AnimatedStat value={stats?.totalOrders ?? 2400} suffix="+" label="Compradores satisfechos" />
          <AnimatedStat value={30} label="Días de garantía total" suffix=" días" />
        </div>
      </section>

      {/* ── PSYCHOLOGICAL HOOK SECTION ───────────────────────────────────── */}
      <section className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="absolute inset-0 pointer-events-none">
              <img src={PX.celebrate} alt="" className="w-full h-full object-cover opacity-[0.08]" />
            </div>
            <div className="relative grid md:grid-cols-2 gap-0">
              <div className="p-10 md:p-14">
                <div className="text-xs font-mono text-primary uppercase tracking-widest mb-4">La pregunta que debes hacerte</div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
                  ¿Cuánto vale una sola habilidad que cambia el rumbo de tu carrera?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Las personas que invierten en conocimiento digital hoy, son las que lideran los mercados mañana.
                  Mientras otros esperan, <span className="text-foreground font-semibold">los que actúan se quedan con las oportunidades</span>.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    { pain: "Antes", after: "Después de PULSE AI", icon: "→" },
                  ].map(() => null)}
                  {[
                    ["Sin las herramientas correctas", "Software y automatizaciones listas para usar"],
                    ["Cursos caros sin resultados reales", "Conocimiento práctico con garantía de 30 días"],
                    ["Trabajando más, ganando lo mismo", "Sistemas digitales que trabajan mientras duermes"],
                  ].map(([before, after]) => (
                    <div key={before} className="flex items-center gap-3 text-sm">
                      <ArrowRight className="size-4 text-primary shrink-0" />
                      <span className="text-muted-foreground line-through text-xs">{before}</span>
                      <ChevronRight className="size-3 text-primary/40 shrink-0" />
                      <span className="text-foreground font-medium text-xs">{after}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="contrast" className="gap-2 font-bold">
                  <Link to="/marketplace">
                    <Zap className="size-4" /> Quiero transformar mi negocio
                  </Link>
                </Button>
              </div>
              <div className="relative hidden md:block">
                <img src={PX.money} alt="Éxito financiero digital" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section id="productos" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
              <Flame className="size-3.5" /> Productos más vendidos
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Lo que los exitosos<br />ya están usando</h2>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link to="/marketplace">Ver todos <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED.map(p => <FeaturedCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* ── CATEGORIES WITH IMAGES ───────────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Explora por categoría</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Todo lo que necesitas para crecer
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Cada categoría, curada por expertos. Cada producto, verificado por nuestra comunidad.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "Software & SaaS", icon: Code, img: PX.codescreen, count: "38+", desc: "Apps, plugins, automatizaciones y scripts listos para usar", color: "from-blue-500/20" },
              { label: "Cursos & Academias", icon: Play, img: PX.education2, count: "52+", desc: "Video cursos HD con instructores certificados", color: "from-purple-500/20" },
              { label: "eBooks & Guías", icon: BookOpen, img: PX.ebook, count: "41+", desc: "Conocimiento destilado en guías prácticas y PDFs premium", color: "from-emerald-500/20" },
              { label: "Templates & Recursos", icon: Layers, img: PX.designer, count: "67+", desc: "Diseño, Notion, Figma, Excel y plantillas para todo", color: "from-orange-500/20" },
              { label: "IA & Automatización", icon: Bot, img: PX.workspace, count: "23+", desc: "Flujos, prompts, bots y agentes de IA productivos", color: "from-pink-500/20" },
              { label: "Marketing Digital", icon: TrendingUp, img: PX.finance, count: "29+", desc: "Embudos, copy, SEO y estrategias que generan ventas", color: "from-yellow-500/20" },
            ].map(c => (
              <Link key={c.label} to="/marketplace" className="group relative rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                <div className="relative aspect-[4/3]">
                  <img src={c.img} alt={c.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${c.color} via-black/40 to-black/70`} />
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="size-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <c.icon className="size-4 text-white" />
                      </div>
                      <span className="text-[10px] font-bold bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-full text-white/90">{c.count} productos</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg mb-1">{c.label}</h3>
                      <p className="text-white/60 text-[11px] line-clamp-2">{c.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BUY HERE ─────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Por qué elegir PULSE AI</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Compra sin miedo. Aprende sin límites.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Cada centavo que inviertes está protegido. Si no quedas satisfecho, te devolvemos el dinero.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Garantía Total 30 días", desc: "No te gustó el producto? Te devolvemos cada peso sin hacer preguntas. Cero riesgo.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { icon: Download, title: "Descarga al instante", desc: "Pagas y en segundos tienes tu producto. Sin esperas. Sin complicaciones. Disponible 24/7.", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
              { icon: Lock, title: "Pago 100% Seguro", desc: "Mercado Pago, PSE y Nequi. Encriptación SSL. Tu información financiera siempre protegida.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              { icon: BadgeCheck, title: "Productos Verificados", desc: "Cada vendedor y producto pasa por verificación. Compras solo de creadores certificados.", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
              { icon: Users, title: "Comunidad de +2.400", desc: "Únete a miles de compradores que ya están aplicando lo que aprendieron aquí.", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
              { icon: Headphones, title: "Soporte Humano 24/7", desc: "Tenemos problemas? Te respondemos en minutos. En español. Con solución garantizada.", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
            ].map(f => (
              <div key={f.title} className={`rounded-2xl border ${f.bg} p-7 hover:scale-[1.02] transition-transform duration-300`}>
                <div className={`size-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <f.icon className={`size-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF — Testimonials ──────────────────────────────────── */}
      <section className="border-t border-border bg-surface/30 px-6 py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Historias reales</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Los que compraron ya cambiaron su historia</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Andrés M.", city: "Bogotá", product: "Masterclass IA Engineering",
                img: PX.coding2,
                quote: "Antes perdía 3 horas diarias en tareas manuales. Apliqué el curso de automatización y ahora eso lo hace un script en 5 minutos. Mi cliente lo notó y me subió el contrato.",
                stars: 5, gain: "Automatizó su flujo de trabajo completo",
              },
              {
                name: "Laura V.", city: "Medellín", product: "Guía Finanzas Personales",
                img: PX.education,
                quote: "Compré dudando. A los 3 días ya había aplicado el módulo de inversión y empecé a ver resultados. La garantía de 30 días me dio el empujón que necesitaba para intentarlo.",
                stars: 5, gain: "Comenzó a invertir con confianza",
              },
              {
                name: "Carlos R.", city: "Cali", product: "Pack Automatización Python",
                img: PX.dev,
                quote: "Los scripts vinieron listos para correr. No tuve que escribir una sola línea de código. Le ofrecí el servicio a 3 clientes y recuperé la inversión en 48 horas.",
                stars: 5, gain: "Recuperó la inversión en 48 horas",
              },
            ].map(t => (
              <div key={t.name} className="bg-surface border border-border rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
                <div className="relative h-44 overflow-hidden">
                  <img src={t.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] font-mono bg-primary/90 text-primary-foreground px-2 py-1 rounded-full">{t.product}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex mb-3">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="size-3" /> {t.gain}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (BUYER) ─────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Tan simple como</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">3 pasos para tener tu producto</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "01", icon: Sparkles, title: "Elige tu producto", desc: "Navega el marketplace, filtra por categoría, lee reseñas reales y encuentra exactamente lo que necesitas.", img: PX.laptop },
              { n: "02", icon: Lock, title: "Pago seguro en segundos", desc: "Mercado Pago, PSE, Nequi o tarjeta. Procesamos tu pago con encriptación bancaria. Tu dinero siempre protegido.", img: PX.workspace },
              { n: "03", icon: Download, title: "Descarga instantánea", desc: "Acceso inmediato. Descarga tu archivo o accede al link de entrega en segundos. Tuyo para siempre.", img: PX.ebook2 },
            ].map((s, i) => (
              <div key={s.n} className="group text-center">
                <div className="relative mb-6 rounded-2xl overflow-hidden border border-border group-hover:border-primary/40 transition-all">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full object-cover group-hover:scale-110 transition-transform duration-700" style={{ aspectRatio: "4/3" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="size-14 rounded-2xl bg-primary/90 border border-primary flex items-center justify-center shadow-xl">
                      <s.icon className="size-6 text-primary-foreground" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 text-5xl font-extrabold text-white/10 font-mono">{s.n}</span>
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── URGENCY / SCARCITY CTA ───────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={PX.success} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-background" />
            <div className="relative text-center px-8 py-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-mono mb-8">
                <Clock className="size-4 text-primary" />
                <span>Ofertas activas ahora mismo · Descuentos hasta 70%</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance">
                El único momento de actuar<br />
                <span className="text-primary">es ahora.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
                Cada día que pasa sin el conocimiento correcto es un día que tu competencia avanza.
                <span className="text-foreground font-semibold"> Los precios especiales de hoy no duran para siempre.</span>
              </p>
              <p className="text-sm text-muted-foreground mb-10">
                Más de <strong className="text-foreground"><LiveViewers /></strong> personas en el marketplace ahora mismo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="contrast" className="gap-2 text-lg px-10 h-16 font-bold shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-shadow">
                  <Link to="/marketplace">
                    <Flame className="size-5" /> Ver todos los productos
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 text-lg px-10 h-16 backdrop-blur-sm bg-white/5 border-white/20">
                  <Link to="/marketplace">
                    <Package className="size-5" /> Explorar categorías
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-8 flex items-center justify-center gap-4 flex-wrap">
                <span className="flex items-center gap-1"><Shield className="size-3" /> Garantía 30 días</span>
                <span className="flex items-center gap-1"><Lock className="size-3" /> Pago seguro</span>
                <span className="flex items-center gap-1"><Download className="size-3" /> Descarga instantánea</span>
                <span className="flex items-center gap-1"><BadgeCheck className="size-3" /> Productos verificados</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
