import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { marketplaceListings, marketplaceCategories, type MarketplaceListing } from "@/lib/mock-data";
import {
  Search, Star, ShoppingCart, ChevronLeft, ChevronRight,
  Flame, Clock, Eye, Zap, Shield, Download, Bell,
  Facebook, Twitter, Share2, X, Check, TrendingUp, Users,
  ArrowRight, Tag, Package,
} from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — PULSE AI | Productos Digitales Premium" },
      { name: "description", content: "Miles de productos digitales: software, cursos, templates y ebooks. Compra y descarga instantánea con Mercado Pago." },
    ],
  }),
  component: MarketplacePage,
});

// ─── Social proof notifications ───────────────────────────────────────────────

const socialProofMessages = [
  { name: "Carlos M.", city: "Bogotá", product: "Neural-Kit SDK", time: "hace 2 min" },
  { name: "Ana G.", city: "Ciudad de México", product: "Masterclass IA", time: "hace 4 min" },
  { name: "Luis P.", city: "Buenos Aires", product: "SaaS Starter Stack", time: "hace 6 min" },
  { name: "María J.", city: "Madrid", product: "API Architecture Playbook", time: "hace 8 min" },
  { name: "Diego R.", city: "Lima", product: "Advanced Shader Pack", time: "hace 11 min" },
];

// ─── Register Modal ───────────────────────────────────────────────────────────

function RegisterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"register" | "success">("register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Completa todos los campos");
      return;
    }
    setStep("success");
    toast.success("¡Cuenta creada! Revisa tu email.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>

        {step === "register" ? (
          <>
            <div className="text-center mb-6">
              <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Acceso gratuito</div>
              <h2 className="text-2xl font-bold">Crear cuenta</h2>
              <p className="text-sm text-muted-foreground mt-1">Compra y descarga en segundos</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input placeholder="Carlos Rivera" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-black/20" />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="bg-black/20" />
              </div>

              <Button variant="contrast" className="w-full font-bold text-base" onClick={handleSubmit}>
                <Zap className="size-4" /> Crear cuenta gratis
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative text-center"><span className="bg-surface px-3 text-xs text-muted-foreground">o continúa con</span></div>
              </div>

              <button className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-medium text-sm transition-colors" onClick={() => toast.success("Conectando con Facebook...")}>
                <Facebook className="size-4" /> Continuar con Facebook
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Al registrarte aceptas los <a href="#" className="text-primary hover:underline">Términos</a> y la <a href="#" className="text-primary hover:underline">Política de privacidad</a>.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="size-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
              <Check className="size-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido a PULSE AI!</h2>
            <p className="text-sm text-muted-foreground mb-6">Tu cuenta está lista. Ahora puedes comprar y descargar productos instantáneamente.</p>
            <Button variant="contrast" className="w-full" onClick={onClose}>Ir al Marketplace</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ listing, onBuy, compact = false }: { listing: MarketplaceListing; onBuy: (l: MarketplaceListing) => void; compact?: boolean }) {
  const discount = listing.originalPrice ? Math.round((1 - listing.price / listing.originalPrice) * 100) : 0;

  const shareOnFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://pulseai.io/marketplace/product/${listing.id}`)}&quote=${encodeURIComponent(`¡Mira este increíble producto digital: ${listing.name} por solo $${listing.price}!`)}`;
    window.open(url, "_blank", "width=600,height=400");
    toast.success("Compartiendo en Facebook...");
  };

  const badgeConfig = {
    bestseller: { label: "🔥 Más Vendido", cls: "bg-orange-500 text-white" },
    featured: { label: "⭐ Destacado", cls: "bg-yellow-500 text-black" },
    new: { label: "✨ Nuevo", cls: "bg-blue-500 text-white" },
    oferta: { label: "🏷️ Oferta", cls: "bg-red-500 text-white" },
  };

  return (
    <div className={`bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group flex flex-col ${compact ? "min-w-[240px]" : ""}`}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {listing.badge && (
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${badgeConfig[listing.badge].cls}`}>
              {badgeConfig[listing.badge].label}
            </span>
          )}
          {discount >= 20 && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-destructive text-white">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Share + wishlist */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={shareOnFacebook} className="size-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Compartir en Facebook">
            <Facebook className="size-3.5 text-white" />
          </button>
          <button onClick={e => { e.stopPropagation(); toast.success("Agregado a favoritos"); }} className="size-8 rounded-full bg-black/60 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
            <Star className="size-3.5 text-primary" />
          </button>
        </div>

        {/* Viewers */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <Eye className="size-3 text-primary" />
          <span className="text-[10px] text-white font-mono">{listing.viewers} viendo ahora</span>
        </div>

        {/* Sold today */}
        {listing.soldToday > 5 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Flame className="size-3 text-white" />
            <span className="text-[10px] text-white font-mono">{listing.soldToday} hoy</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-mono text-muted-foreground mb-1 flex items-center gap-1">
          <span className="size-4 rounded-sm bg-primary/10 inline-flex items-center justify-center text-[8px] text-primary font-bold">{listing.vendorAvatar}</span>
          {listing.vendor}
        </div>

        <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2 flex-1">{listing.name}</h3>
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{listing.tagline}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {listing.tags.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-md bg-black/20 border border-border text-[10px] text-muted-foreground">{t}</span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-3 ${i < Math.floor(listing.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
            ))}
          </div>
          <span className="text-xs font-bold">{listing.rating}</span>
          <span className="text-[10px] text-muted-foreground">({listing.reviews.toLocaleString()})</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{listing.sales.toLocaleString()} ventas</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-primary">${listing.price}</span>
              {listing.recurring && <span className="text-xs text-muted-foreground">/mes</span>}
              {listing.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">${listing.originalPrice}</span>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <Download className="size-2.5" />
              Descarga instantánea
            </div>
          </div>
          <Button
            variant="contrast"
            size="sm"
            className="gap-1.5 font-bold text-xs"
            onClick={() => onBuy(listing)}
          >
            <ShoppingCart className="size-3.5" />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal Carousel ──────────────────────────────────────────────────────

function HorizontalCarousel({ title, icon, listings, onBuy }: { title: string; icon: React.ReactNode; listings: MarketplaceListing[]; onBuy: (l: MarketplaceListing) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const shareCarousel = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://pulseai.io/marketplace")}&quote=${encodeURIComponent(`🔥 ${listings.length} productos digitales increíbles en PULSE AI. ¡Mira los mejores!`)}`;
    window.open(url, "_blank", "width=600,height=400");
    toast.success("Compartiendo colección en Facebook...");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={shareCarousel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-medium hover:bg-[#1877F2]/90 transition-colors"
          >
            <Facebook className="size-3.5" /> Compartir
          </button>
          <button onClick={() => scroll("left")} className="size-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface/80 transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => scroll("right")} className="size-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface/80 transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {listings.map(l => (
          <div key={l.id} className="snap-start shrink-0 w-[260px]">
            <ProductCard listing={l} onBuy={onBuy} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : initial), 1000);
    return () => clearInterval(t);
  }, [initial]);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(true);
  const [sortBy, setSortBy] = useState("bestseller");
  const [spIndex, setSpIndex] = useState(0);
  const countdown = useCountdown(3 * 3600 + 42 * 60 + 17);

  // Rotate social proof every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setSpIndex(i => (i + 1) % socialProofMessages.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Show social proof toast on mount
  useEffect(() => {
    const t = setTimeout(() => {
      const msg = socialProofMessages[0];
      toast(
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">{msg.name[0]}</div>
          <div>
            <p className="text-xs font-medium">{msg.name} de {msg.city}</p>
            <p className="text-[10px] text-muted-foreground">compró <span className="text-primary">{msg.product}</span> · {msg.time}</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  const handleBuy = (listing: MarketplaceListing) => {
    setShowRegister(true);
  };

  const filtered = marketplaceListings.filter(l => {
    const matchesCat = activeCategory === "all" || l.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !search || l.name.toLowerCase().includes(q) || l.vendor.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "bestseller") return b.sales - a.sales;
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "new") return (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0);
    return 0;
  });

  const featured = marketplaceListings.filter(l => l.badge === "featured" || l.badge === "bestseller");
  const trending = marketplaceListings.filter(l => l.soldToday > 10);
  const education = marketplaceListings.filter(l => l.category === "education");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      <SiteNav />

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm font-medium flex-wrap">
          <Flame className="size-4 animate-pulse shrink-0" />
          <span className="font-bold">⚡ VENTA FLASH — Hasta 70% de descuento</span>
          <span className="hidden sm:flex items-center gap-2">
            Termina en:
            <span className="font-mono bg-black/20 rounded px-2 py-0.5 text-base font-bold tracking-wider">{countdown}</span>
          </span>
          <button className="underline text-xs opacity-80 hover:opacity-100" onClick={() => setActiveCategory("all")}>
            Ver todas las ofertas →
          </button>
        </div>
      </div>

      {/* Push notification banner */}
      {showPushBanner && (
        <div className="bg-surface border-b border-border px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-primary animate-bounce" />
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">¿Quieres alertas de ofertas exclusivas?</span>
                {" "}Activa las notificaciones y nunca pierdas un deal.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="contrast" className="gap-1.5 text-xs" onClick={() => { toast.success("Notificaciones activadas 🔔"); setShowPushBanner(false); }}>
                <Bell className="size-3.5" /> Activar
              </Button>
              <button onClick={() => setShowPushBanner(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-6">
              <Zap className="size-3.5" />
              Más de 1 millón de compradores satisfechos
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Descubre Productos
              <br />
              <span className="text-primary">Digitales Premium</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Software, cursos, templates y ebooks creados por los mejores del mundo.
              <br />
              <strong className="text-foreground">Compra con Mercado Pago y descarga al instante.</strong>
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Busca por nombre, tecnología, categoría..."
                className="w-full bg-surface border-2 border-border hover:border-primary/30 focus:border-primary/60 rounded-2xl pl-12 pr-4 py-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none transition-colors shadow-lg"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button variant="contrast" size="lg" className="gap-2 font-bold" onClick={() => setShowRegister(true)}>
                <Zap className="size-4" /> Registrarse gratis
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link to="/vender">
                  <Package className="size-4" /> Vende tus productos
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { value: "148+", label: "Productos disponibles", icon: Package },
              { value: "52", label: "Vendedores verificados", icon: Shield },
              { value: "8.4k", label: "Reseñas positivas", icon: Star },
              { value: "$2.4M", label: "En ventas totales", icon: TrendingUp },
            ].map(s => (
              <div key={s.label} className="text-center p-4 rounded-2xl bg-surface border border-border">
                <s.icon className="size-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof ticker */}
      <div className="bg-primary/5 border-b border-primary/10 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="size-2 rounded-full bg-primary animate-pulse shrink-0" />
          <p className="text-sm animate-fade-in">
            <span className="font-bold text-primary">{socialProofMessages[spIndex].name}</span>
            {" de "}{socialProofMessages[spIndex].city}{" acaba de comprar "}
            <span className="text-foreground font-medium">{socialProofMessages[spIndex].product}</span>
            {" · "}{socialProofMessages[spIndex].time}
          </p>
          <Users className="size-3.5 text-muted-foreground ml-auto shrink-0" />
          <span className="text-xs text-muted-foreground hidden sm:block">+{Math.floor(Math.random() * 50 + 200)} activos ahora</span>
        </div>
      </div>

      {/* Category quick links */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {marketplaceCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-primary/10 border-primary/30 text-primary shadow-md shadow-primary/10"
                  : "bg-surface border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              <span className="text-[10px] font-mono opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Carousel */}
      {!search && (
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <HorizontalCarousel
            title="Productos Destacados"
            icon={<Star className="size-5 text-yellow-400" />}
            listings={featured}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Trending Carousel */}
      {!search && (
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <HorizontalCarousel
            title="Tendencias del Día"
            icon={<Flame className="size-5 text-orange-400" />}
            listings={trending}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Education Carousel */}
      {!search && (
        <section className="max-w-7xl mx-auto px-6 pb-10">
          <HorizontalCarousel
            title="Cursos Más Populares"
            icon={<span>🎓</span>}
            listings={education}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Divider with Mercado Pago */}
      {!search && (
        <section className="max-w-7xl mx-auto px-6 pb-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#009EE3]/10 via-surface to-[#009EE3]/5 border border-[#009EE3]/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-xl bg-[#009EE3] flex items-center justify-center shrink-0">
                <span className="text-white font-extrabold text-lg">MP</span>
              </div>
              <div>
                <h3 className="font-bold">Paga con Mercado Pago</h3>
                <p className="text-sm text-muted-foreground">PSE · Nequi · Daviplata · Tarjeta · Efectivo · Cuotas sin interés</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap justify-center">
              {["🔒 Pago seguro", "⚡ Descarga inmediata", "🔄 Garantía 30 días", "📱 App disponible"].map(t => (
                <span key={t} className="font-medium">{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-20 space-y-1">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Categorías</div>
              {marketplaceCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                    activeCategory === cat.id
                      ? "bg-primary/10 border border-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  <span className="flex items-center gap-2"><span>{cat.emoji}</span>{cat.label}</span>
                  <span className="text-[10px] font-mono">{cat.count}</span>
                </button>
              ))}

              <div className="pt-4 border-t border-border mt-4">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Precio</div>
                {["Menos de $50", "$50 - $100", "$100 - $200", "Más de $200"].map(r => (
                  <button key={r} className="w-full flex items-center px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors text-left gap-2">
                    <Tag className="size-3" />{r}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-primary/5 border border-primary/10 p-4">
                <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
                  <Package className="size-3.5 text-primary" />
                  ¿Eres creador?
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">Vende tus productos digitales y gana hasta el 90% de cada venta.</p>
                <Link to="/vender">
                  <Button variant="contrast" size="sm" className="w-full text-xs">
                    Empezar a vender <ArrowRight className="size-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground text-lg">{sorted.length}</span> productos encontrados
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="bestseller">Más vendidos</option>
                  <option value="rating">Mejor valorados</option>
                  <option value="new">Más nuevos</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sorted.map(listing => (
                <ProductCard key={listing.id} listing={listing} onBuy={handleBuy} />
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-24">
                <Search className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No encontramos productos</h3>
                <p className="text-sm text-muted-foreground mb-4">Intenta con otros términos: "React", "Python", "diseño"…</p>
                <Button variant="outline" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
                  Ver todos los productos
                </Button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Social Share Section */}
      <section className="border-t border-border bg-surface/30 px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Comparte con tus amigos</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            ¿Encontraste algo increíble? Comparte el marketplace y gana comisiones por cada venta referida.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => {
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://pulseai.io/marketplace")}`;
                window.open(url, "_blank", "width=600,height=400");
                toast.success("¡Compartido en Facebook!");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1877F2] text-white font-medium hover:bg-[#1877F2]/90 transition-colors"
            >
              <Facebook className="size-5" /> Compartir en Facebook
            </button>
            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent("🔥 Descubrí productos digitales increíbles en PULSE AI — software, cursos y más. ¡Compra y descarga al instante!")}&url=${encodeURIComponent("https://pulseai.io/marketplace")}`;
                window.open(url, "_blank", "width=600,height=400");
                toast.success("¡Compartido en Twitter!");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-medium hover:bg-black/80 transition-colors"
            >
              <Twitter className="size-5" /> Compartir en X
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText("https://pulseai.io/marketplace");
                toast.success("Enlace copiado al portapapeles");
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-medium hover:bg-surface/80 transition-colors"
            >
              <Share2 className="size-5" /> Copiar enlace
            </button>
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="border-t border-border px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Para creadores</div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">¿Quieres vender en el Marketplace?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Únete a más de 50 vendedores verificados. Conserva el <span className="text-primary font-bold">90% de tus ingresos</span>. Pagos con Mercado Pago, Stripe y más.
          </p>
          <Link to="/vender">
            <Button variant="contrast" size="lg" className="gap-2 font-bold text-base px-10">
              <Package className="size-5" /> Registrarme como vendedor
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground flex-wrap">
            {["✓ Gratis para empezar", "✓ Sin mensualidades", "✓ Pagos semanales", "✓ Soporte 24/7"].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Floating social proof */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
        <div className="bg-surface border border-border rounded-2xl p-3 shadow-2xl shadow-black/20 flex items-center gap-3 max-w-[280px] animate-pulse">
          <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {socialProofMessages[spIndex].name[0]}
          </div>
          <div>
            <p className="text-xs font-medium">{socialProofMessages[spIndex].name} de {socialProofMessages[spIndex].city}</p>
            <p className="text-[10px] text-muted-foreground">compró <span className="text-primary font-medium">{socialProofMessages[spIndex].product}</span></p>
          </div>
          <Clock className="size-3 text-muted-foreground shrink-0" />
        </div>
      </div>
    </div>
  );
}
