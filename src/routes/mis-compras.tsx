import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUserStore, fmtCOP } from "@/lib/user-store";
import {
  Download, Package, Star, ExternalLink, Search,
  FileText, Video, Code, BookOpen, Clock, CheckCircle, ShoppingBag,
} from "lucide-react";

export const Route = createFileRoute("/mis-compras")({
  head: () => ({ meta: [{ title: "Mis Compras — PULSE AI" }] }),
  component: MisCompras,
});

interface Purchase {
  id: string;
  orderId: string;
  product: string;
  vendor: string;
  type: "course" | "software" | "ebook" | "template";
  price: number;
  date: string;
  status: "completed" | "processing" | "refunded";
  downloads: number;
  image: string;
  rating?: number;
}

const mockPurchases: Purchase[] = [
  {
    id: "p1",
    orderId: "PLS-2024-001",
    product: "Python para Data Science — Curso Completo",
    vendor: "DataMaster Pro",
    type: "course",
    price: 149,
    date: "2024-03-15",
    status: "completed",
    downloads: 3,
    image: "https://picsum.photos/seed/course1/80/80",
    rating: 5,
  },
  {
    id: "p2",
    orderId: "PLS-2024-002",
    product: "React & TypeScript Avanzado",
    vendor: "CodeCraft Academy",
    type: "course",
    price: 199,
    date: "2024-02-28",
    status: "completed",
    downloads: 1,
    image: "https://picsum.photos/seed/course2/80/80",
    rating: 4,
  },
  {
    id: "p3",
    orderId: "PLS-2024-003",
    product: "Neural-Kit SDK v2.0",
    vendor: "AI Dev Tools",
    type: "software",
    price: 299,
    date: "2024-01-10",
    status: "completed",
    downloads: 5,
    image: "https://picsum.photos/seed/sdk1/80/80",
  },
  {
    id: "p4",
    orderId: "PLS-2024-004",
    product: "Pack de Plantillas UI Premium",
    vendor: "DesignForge",
    type: "template",
    price: 79,
    date: "2024-01-05",
    status: "completed",
    downloads: 2,
    image: "https://picsum.photos/seed/tmpl1/80/80",
    rating: 5,
  },
  {
    id: "p5",
    orderId: "PLS-2024-005",
    product: "Guía SEO Avanzado 2024",
    vendor: "Marketing Pro",
    type: "ebook",
    price: 49,
    date: "2023-12-20",
    status: "completed",
    downloads: 1,
    image: "https://picsum.photos/seed/ebook1/80/80",
    rating: 3,
  },
];

const typeIcon: Record<Purchase["type"], typeof Download> = {
  course: Video,
  software: Code,
  ebook: BookOpen,
  template: FileText,
};

const typeLabel: Record<Purchase["type"], string> = {
  course: "Curso",
  software: "Software",
  ebook: "eBook",
  template: "Plantilla",
};

const statusBadge: Record<Purchase["status"], { label: string; cls: string }> = {
  completed: { label: "Completado", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  processing: { label: "Procesando", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  refunded: { label: "Reembolsado", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function StarRating({ value, onChange }: { value?: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          onClick={() => onChange?.(s)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star className={`size-3.5 ${s <= (value ?? 0) ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );
}

function PurchaseCard({ purchase, onRate }: { purchase: Purchase; onRate: (id: string, r: number) => void }) {
  const Icon = typeIcon[purchase.type];
  const badge = statusBadge[purchase.status];

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden hover:border-primary/20 transition-colors">
      <div className="flex gap-4 p-5">
        <div className="relative shrink-0">
          <img
            src={purchase.image}
            alt={purchase.product}
            className="size-16 rounded-xl object-cover border border-border"
          />
          <div className="absolute -bottom-1.5 -right-1.5 size-6 rounded-lg bg-surface border border-border flex items-center justify-center">
            <Icon className="size-3 text-primary" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm leading-tight">{purchase.product}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {purchase.vendor} · <span className="font-mono text-primary">${purchase.price}</span> · {typeLabel[purchase.type]}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(purchase.date).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="flex items-center gap-1">
              <Download className="size-3" />
              {purchase.downloads} descarga{purchase.downloads !== 1 ? "s" : ""}
            </div>
            <span className="font-mono">{purchase.orderId}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-4 bg-black/10">
        <div className="flex items-center gap-3">
          {purchase.rating ? (
            <div className="flex items-center gap-1.5">
              <StarRating value={purchase.rating} />
              <span className="text-[11px] text-muted-foreground">Tu reseña</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <StarRating onChange={(r) => onRate(purchase.id, r)} />
              <span className="text-[11px] text-muted-foreground">Calificar</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2.5 py-1.5">
            <FileText className="size-3" />
            Factura
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg px-2.5 py-1.5 bg-primary/5">
            <Download className="size-3" />
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
}

function getCategoryType(cat: string): Purchase["type"] {
  if (cat === "education") return "course";
  if (cat === "books") return "ebook";
  if (cat === "resources") return "template";
  return "software";
}

function MisCompras() {
  const { user } = useAuth();
  const { orders } = useUserStore();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(!user);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Purchase["type"]>("all");

  // Real purchases from store, mapped to Purchase shape
  const realPurchases = useMemo<Purchase[]>(() =>
    orders
      .filter(o => o.status === "completed")
      .flatMap(order =>
        order.items.map(item => ({
          id: `${order.id}-${item.id}`,
          orderId: `PLS-${order.id.slice(-8).toUpperCase()}`,
          product: item.name,
          vendor: item.vendor,
          type: getCategoryType(item.category),
          price: item.price,
          date: order.paidAt,
          status: "completed" as const,
          downloads: 1,
          image: item.image,
          rating: ratings[`${order.id}-${item.id}`],
        }))
      ),
  [orders, ratings]);

  // Show real purchases first, then demo ones if no real data yet
  const allPurchases = realPurchases.length > 0
    ? realPurchases
    : mockPurchases;

  const handleRate = (id: string, rating: number) => {
    setRatings(prev => ({ ...prev, [id]: rating }));
  };

  if (!user && !showAuth) {
    return (
      <>
        <SiteNav />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
          <div className="size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Package className="size-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Inicia sesión para ver tus compras</h1>
            <p className="text-muted-foreground text-sm">Accede a todos tus productos, descargas y facturas.</p>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Iniciar sesión
          </button>
          <AuthModal onClose={() => { setShowAuth(false); if (!user) navigate({ to: "/marketplace" }); }} />
        </div>
        <SiteFooter />
      </>
    );
  }

  const filtered = allPurchases.filter(p => {
    const matchSearch = !search || p.product.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.type === filter;
    return matchSearch && matchFilter;
  });

  const totalSpent = allPurchases.filter(p => p.status === "completed").reduce((a, p) => a + p.price, 0);


  return (
    <>
      <SiteNav />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ShoppingBag className="size-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Mis Compras</h1>
                <p className="text-sm text-muted-foreground">Hola, {user?.name?.split(" ")[0]} — todos tus productos digitales</p>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Productos", value: allPurchases.filter(p => p.status === "completed").length.toString() },
              { label: "Total invertido", value: fmtCOP(totalSpent) },
              { label: "Descargas", value: allPurchases.reduce((a, p) => a + p.downloads, 0).toString() },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-surface border border-border p-4 text-center">
                <div className="text-2xl font-extrabold tracking-tight text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar productos..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "course", "software", "ebook", "template"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "Todos" : typeLabel[f]}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No se encontraron compras</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(p => (
                <PurchaseCard key={p.id} purchase={p} onRate={handleRate} />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-surface border border-border p-6 text-center">
            <CheckCircle className="size-10 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">¿Listo para aprender más?</h3>
            <p className="text-sm text-muted-foreground mb-4">Explora miles de cursos y recursos premium.</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <ExternalLink className="size-4" />
              Ir al Marketplace
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
