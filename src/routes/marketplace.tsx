import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getPremiumImages } from "@/lib/premium-images.functions";
import { toast } from "sonner";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { marketplaceCategories, type MarketplaceListing } from "@/lib/mock-data";
import { useAllListings } from "@/lib/products-store";
import { usePublicProducts } from "@/lib/db";
import { useUserStore } from "@/lib/user-store";
import {
  Search, Star, ShoppingCart, ChevronLeft, ChevronRight,
  Flame, Clock, Eye, Zap, Shield, Download, Bell,
  Share2, X, Check, TrendingUp, Users,
  ArrowRight, Tag, Package, Sparkles, Bot,
} from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace de Productos Digitales | Software, Cursos, Templates — PULSE AI" },
      { name: "description", content: "Compra software, cursos online, templates y eBooks con descarga instantánea. Paga con Mercado Pago, PSE o Nequi. +148 productos verificados con garantía de 30 días. El marketplace digital #1 de Colombia y Latinoamérica." },
      { name: "keywords", content: "marketplace digital colombia, comprar software online, cursos online colombia, templates digitales, ebooks colombia, mercado pago, productos digitales descarga instantanea, afiliados digitales colombia" },
      { property: "og:title", content: "Marketplace de Productos Digitales Premium — PULSE AI" },
      { property: "og:description", content: "+148 productos digitales: software, cursos, templates y eBooks. Paga con Mercado Pago y descarga al instante. Garantía 30 días." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://pulseai.co/marketplace" },
      { name: "twitter:title", content: "Marketplace Productos Digitales Premium — PULSE AI Colombia" },
      { name: "twitter:description", content: "+148 productos: software, cursos, templates y eBooks con Mercado Pago. Descarga instantánea." },
    ],
    links: [{ rel: "canonical", href: "https://pulseai.co/marketplace" }],
  }),
  component: MarketplacePage,
});

// ─── Social proof ─────────────────────────────────────────────────────────────
// Real social proof is derived from actual recent sales. Empty until there are sales.
type SocialProof = { name: string; city: string; product: string; time: string };
const socialProofMessages: SocialProof[] = [];

// ─── AI Search Suggestions ────────────────────────────────────────────────────

function SearchSuggestions({ query, onSelect, onClose, listings }: {
  query: string;
  onSelect: (q: string) => void;
  onClose: () => void;
  listings: MarketplaceListing[];
}) {
  const matches = listings.filter(l =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const categories = marketplaceCategories.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  if (!query || (matches.length === 0 && categories.length === 0)) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
      {categories.length > 0 && (
        <div className="px-4 pt-3 pb-1">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Categorías</div>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => { onSelect(c.label); onClose(); }}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 text-sm text-left"
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      )}
      {matches.length > 0 && (
        <div className="px-4 pt-2 pb-3">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Productos</div>
          {matches.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p.name); onClose(); }}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 text-sm text-left"
            >
              <img src={p.image} alt="" className="size-8 rounded-lg object-cover border border-border" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs truncate">{p.name}</div>
                <div className="text-[10px] text-muted-foreground">{p.vendor} · ${p.price}</div>
              </div>
              <div className="text-[10px] text-primary font-mono">⭐ {p.rating}</div>
            </button>
          ))}
        </div>
      )}
      <div className="border-t border-border px-4 py-2.5">
        <button
          onClick={() => onClose()}
          className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <Bot className="size-3.5" />
          Buscar "{query}" con el asistente IA
        </button>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

const AI_PICKS = ["1", "3", "7", "10"];

const PEXELS_FALLBACKS = [
  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/3861951/pexels-photo-3861951.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/1714202/pexels-photo-1714202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5905716/pexels-photo-5905716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/8546475/pexels-photo-8546475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/15977087/pexels-photo-15977087.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5717755/pexels-photo-5717755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/10352379/pexels-photo-10352379.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/19059657/pexels-photo-19059657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/5899215/pexels-photo-5899215.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

function ProductCard({ listing, onBuy, compact = false }: {
  listing: MarketplaceListing;
  onBuy: (l: MarketplaceListing) => void;
  compact?: boolean;
}) {
  const { addToCart, cart, addToBrowseHistory } = useUserStore();
  const inCart = cart.some(i => i.id === listing.id);
  const discount = listing.originalPrice ? Math.round((1 - listing.price / listing.originalPrice) * 100) : 0;
  const isAIPick = AI_PICKS.includes(listing.id);
  const galleryImages = listing.images && listing.images.length > 1 ? listing.images : [listing.image];
  const [imgIdx, setImgIdx] = useState(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = addToCart(listing);
    added ? toast.success(`"${listing.name}" agregado al carrito 🛒`, { action: { label: "Ver carrito", onClick: () => window.location.href = "/perfil" } }) : toast("Ya está en tu carrito");
    addToBrowseHistory({ id: listing.id, name: listing.name, vendor: listing.vendor, price: listing.price, image: listing.image });
  };

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
    <div className={`bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col ${compact ? "min-w-[240px]" : ""}`}>
      {/* Image / Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <img
          src={galleryImages[imgIdx]}
          alt={listing.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + galleryImages.length) % galleryImages.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="size-3.5 text-white" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % galleryImages.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-6 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="size-3.5 text-white" />
            </button>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                  className={`rounded-full transition-all ${i === imgIdx ? "bg-white size-1.5" : "bg-white/40 size-1"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isAIPick && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-600 text-white flex items-center gap-1">
              <Sparkles className="size-2.5" /> IA Recomienda
            </span>
          )}
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

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button onClick={shareOnFacebook} className="size-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Compartir en Facebook">
            <span className="text-white text-xs font-bold leading-none">f</span>
          </button>
          <button aria-label="Agregar a favoritos" onClick={e => { e.stopPropagation(); toast.success("Agregado a favoritos ❤️"); }} className="size-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
            <Star className="size-3.5 text-yellow-400" />
          </button>
        </div>

        {/* Live viewers */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          <Eye className="size-3 text-primary" />
          <span className="text-[10px] text-white font-mono">{listing.viewers} viendo</span>
        </div>

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
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-primary">${listing.price}</span>
                {listing.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">${listing.originalPrice}</span>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <Download className="size-2.5" /> Descarga instantánea
              </div>
            </div>
            <Button variant="contrast" size="sm" className="gap-1.5 font-bold text-xs shrink-0" onClick={() => { onBuy(listing); addToBrowseHistory({ id: listing.id, name: listing.name, vendor: listing.vendor, price: listing.price, image: listing.image }); }}>
              <ShoppingCart className="size-3.5" /> Comprar
            </Button>
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-full text-xs py-1.5 rounded-xl border transition-all font-medium ${
              inCart
                ? "border-primary/30 text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5"
            }`}
          >
            {inCart ? "✓ En tu carrito" : "+ Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal Carousel ──────────────────────────────────────────────────────

function HorizontalCarousel({ title, icon, listings, onBuy }: {
  title: string;
  icon: React.ReactNode;
  listings: MarketplaceListing[];
  onBuy: (l: MarketplaceListing) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">{icon} {title}</h2>
        <div className="flex items-center gap-2">
          <button aria-label="Desplazar a la izquierda" onClick={() => scroll("left")} className="size-8 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary/30 transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <button aria-label="Desplazar a la derecha" onClick={() => scroll("right")} className="size-8 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary/30 transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
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

// ─── Countdown ────────────────────────────────────────────────────────────────

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const staticListings = useAllListings();
  const { data: dbProducts = [] } = usePublicProducts();
  const fetchPremium = useServerFn(getPremiumImages);
  const { data: premium } = useQuery({
    queryKey: ["premium-images"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => fetchPremium(),
  });

  // Deterministic premium cover picked from Pexels for the product's category.
  const premiumCover = (id: string, category: string | null): string | undefined => {
    const pool =
      (category && premium?.byCategory[category]) ||
      premium?.byCategory.all ||
      [];
    if (pool.length === 0) return undefined;
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return pool[h % pool.length];
  };

  const dbListings: MarketplaceListing[] = dbProducts.map((p) => {
    const cover =
      p.cover_url ??
      premiumCover(p.id, p.category) ??
      PEXELS_FALLBACKS[((() => { let h = 0; for (let i = 0; i < p.id.length; i++) h = (h * 31 + p.id.charCodeAt(i)) >>> 0; return h; })()) % PEXELS_FALLBACKS.length];
    return {
      id: p.id,
      name: p.name,
      vendor: "Tienda PULSE",
      vendorAvatar: "PS",
      category: p.category ?? "Software",
      price: p.price,
      recurring: p.recurring,
      rating: 5,
      reviews: 0,
      sales: 0,
      soldToday: 0,
      viewers: 0,
      badge: "new",
      tagline: p.tagline ?? "",
      image: cover,
      images: p.cover_url ? [p.cover_url] : undefined,
      tags: p.category ? [p.category] : ["Digital"],
    };
  });
  const allListings = [...dbListings, ...staticListings];
  const { addToCart, setPendingCheckoutItems } = useUserStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<MarketplaceListing | null>(null);
  const [showPushBanner, setShowPushBanner] = useState(true);
  const [sortBy, setSortBy] = useState("bestseller");
  const [spIndex, setSpIndex] = useState(0);
  const countdown = useCountdown(3 * 3600 + 42 * 60 + 17);
  const searchRef = useRef<HTMLDivElement>(null);

  // Real metrics derived from actual listings
  const productsCount = allListings.length;
  const vendorsCount = new Set(allListings.map(l => l.vendor)).size;
  const totalReviews = allListings.reduce((s, l) => s + (l.reviews || 0), 0);
  const totalSalesValue = allListings.reduce((s, l) => s + (l.sales || 0) * (l.price || 0), 0);
  const fmtCompact = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const categoriesWithCounts = marketplaceCategories.map(c => ({
    ...c,
    count: c.id === "all" ? allListings.length : allListings.filter(l => l.category === c.id).length,
  }));

  // Rotate social proof
  useEffect(() => {
    if (!socialProofMessages.length) return;
    const t = setInterval(() => setSpIndex(i => (i + 1) % socialProofMessages.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Social proof toast on mount
  useEffect(() => {
    if (!socialProofMessages.length) return;
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

  // Close search suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBuy = (listing: MarketplaceListing) => {
    if (!user) {
      setPendingProduct(listing);
      setShowAuth(true);
      return;
    }
    addToCart(listing);
    setPendingCheckoutItems([{
      id: listing.id,
      name: listing.name,
      tagline: listing.tagline,
      vendor: listing.vendor,
      vendorAvatar: listing.vendorAvatar,
      price: listing.price,
      originalPrice: listing.originalPrice,
      image: listing.image,
      category: listing.category,
      rating: listing.rating,
      totalReviews: listing.reviews,
      totalSales: listing.sales,
      addedAt: new Date().toISOString(),
    }]);
    navigate({ to: "/checkout" });
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (pendingProduct) {
      setPendingProduct(null);
      navigate({ to: "/checkout" });
    }
  };

  const filtered = allListings.filter(l => {
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

  const featured = allListings.filter(l => l.badge === "featured" || l.badge === "bestseller");
  const trending = allListings.filter(l => l.soldToday > 10);
  const education = allListings.filter(l => l.category === "education");
  const aiPicks = allListings.filter(l => AI_PICKS.includes(l.id) || l.id.startsWith("vp-"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showAuth && (
        <AuthModal
          onClose={() => { setShowAuth(false); setPendingProduct(null); }}
          defaultTab="register"
          onSuccess={handleAuthSuccess}
        />
      )}

      <SiteNav />

      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm font-medium flex-wrap">
          <Flame className="size-4 animate-pulse shrink-0" />
          <span className="font-bold">⚡ VENTA FLASH — Hasta 70% de descuento</span>
          <span className="hidden sm:flex items-center gap-2">
            Termina en:
            <span className="font-mono bg-black/20 rounded px-2 py-0.5 text-base font-bold tracking-wider">{countdown}</span>
          </span>
        </div>
      </div>

      {/* Push notification banner */}
      {showPushBanner && (
        <div className="bg-surface border-b border-border px-4 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-primary animate-bounce shrink-0" />
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">¿Quieres alertas de ofertas exclusivas?</span>
                {" "}Activa las notificaciones.
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/4 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-6">
              <Sparkles className="size-3.5" />
              {productsCount > 0 ? `${productsCount} productos digitales verificados` : "Marketplace de productos digitales"}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Descubre Productos
              <br />
              <span className="text-primary">Digitales Premium</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Software, cursos, templates y ebooks creados por los mejores del mundo.
              <br />
              <strong className="text-foreground">Paga con Mercado Pago y descarga al instante.</strong>
            </p>

            {/* Smart Search */}
            <div className="max-w-2xl mx-auto relative mb-6" ref={searchRef}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
                onFocus={() => search && setShowSearch(true)}
                placeholder="Busca cursos, software, templates... o pregúntale a la IA"
                className="w-full bg-surface border-2 border-border hover:border-primary/30 focus:border-primary/60 rounded-2xl pl-12 pr-12 py-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none transition-colors shadow-lg"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {search ? (
                  <button aria-label="Limpiar búsqueda" onClick={() => { setSearch(""); setShowSearch(false); }} className="text-muted-foreground hover:text-foreground">
                    <X className="size-4" />
                  </button>
                ) : (
                  <Bot className="size-5 text-primary/60" />
                )}
              </div>

              {showSearch && (
                <SearchSuggestions
                  query={search}
                  onSelect={q => { setSearch(q); setShowSearch(false); }}
                  onClose={() => setShowSearch(false)}
                  listings={allListings}
                />
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {!user ? (
                <Button variant="contrast" size="lg" className="gap-2 font-bold" onClick={() => setShowAuth(true)}>
                  <Zap className="size-4" /> Registrarse gratis
                </Button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  <Check className="size-4" /> Bienvenido, {user.name.split(" ")[0]}
                </div>
              )}
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link to="/vender">
                  <Package className="size-4" /> Vende tus productos
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust metrics — derived from real listings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { value: String(productsCount), label: "Productos disponibles", icon: Package },
              { value: String(vendorsCount), label: "Vendedores", icon: Shield },
              { value: fmtCompact(totalReviews), label: "Reseñas", icon: Star },
              { value: `$${fmtCompact(totalSalesValue)}`, label: "En ventas totales", icon: TrendingUp },
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

      {/* Social proof ticker — only when there are real recent sales */}
      {socialProofMessages.length > 0 && (
        <div className="bg-primary/5 border-b border-primary/10 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="size-2 rounded-full bg-primary animate-pulse shrink-0" />
            <p className="text-sm">
              <span className="font-bold text-primary">{socialProofMessages[spIndex].name}</span>
              {" de "}{socialProofMessages[spIndex].city}{" acaba de comprar "}
              <span className="text-foreground font-medium">{socialProofMessages[spIndex].product}</span>
              {" · "}{socialProofMessages[spIndex].time}
            </p>
            <Users className="size-3.5 text-muted-foreground ml-auto shrink-0" />
          </div>
        </div>
      )}

      {/* Category quick links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {categoriesWithCounts.map(cat => (
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

      {/* AI Picks Carousel */}
      {!search && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="mb-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-primary/5 border border-purple-500/20 px-4 py-3 flex items-center gap-3">
            <div className="size-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="size-4 text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-sm">Selección de la IA</div>
              <div className="text-[11px] text-muted-foreground">Productos elegidos por nuestro motor de recomendaciones inteligente basado en millones de compras</div>
            </div>
          </div>
          <HorizontalCarousel
            title="Para ti — IA Recomienda"
            icon={<Sparkles className="size-5 text-purple-400" />}
            listings={aiPicks}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Featured */}
      {!search && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <HorizontalCarousel
            title="Productos Destacados"
            icon={<Star className="size-5 text-yellow-400" />}
            listings={featured}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Trending */}
      {!search && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <HorizontalCarousel
            title="Tendencias del Día"
            icon={<Flame className="size-5 text-orange-400" />}
            listings={trending}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Education */}
      {!search && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <HorizontalCarousel
            title="Cursos Más Populares"
            icon={<span>🎓</span>}
            listings={education}
            onBuy={handleBuy}
          />
        </section>
      )}

      {/* Mercado Pago Banner */}
      {!search && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
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
            <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap justify-center">
              {["🔒 Pago seguro", "⚡ Descarga inmediata", "🔄 Garantía 30 días", "📱 App disponible"].map(t => (
                <span key={t} className="font-medium">{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-20 space-y-1">
              {/* AI Insights */}
              <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-primary/5 border border-purple-500/20 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="size-3.5 text-purple-400" />
                  <span className="text-xs font-bold text-purple-300">Insight IA</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Esta semana los cursos de <span className="text-foreground font-medium">Python e IA</span> tienen un 34% más de demanda. ¡Es el momento de aprender!
                </p>
              </div>

              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Categorías</div>
              {categoriesWithCounts.map(cat => (
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
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Precio</div>
                {["Menos de $50", "$50 - $100", "$100 - $200", "Más de $200"].map(r => (
                  <button
                    key={r}
                    onClick={() => toast.info(`Filtrando: ${r}`)}
                    className="w-full flex items-center px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors text-left gap-2"
                  >
                    <Tag className="size-3" />{r}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4">
                <div className="text-xs font-bold mb-2 flex items-center gap-1.5">
                  <Package className="size-3.5 text-primary" />
                  ¿Eres creador?
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">Gana hasta el 90% de cada venta con Mercado Pago.</p>
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
                <span className="text-xs text-muted-foreground">Ordenar:</span>
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
                <Bot className="size-12 text-primary/30 mx-auto mb-4" />
                {allListings.length === 0 ? (
                  <>
                    <h3 className="font-semibold text-lg mb-2">El marketplace está listo para sus primeros productos</h3>
                    <p className="text-sm text-muted-foreground mb-4">¿Tienes un producto digital? Publícalo ahora y llega a miles de compradores.</p>
                    <Button variant="outline" onClick={() => navigate({ to: "/vender" })}>
                      Publicar mi producto
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-2">No encontramos productos</h3>
                    <p className="text-sm text-muted-foreground mb-4">Intenta con otros términos o pídele ayuda al asistente IA.</p>
                    <Button variant="outline" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
                      Ver todos los productos
                    </Button>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Social Share */}
      <section className="border-t border-border bg-surface/30 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Comparte y gana</h2>
          <p className="text-muted-foreground mb-6 text-sm">Recomienda PULSE AI y gana comisiones por cada venta referida.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://pulseai.io/marketplace")}`, "_blank", "width=600,height=400"); toast.success("¡Compartido en Facebook!"); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] text-white font-medium hover:bg-[#1877F2]/90 transition-colors text-sm"
            >
              <span className="font-bold text-base leading-none">f</span> Facebook
            </button>
            <button
              onClick={() => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("🔥 Productos digitales increíbles en PULSE AI — software, cursos y más!")}&url=${encodeURIComponent("https://pulseai.io/marketplace")}`, "_blank", "width=600,height=400"); toast.success("¡Compartido!"); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-black/80 transition-colors text-sm"
            >
              <span className="font-bold text-sm leading-none">𝕏</span> X / Twitter
            </button>
            <button
              onClick={() => { navigator.clipboard?.writeText("https://pulseai.io/marketplace"); toast.success("Enlace copiado"); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border text-foreground font-medium hover:bg-surface/80 transition-colors text-sm"
            >
              <Share2 className="size-4" /> Copiar enlace
            </button>
          </div>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="border-t border-border px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">¿Quieres vender en el Marketplace?</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Conserva el <span className="text-primary font-bold">90% de tus ingresos</span>. Pagos con Mercado Pago, semanales, sin comisiones ocultas.
          </p>
          <Link to="/vender">
            <Button variant="contrast" size="lg" className="gap-2 font-bold px-8">
              <Package className="size-5" /> Registrarme como vendedor
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />

      {/* Social proof widget — only when there are real recent sales */}
      {socialProofMessages.length > 0 && (
        <div className="fixed bottom-6 left-6 z-40 pointer-events-none">
          <div className="bg-surface border border-border rounded-2xl p-3 shadow-2xl shadow-black/20 flex items-center gap-3 max-w-[260px]">
            <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {socialProofMessages[spIndex].name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium truncate">{socialProofMessages[spIndex].name} · {socialProofMessages[spIndex].city}</p>
              <p className="text-[10px] text-muted-foreground truncate">compró <span className="text-primary">{socialProofMessages[spIndex].product}</span></p>
            </div>
            <Clock className="size-3 text-muted-foreground shrink-0" />
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
