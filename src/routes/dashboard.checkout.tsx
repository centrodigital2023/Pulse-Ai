import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShoppingCart, Zap, Tag, TrendingUp, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/dashboard/checkout")({
  head: () => ({ meta: [{ title: "Checkout — PULSE AI Dashboard" }] }),
  component: CheckoutSettings,
});

function CheckoutSettings() {
  return (
    <DashboardLayout
      title="Configuración de Checkout"
      breadcrumb={["Dashboard", "Checkout"]}
      actions={
        <Button variant="contrast" size="sm" onClick={() => toast.success("Cambios guardados")}>
          Guardar cambios
        </Button>
      }
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* General checkout settings */}
        <div className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Configuración General</h3>
            </div>
            {[
              { label: "One-Click Checkout", desc: "Compra con un clic para clientes recurrentes", checked: true },
              { label: "Guardar tarjeta para futuros pagos", desc: "Tokenización segura con Stripe Vault", checked: true },
              { label: "Mostrar testimonios en checkout", desc: "Aumenta conversión mostrando reseñas", checked: true },
              { label: "Abandonar carrito — recuperación automática", desc: "Email automático a los 30 minutos", checked: true },
              { label: "Mostrar contador de urgencia", desc: "Temporizador de oferta limitada", checked: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <div className="text-sm">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                </div>
                <Switch defaultChecked={s.checked} onCheckedChange={() => toast.success("Actualizado")} />
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold">Cupones y Descuentos</h3>
            <div className="flex gap-3">
              <Input placeholder="CODIGO20" className="bg-black/20 font-mono flex-1" />
              <Button variant="outline" onClick={() => toast.success("Cupón creado: CODIGO20 — 20% off")}>Crear</Button>
            </div>
            <div className="space-y-2">
              {[
                { code: "WELCOME20", discount: "20%", uses: "142/500", expires: "Dec 31, 2024" },
                { code: "BLACKFRIDAY50", discount: "50%", uses: "0/∞", expires: "Nov 30, 2024" },
                { code: "STUDENT10", discount: "10%", uses: "89/∞", expires: "Nunca" },
              ].map((c) => (
                <div key={c.code} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border">
                  <div>
                    <code className="text-sm font-mono text-primary">{c.code}</code>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{c.uses} usos · Expira: {c.expires}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{c.discount}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => toast.success(`Cupón ${c.code} eliminado`)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order bumps & upsells */}
        <div className="space-y-6">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Order Bumps</h3>
            </div>
            <p className="text-xs text-muted-foreground">Productos adicionales ofrecidos durante el checkout. Promedio de conversión: 25%.</p>
            <div className="space-y-2">
              {[
                { name: "Neural-Kit SDK", discount: "$50 off", added: 89 },
                { name: "1:1 Mentorship Session", discount: "$50 off", added: 34 },
              ].map((b) => (
                <div key={b.name} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-border">
                  <div>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-[10px] text-muted-foreground">{b.added} ventas adicionales · Descuento: {b.discount}</div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => toast.success("Editando order bump")}>
                    Editar
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Nuevo order bump creado")}>
              + Agregar order bump
            </Button>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Post-Purchase Upsells</h3>
            </div>
            <p className="text-xs text-muted-foreground">Oferta mostrada inmediatamente después de completar la compra. Un clic para agregar al pedido.</p>
            <div className="space-y-2">
              {[
                { name: "Enterprise Design System", originalPrice: 199, upsellPrice: 149, conversions: "18%" },
              ].map((u) => (
                <div key={u.name} className="p-3 rounded-lg bg-black/20 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{u.name}</div>
                    <span className="text-[10px] font-mono text-primary">{u.conversions} conversión</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Precio: <span className="text-foreground">${u.upsellPrice}</span>
                    <span className="line-through ml-2">${u.originalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Nuevo upsell configurado")}>
              + Configurar upsell
            </Button>
          </div>

          {/* Checkout preview */}
          <div className="rounded-xl bg-surface border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Vista Previa del Checkout</h3>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[10px]" onClick={() => window.open("/checkout", "_blank")}>
                <ExternalLink className="size-3" /> Abrir
              </Button>
            </div>
            <div className="aspect-video rounded-lg bg-black/40 border border-border overflow-hidden flex items-center justify-center">
              <div className="text-center p-6">
                <ShoppingCart className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/50">Vista previa del checkout</p>
                <p className="text-[10px] text-muted-foreground/30 mt-1">Haz clic en "Abrir" para ver el checkout completo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
