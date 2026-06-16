import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Store, DollarSign, Star, Package, TrendingUp, Users } from "lucide-react";
import { useAllListings } from "@/lib/products-store";

export const Route = createFileRoute("/dashboard/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — PULSE AI Dashboard" }] }),
  component: MarketplaceDashboard,
});

function MarketplaceDashboard() {
  const listings = useAllListings();

  const totalRevenue = 0;
  const totalProducts = listings.length;

  return (
    <DashboardLayout
      title="Marketplace Multi-Vendor"
      breadcrumb={["Dashboard", "Marketplace"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.success("Invitación de vendor enviada")}>
          + Invitar Vendor
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Store, label: "VENDORS ACTIVOS", value: "0", delta: "Invita vendors al marketplace" },
            { icon: Package, label: "PRODUCTOS PUBLICADOS", value: totalProducts.toString(), delta: totalProducts > 0 ? "en el marketplace" : "Sin productos aún" },
            { icon: DollarSign, label: "INGRESOS TOTALES", value: `$${totalRevenue.toLocaleString("es-CO")}`, delta: "acumulado" },
            { icon: Star, label: "RATING PROMEDIO", value: "—", delta: "Sin ventas aún" },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="size-3.5 text-muted-foreground" />
                <div className="text-xs font-mono text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="text-[10px] mt-1 text-muted-foreground">{m.delta}</div>
            </div>
          ))}
        </div>

        {listings.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-10 flex flex-col items-center text-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Store className="size-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">El marketplace está listo para crecer</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Publica tus propios productos o invita a otros creadores a vender en tu marketplace. Cada venta genera comisión automática.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="contrast" onClick={() => toast.success("Redirigiendo a crear producto")}>
                <Package className="size-4" /> Publicar producto
              </Button>
              <Button variant="outline" onClick={() => toast.success("Invitación enviada")}>
                <Users className="size-4" /> Invitar vendor
              </Button>
            </div>
          </div>
        ) : (
          /* Real listings table */
          <div className="rounded-xl bg-surface border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">Productos en el Marketplace</h3>
              <span className="text-xs text-muted-foreground">{listings.length} publicados</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-black/10">
                    <th className="text-left p-4 text-xs font-mono text-muted-foreground">PRODUCTO</th>
                    <th className="text-right p-4 text-xs font-mono text-muted-foreground">CATEGORÍA</th>
                    <th className="text-right p-4 text-xs font-mono text-muted-foreground">PRECIO</th>
                    <th className="text-right p-4 text-xs font-mono text-muted-foreground">VENTAS</th>
                    <th className="text-right p-4 text-xs font-mono text-muted-foreground">RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id} className="border-b border-border hover:bg-black/5 transition-colors">
                      <td className="p-4">
                        <div className="font-medium truncate max-w-[200px]">{l.name}</div>
                        <div className="text-[10px] text-muted-foreground">{l.vendor}</div>
                      </td>
                      <td className="p-4 text-right text-xs text-muted-foreground">{l.category}</td>
                      <td className="p-4 text-right font-mono text-xs">${l.price.toLocaleString("es-CO")}</td>
                      <td className="p-4 text-right font-mono text-xs">{l.sales}</td>
                      <td className="p-4 text-right font-mono text-xs">
                        <span className="flex items-center gap-1 justify-end">
                          <Star className="size-3 fill-yellow-400 text-yellow-400" />
                          {l.rating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Marketplace features */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, title: "Comisiones automáticas", desc: "Configura el porcentaje de comisión por categoría y PULSE AI distribuye los pagos automáticamente." },
            { icon: Store, title: "Storefronts de marca", desc: "Cada vendor tiene su propia tienda personalizada con URL única dentro del marketplace." },
            { icon: Star, title: "Sistema de reseñas", desc: "Los compradores califican y reseñan productos. Las reseñas generan confianza y aumentan conversiones." },
          ].map(f => (
            <div key={f.title} className="rounded-xl bg-surface border border-border p-5">
              <f.icon className="size-5 text-primary mb-3" />
              <div className="text-sm font-semibold mb-1">{f.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
