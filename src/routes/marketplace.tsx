import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { Button } from "@/components/ui/button";
import { marketplaceListings, marketplaceCategories } from "@/lib/mock-data";
import { Search, Star, ShoppingCart, Filter, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — PULSE AI" },
      { name: "description", content: "Descubre miles de productos digitales: software, cursos, templates, ebooks y más." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = marketplaceListings.filter((l) => {
    const matchesCat = activeCategory === "all" || l.category === activeCategory;
    const matchesSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.vendor.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* Header */}
      <section className="relative border-b border-border bg-surface/30 px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Marketplace Global</div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Descubre Productos Digitales Premium
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Miles de productos creados por los mejores desarrolladores, diseñadores y educadores del mundo.
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos, vendors, categorías..."
              className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-xs text-muted-foreground">
            {[
              { value: "148+", label: "Productos" },
              { value: "52", label: "Vendors" },
              { value: "8.4k", label: "Reseñas" },
              { value: "$2.4M", label: "GMV Total" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-base font-bold text-foreground">{s.value}</div>
                <div>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar categories */}
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-20 space-y-1">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Categorías</div>
              {marketplaceCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    activeCategory === cat.id
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono">{cat.count}</span>
                </button>
              ))}

              <div className="pt-4 border-t border-border mt-4">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Filtros</div>
                {["Más vendidos", "Mejor valorados", "Más nuevos", "Precio: menor a mayor"].map((f) => (
                  <button key={f} className="w-full flex items-center px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-surface transition-colors text-left">
                    <Filter className="size-3 mr-2" />{f}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main grid */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filtered.length}</span> productos encontrados
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-primary" />
                <span>Ordenado por: Más vendidos</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((listing) => (
                <div key={listing.id} className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
                  {/* Product image placeholder */}
                  <div className="aspect-video bg-black/40 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                        {listing.name[0]}
                      </div>
                    </div>
                    {listing.badge && (
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                          listing.badge === "bestseller" ? "bg-primary text-primary-foreground" :
                          listing.badge === "featured" ? "bg-yellow-500 text-black" :
                          "bg-blue-500 text-white"
                        }`}>
                          {listing.badge === "bestseller" ? "Más Vendido" : listing.badge === "featured" ? "Destacado" : "Nuevo"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wide">{listing.vendor}</div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{listing.name}</h3>
                    <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{listing.tagline}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-primary text-primary" />
                        <span className="text-xs font-mono">{listing.rating}</span>
                        <span className="text-[10px] text-muted-foreground">({listing.reviews})</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{listing.sales.toLocaleString()} ventas</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg">
                        ${listing.price}
                        {listing.recurring && <span className="text-xs text-muted-foreground font-normal">/mo</span>}
                      </div>
                      <Button variant="contrast" size="sm" className="gap-1.5" onClick={() => toast.success(`${listing.name} agregado al carrito`)}>
                        <ShoppingCart className="size-3.5" /> Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <Search className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Vendor CTA */}
      <section className="border-t border-border bg-surface/30 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">¿Quieres vender en el Marketplace?</h2>
          <p className="text-muted-foreground mb-8">
            Únete a más de 50 vendors que ya venden sus productos digitales en PULSE AI. Paga solo el 10% de comisión.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild variant="contrast" size="lg">
              <Link to="/dashboard">Crear mi tienda</Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => toast("Contáctanos en hola@pulseai.io")}>
              Contactar ventas
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
