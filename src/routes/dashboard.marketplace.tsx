import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { marketplaceVendors, marketplaceListings } from "@/lib/mock-data";
import { Store, DollarSign, Star, Package, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — PULSE AI Dashboard" }] }),
  component: MarketplaceDashboard,
});

const totalRevenue = marketplaceVendors.reduce((a, b) => a + b.revenue, 0);
const totalProducts = marketplaceVendors.reduce((a, b) => a + b.products, 0);
const totalCommissions = marketplaceVendors.reduce((a, b) => a + b.commission, 0);

function MarketplaceDashboard() {
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
            { icon: Store, label: "VENDORS ACTIVOS", value: marketplaceVendors.filter(v => v.status === "active").length.toString() },
            { icon: Package, label: "PRODUCTOS LISTADOS", value: totalProducts.toString() },
            { icon: DollarSign, label: "GMV MARKETPLACE", value: `$${(totalRevenue / 1000).toFixed(0)}k` },
            { icon: TrendingUp, label: "COMISIONES GANADAS", value: `$${totalCommissions.toLocaleString()}` },
          ].map((m) => (
            <div key={m.label} className="p-4 rounded-lg bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className="size-3.5 text-muted-foreground" />
                <div className="text-xs font-mono text-muted-foreground">{m.label}</div>
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Vendors table */}
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Vendors del Marketplace</h3>
            <span className="text-xs text-muted-foreground">{marketplaceVendors.length} vendors</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-black/10">
                  <th className="text-left p-4 text-xs font-mono text-muted-foreground">VENDOR</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">PRODUCTOS</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">INGRESOS</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">COMISIÓN (10%)</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">VALORACIÓN</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">ESTADO</th>
                  <th className="text-right p-4 text-xs font-mono text-muted-foreground">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {marketplaceVendors.map((v) => (
                  <tr key={v.id} className="border-b border-border hover:bg-black/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary">
                          {v.initials}
                        </div>
                        <div>
                          <div className="font-medium">{v.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">@{v.handle} · {v.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-xs">{v.products}</td>
                    <td className="p-4 text-right font-mono text-xs">${v.revenue.toLocaleString()}</td>
                    <td className="p-4 text-right font-mono text-xs text-primary">${v.commission.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="size-3 fill-primary text-primary" />
                        <span className="font-mono text-xs">{v.rating}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        v.status === "active" ? "bg-primary/20 text-primary" :
                        v.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {v.status === "active" ? <CheckCircle className="size-2.5" /> : v.status === "pending" ? <Clock className="size-2.5" /> : <XCircle className="size-2.5" />}
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        {v.status === "pending" && (
                          <Button variant="contrast" size="sm" className="h-7 text-[10px]" onClick={() => toast.success(`${v.name} aprobado`)}>
                            Aprobar
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => toast(`Ver perfil de ${v.name}`)}>
                          Ver
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top listings */}
        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Productos Destacados del Marketplace</h3>
            <Button asChild variant="outline" size="sm">
              <a href="/marketplace" target="_blank" rel="noopener noreferrer">Ver Marketplace Público</a>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {marketplaceListings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary shrink-0">
                    {listing.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium truncate">{listing.name}</div>
                      {listing.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                          listing.badge === "bestseller" ? "bg-primary/20 text-primary" :
                          listing.badge === "featured" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {listing.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{listing.vendor} · {listing.sales} ventas</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="size-3 fill-primary text-primary" />
                    <span>{listing.rating}</span>
                  </div>
                  <div className="font-mono text-sm font-bold">
                    ${listing.price}{listing.recurring && <span className="text-xs text-muted-foreground font-normal">/mo</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketplace settings */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Configuración de Comisiones</h3>
            <div className="space-y-3">
              {[
                { tier: "Starter", range: "$0 - $10k/mes", rate: "15%" },
                { tier: "Growth", range: "$10k - $50k/mes", rate: "12%" },
                { tier: "Scale", range: "$50k+/mes", rate: "10%" },
              ].map((t) => (
                <div key={t.tier} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border">
                  <div>
                    <div className="text-sm font-medium">{t.tier}</div>
                    <div className="text-[10px] text-muted-foreground">{t.range}</div>
                  </div>
                  <div className="text-primary font-mono font-bold">{t.rate}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => toast.success("Configuración guardada")}>
              Actualizar comisiones
            </Button>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6">
            <h3 className="text-sm font-semibold mb-4">Dominio del Marketplace</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-black/20 border border-border">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">URL PÚBLICA</div>
                <div className="text-sm font-mono text-primary">marketplace.pulseai.io</div>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-border">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">DOMINIO PERSONALIZADO</div>
                <div className="text-sm font-mono text-muted-foreground">No configurado</div>
              </div>
              <Button variant="contrast" size="sm" className="w-full" onClick={() => toast("Configuración de dominio (demo)")}>
                Conectar dominio propio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
